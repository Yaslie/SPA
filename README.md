# Country SPA

Proyecto final hecho con Angular 20 para consultar paises desde la API publica de
REST Countries. La app usa rutas hijas, rutas anidadas, lazy loading, Tailwind CSS,
DaisyUI, RxJS, cache y PWA.

## Funcionalidades

- Busqueda de paises por nombre.
- Busqueda por capital.
- Filtro por region usando query parameters.
- Vista de detalle por codigo de pais.
- Favoritos guardados en `localStorage`.
- Busquedas recientes guardadas en el navegador.
- Cache en peticiones HTTP para evitar repetir llamadas iguales.
- Pantalla de favoritos con ruta hija `/countries/favorites/help`.
- Aplicacion configurada como PWA con manifest y service worker.

## Temas aplicados de la practica

- Rutas hijas y anidadas en `src/app/countries/countries-routing-module.ts`.
- Carga perezosa del modulo `CountriesModule` desde `src/app/app-routing-module.ts`.
- Componentes reutilizables con `@Input` y `@Output`.
- Servicio compartido `CountriesService` para API, cache, favoritos y estado.
- Senales de Angular para `loading`, errores, favoritos y busquedas recientes.
- Operadores de RxJS: `map`, `mergeMap`, `debounceTime`, `distinctUntilChanged`,
  `catchError`, `finalize` y `shareReplay`.
- Query params en busquedas y filtro de region.
- Tailwind CSS y DaisyUI para la interfaz.

## Rutas principales

- `/countries/home`
- `/countries/by-country?q=mexico`
- `/countries/by-capital?q=madrid`
- `/countries/by-region?region=americas`
- `/countries/country/MEX`
- `/countries/favorites`
- `/countries/favorites/help`

## Comandos

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm start
```

Compilar produccion:

```bash
npm run build
```

La salida de produccion queda en:

```text
dist/country-spa/browser
```

## API

La aplicacion consume:

```text
https://restcountries.com/v3.1
```

Endpoints usados:

- `/name/{name}`
- `/capital/{capital}`
- `/region/{region}`
- `/alpha/{code}`

## Puntos para mostrar en el video

- Entrar al home y explicar que `countries` carga de forma perezosa.
- Buscar un pais y mostrar que el texto queda en la URL como `q`.
- Buscar por capital y explicar el debounce del input.
- Filtrar por region y compartir la URL con `region`.
- Abrir el detalle de un pais.
- Guardar y quitar favoritos.
- Abrir `/countries/favorites/help` para mostrar la ruta anidada.
- Ejecutar `npm run build` y mostrar que se genera `ngsw-worker.js`.
