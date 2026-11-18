![Banner](./assets/banner.svg)

# 📝 Batoibooks

![JavaScript](https://img.shields.io/badge/-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646cff?style=for-the-badge&logo=vite&logoColor=white) ![Vitest](https://img.shields.io/badge/-Vitest-6e9f18?style=for-the-badge&logo=vitest&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)

![Version](https://img.shields.io/badge/version-1.0.0-4b61c9?style=for-the-badge)

BatoiBooks es una aplicación para consultar y gestionar libros de texto y apuntes de segunda mano. Permite añadir, editar y eliminar libros, además de añadirlos a un carrito de compra. Los cambios en los libros se guardan mediante una API HTTP. Está desarrollada con JavaScript y Vite, y cuenta con pruebas automatizadas con Vitest.

## ⚙️ Tecnologías

- 🧪 **Pruebas**: Vitest, jsdom, MSW
- 💾 **Persistencia**: JSON Server
- 🐳 **Infraestructura**: Docker, GitHub Actions
- 🔧 **Herramientas**: Vite, Node.js

## ✨ Características

- 🚀 Desarrollo rápido con Vite y servidor en vivo
- 🧪 Pruebas unitarias automatizadas con Vitest
- 🐳 Contenedorizado con Docker para entornos consistentes
- 🔌 Servicios HTTP centralizados en `src/services/api.js`
- 📚 Colecciones de libros, usuarios y módulos persistentes
- 🔧 Filtrado y consulta de libros por usuario, módulo y estado
- 🖥️ Listado de libros y desplegable de módulos generados en el DOM
- ➕ Formulario compartido para añadir y editar libros; botones en cada tarjeta para comprar, editar o eliminar
- ✅ Validación de módulo, editorial, precio, páginas y estado con errores por campo en castellano antes de guardar
- 🔎 Comprobación en el servidor de que el usuario no tenga otro libro del módulo elegido
- 🧭 Navegación entre listado, formulario y página de información sin recargar la aplicación
- 🛒 Carrito en memoria que guarda una copia del libro y avisa si ya está añadido
- 💬 Confirmación antes de eliminar y mensajes de resultado de las acciones
- ⚙️ Flujo de trabajo CI/CD automatizado con GitHub Actions

Al cambiar el módulo, la aplicación consulta los libros del usuario y bloquea temporalmente el botón Guardar hasta recibir la respuesta. Si el módulo está repetido, muestra el error junto al selector. Al corregir un campo o reiniciar el formulario, actualiza o borra su mensaje. La comprobación desde el navegador ayuda a evitar duplicados, pero JSON Server no impone esta regla a las peticiones hechas directamente a la API.

<!-- readme-gen:architecture:start -->

## 🏗️ Arquitectura

```mermaid
%%{init: {
    "theme": "base",
    "flowchart": { "curve": "basis", "nodeSpacing": 60, "rankSpacing": 90 },
    "themeVariables": {
        "primaryColor": "#1f2937",
        "primaryTextColor": "#f9fafb",
        "primaryBorderColor": "#60a5fa",
        "lineColor": "#94a3b8",
        "tertiaryColor": "#0f172a"
    }
}}%%

flowchart LR
    app["src/main.js"] --> controller["src/controller"]
    app --> router["src/services/router.js"]
    controller --> view["src/view"]
    controller --> model["src/model"]
    controller --> cart["Cart en memoria"]
    model --> api["src/services/api.js"]
    api -- HTTP --> database["JSON Server<br/>src/data/batoibooks.json"]
    view -- DOM --> page["index.html"]
    router -- navegación --> page
```

| Componente | Detalle |
| ---------- | ------- |
| Entrada | `src/main.js` crea la página a partir de la plantilla de `index.html`, inicia el controlador y conecta el enrutador. |
| Enrutador | `src/services/router.js` muestra la sección correspondiente y abre el formulario de edición sin reiniciarlo. |
| Controlador | `src/controller/` coordina la carga, las acciones sobre libros y la comprobación asíncrona del módulo elegido. |
| Vista | `src/view/` renderiza la interfaz, valida el formulario con la API de HTML5 y muestra los errores en cada campo. |
| Modelo y API | `src/model/` consulta `src/services/api.js`; `Books.bookExists` pide a JSON Server los libros filtrados por usuario y módulo. |
| Carrito | `src/model/cart.class.js` guarda copias de libros en memoria durante la sesión. |
| Pruebas | Vitest comprueba modelo, carrito, vista, controlador, navegación y validación; jsdom simula el DOM y MSW la API. |

<!-- readme-gen:architecture:end -->

## 🗂️ Estructura del proyecto

```txt
batoibooks/
├── .github/                 # Configuración de GitHub
│   └── workflows/           # Flujos de CI/CD
│       └── ci.yml           # Flujo de CI
├── assets/                  # Recursos del proyecto
│   └── banner.svg           # Banner del proyecto
├── notes/                   # Apuntes de las prácticas
│   ├── 1-introduccion.md
│   ├── 2-arrays.md
│   ├── 3-clases.md
│   ├── 4-ajax.md
│   ├── 5-dom.md
│   ├── 5.1-test-dom.md
│   ├── 6-eventos.md
│   ├── 6.1-spa.md
│   ├── 7-validacion.md
│   └── assets/
│       ├── errorRed.png
│       ├── eventos.png
│       ├── imagen.png
│       ├── mostrarLibros.png
│       ├── resultado-ajax.png
│       └── resultado-clases.png
├── public/                  # Recursos públicos
│   ├── favicon.svg
│   ├── icons.svg
│   └── logoBatoi.png
├── src/                     # Código fuente
│   ├── controller/          # Carga de datos y acciones de la interfaz
│   │   └── controller.class.js
│   ├── data/                # Datos
│   │   ├── batoibooks.json
│   │   └── datos.js          # Datos heredados de prácticas anteriores
│   ├── model/               # Clases del dominio
│   │   ├── book.class.js
│   │   ├── books.class.js
│   │   ├── cart.class.js
│   │   ├── module.class.js
│   │   ├── modules.class.js
│   │   ├── user.class.js
│   │   └── users.class.js
│   ├── services/            # Comunicación con la API
│   │   ├── api.js
│   │   └── router.js         # Navegación entre secciones
│   ├── style/               # Estilos
│   │   └── styles.css
│   ├── view/                # Renderizado, formulario y eventos del DOM
│   │   └── view.class.js
│   ├── functions.js         # Funciones heredadas de prácticas anteriores
│   └── main.js              # Punto de entrada principal
├── test/                    # Pruebas
│   ├── cart.test.js         # Copias, duplicados y borrado del carrito
│   ├── contrato.test.js     # Pruebas de contrato heredadas
│   ├── controller.test.js   # Pruebas de carga, alta, edición, carrito y borrado
│   ├── functions.test.js    # Pruebas de funciones heredadas
│   ├── main.test.js         # Prueba inicial heredada
│   ├── model.test.js        # Pruebas de las clases del modelo
│   ├── persistence.test.js  # Pruebas de API y persistencia
│   ├── router.test.js       # Pruebas de navegación
│   ├── validation.test.js   # Validación y comprobación asíncrona de módulos
│   └── view.test.js         # Pruebas de renderizado, formularios y botones
├── .gitignore               # Archivos ignorados por Git
├── docker-compose.yml       # Configuración de Docker Compose
├── index.html               # HTML principal
├── package-lock.json        # Versiones bloqueadas de dependencias
├── package.json             # Configuración del proyecto
└── README.md                # Documentación del proyecto
```

Los enunciados de las prácticas DOM están en [5-dom.md](notes/5-dom.md), [5.1-test-dom.md](notes/5.1-test-dom.md), [6-eventos.md](notes/6-eventos.md), [6.1-spa.md](notes/6.1-spa.md) y [7-validacion.md](notes/7-validacion.md).

## 📦 Instalación

Puedes arrancar la aplicación con Docker Compose o con Node.js instalado en tu equipo.

### Clonar el repositorio

```bash
git clone https://github.com/DavidTorro/BatoiBooks.git
cd BatoiBooks
```

### Arrancar el proyecto

```bash
docker compose up -d
```

Al arrancar los contenedores, se instalarán las dependencias, se iniciará la API en `http://localhost:3000` y se ejecutará el proyecto en `http://localhost:5173`.

Para usar otra API, crea un fichero `.env` a partir de `.env.example` y define `VITE_API_URL` con su URL.

### Desarrollo local sin Docker

Instala las dependencias y abre dos terminales:

```bash
npm install
npm run api
```

En la segunda terminal, inicia Vite:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y la API en `http://localhost:3000`.

### Parar el proyecto

```bash
docker compose down
```

## 🧪 Pruebas

Este proyecto incluye pruebas con Vitest.

### Ejecutar todos los tests

```bash
docker compose exec batoibooks npm test -- --run
```

También puedes ejecutar los scripts directamente con `npm` si tienes Node.js instalado y las dependencias instaladas:

```bash
npm test -- --run
```

Las pruebas de persistencia, controlador y validación usan MSW para simular la API; las de vista, controlador, enrutador y validación usan jsdom para simular el navegador. No es necesario arrancar `json-server` para ejecutarlas.

## 👤 Autor

Hecho por **David Torró**

---

Generado con [readme-gen](https://readme-gen.davidtorro.com).
