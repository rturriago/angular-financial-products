# Productos Financieros

Aplicación Angular para administrar los productos financieros de un banco: listado, búsqueda, cantidad de registros, creación y edición, consumiendo una API REST local.

Desarrollada como prueba técnica de Frontend para el perfil **SemiSenior**.

## Alcance

| Funcionalidad                             | Estado                       |
| ----------------------------------------- | ---------------------------- |
| **F1** Listado de productos financieros   | ✅                           |
| **F2** Búsqueda de productos              | ✅                           |
| **F3** Cantidad de registros (5, 10 y 20) | ✅                           |
| **F4** Agregar producto con validaciones  | ✅                           |
| **F5** Editar producto (deseable)         | ✅                           |
| Uso de rutas (deseable)                   | ✅                           |
| F6 Eliminar producto                      | Fuera del alcance del perfil |

## Tecnologías

- **Angular 22**: componentes standalone, signals, zoneless y `OnPush`
- **TypeScript 6** en modo estricto (`strict` y `strictTemplates`)
- **Reactive Forms** tipados
- **RxJS 7**
- **Jest 30** con `jest-preset-angular`
- **ESLint** (`angular-eslint`) y **Prettier**
- **SCSS** propio, sin frameworks de estilos ni componentes prefabricados

## Requisitos

- Node.js 22.22, 24.15 o superior (requisito de Angular 22)
- npm 8 o superior
- El backend del reto (`repo-interview-main`) corriendo en `http://localhost:3002`

## Instalación y ejecución

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

### Backend

1. Descomprimir `repo-interview-main.zip`.
2. En esa carpeta, ejecutar `npm install` y luego `npm run start:dev`.
3. El servicio queda disponible en `http://localhost:3002`.

La URL base de la API se configura en [`src/environments/environment.ts`](src/environments/environment.ts).

### Origen de los datos

La aplicación incluye dos implementaciones del repositorio de productos, intercambiables en [`src/app/app.config.ts`](src/app/app.config.ts):

```ts
{ provide: ProductRepository, useClass: ProductHttpRepository }      // API real
{ provide: ProductRepository, useClass: ProductInMemoryRepository }  // datos en memoria
```

La implementación en memoria imita las respuestas y los errores de la API (400 y 404). Sirve para desarrollar sin backend; sus datos se reinician al recargar la página.

> **Nota sobre el backend:** durante el desarrollo no se tuvo acceso al archivo `repo-interview-main.zip`, por lo que la aplicación se construyó y se probó con `ProductInMemoryRepository`, que es la implementación configurada por defecto.
>
> `ProductHttpRepository` está implementado según el contrato documentado de la API (endpoints, formato `{ data }`, `PUT` sin `id` en el body y verificación de id) y cubierto por tests unitarios con `HttpTestingController`, pero no se ha probado contra el servidor real. Para usarlo, basta con cambiar `useClass` en `app.config.ts`; ningún componente necesita modificarse.

## Scripts

| Comando                 | Descripción                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm start`             | Servidor de desarrollo en `http://localhost:4200`     |
| `npm test`              | Ejecuta los tests unitarios                           |
| `npm run test:watch`    | Tests en modo observación                             |
| `npm run test:coverage` | Tests con reporte de coverage (falla si baja del 70%) |
| `npm run typecheck`     | Verifica los tipos de la aplicación y de los tests    |
| `npm run lint`          | Revisa el código con ESLint                           |
| `npm run format`        | Formatea el código con Prettier                       |
| `npm run build`         | Compila para producción en `dist/`                    |

## Calidad

- **151 tests unitarios** en 26 suites.
- **Coverage del 100%** en sentencias, ramas, funciones y líneas. El mínimo exigido es 70% y está configurado como umbral en [`jest.config.js`](jest.config.js).
- Lint sin errores, con reglas adicionales: `no-explicit-any`, `OnPush` obligatorio y `eqeqeq`.

Jest transpila los tests sin verificar tipos, por eso existe el script `typecheck`.

## Arquitectura

Organización por funcionalidad (_feature-based_):

```
src/app/
├── core/                       Piezas únicas y transversales
│   ├── http/                   ApiError, interceptor de errores, envoltorio de respuestas
│   ├── layout/                 Header de la aplicación
│   └── notifications/          Servicio y componente de notificaciones
├── features/products/          Todo lo del dominio "producto"
│   ├── data-access/            Contrato ProductRepository e implementaciones HTTP y en memoria
│   ├── models/                 Modelo Product y reglas de validación
│   ├── pages/                  Componentes smart: listado, creación y edición
│   ├── components/             Componentes presentacionales: tabla, formulario, logo
│   ├── validators/             Validador de id único y de fecha de revisión
│   ├── utils/                  Filtro de búsqueda
│   └── testing/                Fixtures y mocks para los tests
└── shared/                     Reutilizable y sin dominio
    ├── ui/                     Buscador, selector, menú desplegable, campo de formulario
    ├── forms/                  Traducción de errores de validación a mensajes
    ├── validators/             Validador de fecha mínima
    └── utils/                  Fechas ISO, normalización de texto, iniciales
```

### Rutas

| Ruta                 | Página                                       |
| -------------------- | -------------------------------------------- |
| `/products`          | Listado con búsqueda y cantidad de registros |
| `/products/new`      | Formulario de registro                       |
| `/products/:id/edit` | Formulario de edición                        |

Todas las páginas se cargan de forma diferida (_lazy loading_).

## Decisiones de diseño

**Inversión de dependencias en el acceso a datos.** Los componentes dependen de la clase abstracta `ProductRepository`, no de `HttpClient`. Se usa una clase abstracta y no una interfaz porque las interfaces desaparecen al compilar y el inyector de Angular necesita un token que exista en tiempo de ejecución. Esto permite intercambiar la API real por datos en memoria y testear las páginas con mocks, sin red.

**Componentes smart y presentacionales.** Las páginas coordinan datos, navegación y errores. La tabla, el formulario y los componentes de `shared/ui` solo reciben datos por `input()` y emiten eventos por `output()`. El mismo `ProductFormComponent` se usa para crear y editar, configurado con inputs (`initialProduct`, `lockId`, `title`), sin condicionales de modo.

**Estado derivado con signals.** La lista filtrada, la lista visible y el contador de resultados son `computed()`. No se guardan ni se sincronizan a mano, así que no pueden quedar desactualizados.

**Búsqueda y paginación en el frontend.** La API devuelve todos los productos, así que la búsqueda (por nombre y descripción, sin distinguir mayúsculas ni tildes) y el límite de registros se resuelven en el cliente. "N Resultados" muestra la cantidad de filas visibles, siguiendo la redacción del requisito y el diseño D1.

**Obtener un producto por id.** La API no expone `GET /bp/products/:id`. El repositorio implementa `getById` buscando en la lista y responde con un error 404 si no existe. La página de edición funciona al recargar o al abrir el enlace directo; si el backend agrega el endpoint, solo cambia ese método.

**Validación asíncrona del id.** `UniqueProductIdValidator` espera 300 ms antes de consultar la API. Angular cancela la validación anterior cuando el valor cambia, así que se envía una sola petición cuando el usuario deja de escribir. Si la verificación falla, el campo lo indica en lugar de dejarlo pasar.

**Fechas sin desfase de zona horaria.** `new Date('2025-01-01')` se interpreta en UTC y en zonas negativas corresponde al día anterior. Las fechas se manejan como texto `yyyy-MM-dd`, que se ordena igual alfabética y cronológicamente, y solo se convierten a `Date` con componentes locales.

**Fecha de revisión calculada.** Se calcula automáticamente un año después de la liberación y el campo queda deshabilitado. Si la liberación es el 29 de febrero, la revisión queda el 28 de febrero del año siguiente. Un validador de grupo garantiza la regla. Como el campo está deshabilitado, el envío usa `getRawValue()`.

**Edición con id bloqueado.** El id se deshabilita desde el `FormControl` y no con `readonly`: así Angular no ejecuta su validador asíncrono, que de otro modo encontraría que el id ya existe. Las validaciones de F4 se mantienen en la edición, incluida la fecha de liberación igual o mayor a la actual.

**Manejo de errores.** Un interceptor convierte cualquier error HTTP en un `ApiError` con un mensaje legible según el status (0, 400, 404 u otro). Las páginas muestran el mensaje junto a la acción que falló, con opción de reintentar en el listado. Los guardados exitosos se confirman con una notificación.

**Mensajes de validación extensibles.** Los errores de cada campo se traducen a texto con un mapa (`getFieldErrorMessage`). Los límites de longitud salen de `PRODUCT_RULES`, así que el número del mensaje y el de la validación tienen una única fuente.

## Accesibilidad

- Etiquetas asociadas a cada campo, `aria-invalid` y `aria-describedby` para los errores.
- Menú de acciones con `aria-haspopup`, `aria-expanded`, roles `menu` y `menuitem`, cierre con Escape y etiqueta por producto.
- Mensajes de carga, error y notificaciones anunciados con `role="status"`, `role="alert"` y `aria-live`.
- Logos con texto alternativo; si la imagen falta o no carga, se muestran las iniciales del producto.

## Diseño responsive

En pantallas pequeñas la tabla se desplaza horizontalmente y el formulario pasa a una sola columna.
