# Country SPA

Proyecto final hecho con Angular 20 para consultar paises desde la API publica de
REST Countries. La app usa rutas hijas, rutas anidadas, lazy loading, Tailwind CSS,
DaisyUI, RxJS, cache y PWA.

## Enlaces

- Aplicacion desplegada como PWA: https://yaslie.github.io/SPA/
- Repositorio: https://github.com/Yaslie/SPA
- Workflow de despliegue: `.github/workflows/deploy-pages.yml`

## Funcionalidades

- Busqueda de paises por nombre.
- Busqueda por capital.
- Filtro por region usando query parameters.
- Vista de detalle por codigo de pais.
- Favoritos guardados en `localStorage`.
- Busquedas recientes guardadas en el navegador.
- Cache en peticiones HTTP para evitar repetir llamadas iguales.
- Respaldo local en `public/data/countries.json` para que la demo funcione sin API key.
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

- `https://yaslie.github.io/SPA/countries/home`
- `https://yaslie.github.io/SPA/countries/by-country?q=mexico`
- `https://yaslie.github.io/SPA/countries/by-capital?q=madrid`
- `https://yaslie.github.io/SPA/countries/by-region?region=americas`
- `https://yaslie.github.io/SPA/countries/country/MEX`
- `https://yaslie.github.io/SPA/countries/favorites`
- `https://yaslie.github.io/SPA/countries/favorites/help`

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
https://api.restcountries.com/countries/v5
```

REST Countries v5 requiere API key para consultar datos reales desde frontend. La app
intenta consumir esa API y, si no hay credenciales o el navegador bloquea la peticion,
usa el JSON local de respaldo.

El respaldo local esta en `public/data/countries.json`. En el servicio se carga con
la ruta relativa `data/countries.json` para que funcione en GitHub Pages, donde la app
se publica dentro de `/SPA/`.

Para probar con una key real, se puede guardar en el navegador:

```js
localStorage.setItem('country-spa-api-key', 'TU_API_KEY')
```

Rutas/consultas usadas:

- `/name?q={name}`
- `?capitals.name={capital}`
- `?region={region}`
- `/codes.alpha_3/{code}`

## Puntos para mostrar en el video

- Entrar al home y explicar que `countries` carga de forma perezosa.
- Buscar un pais y mostrar que el texto queda en la URL como `q`.
- Buscar por capital y explicar el debounce del input.
- Filtrar por region y compartir la URL con `region`.
- Abrir el detalle de un pais.
- Guardar y quitar favoritos.
- Abrir `/countries/favorites/help` para mostrar la ruta anidada.
- Ejecutar `npm run build` y mostrar que se genera `ngsw-worker.js`.

## Despliegue PWA

El repositorio incluye un workflow en `.github/workflows/deploy-pages.yml` para
publicar automaticamente la app en GitHub Pages cuando se actualiza `main`.

URL esperada:

```text
https://yaslie.github.io/SPA/
```

El workflow compila Angular con `--base-href /SPA/`, publica la carpeta
`dist/country-spa/browser` y copia `index.html` como `404.html` para conservar las
rutas internas de la SPA.

Si despues de un despliegue Chrome muestra una version anterior, puede ser por el
cache del service worker de la PWA. Se puede actualizar con `Ctrl + F5`, cerrando y
abriendo de nuevo la app, o desde DevTools > Application > Service Workers.
