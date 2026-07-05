import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: false,
  templateUrl: './search-box.html',
})
export class SearchBox implements OnInit, OnChanges {
  @Input() label = 'Buscar';
  @Input() placeholder = 'Escribe para buscar';
  @Input() value = '';
  @Input() disabled = false;
  @Output() search = new EventEmitter<string>();

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        map((value) => value.trim()),
        debounceTime(450),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.search.emit(term));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value !== this.searchControl.value) {
      this.searchControl.setValue(this.value, { emitEvent: false });
    }

    if (changes['disabled']) {
      this.syncDisabledState();
    }
  }

  protected submitSearch(): void {
    this.search.emit(this.searchControl.value.trim());
  }

  protected clearSearch(): void {
    this.searchControl.setValue('');
    this.search.emit('');
  }

  private syncDisabledState(): void {
    if (this.disabled && this.searchControl.enabled) {
      this.searchControl.disable({ emitEvent: false });
    }

    if (!this.disabled && this.searchControl.disabled) {
      this.searchControl.enable({ emitEvent: false });
    }
  }
}
