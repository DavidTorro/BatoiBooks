![Banner](./assets/banner.svg)

# 📝 batoibooks

![JavaScript](https://img.shields.io/badge/-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646cff?style=for-the-badge&logo=vite&logoColor=white) ![Vitest](https://img.shields.io/badge/-Vitest-6e9f18?style=for-the-badge&logo=vitest&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)

![Version](https://img.shields.io/badge/version-1.0.0-4b61c9?style=for-the-badge)

Batoibooks es un proyecto que procesa y filtra datos de libros relacionados con módulos educativos y usuarios. Utiliza funciones para obtener, filtrar y manipular información de libros, mostrando resultados en la consola. Incluye pruebas unitarias con Vitest y se ejecuta mediante Vite para desarrollo.

> ⚡ Procesamiento eficiente de datos educativos en entorno Interfaz

## ⚙️ Tecnologías

- 🧪 **Pruebas**: Vitest
- 🐳 **Infraestructura**: Docker, GitHub Actions
- 🔧 **Herramientas**: Vite

## ✨ Características

- 🚀 Desarrollo rápido con Vite y servidor en vivo
- 🧪 Pruebas unitarias automatizadas con Vitest
- 🐳 Contenedorizado con Docker para entornos consistentes
- 📂 Estructura clara de datos y funciones modulares
- 🔧 Filtrado y manipulación de libros por usuario y módulo
- ⚙️ Flujo de trabajo CI/CD automatizado con GitHub Actions

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
    subgraph SG0["🌐 Aplicación"]
        direction LR
        app["🚀 Punto de entrada<br/>src/main.js"]
    end

    subgraph SG1["⚙️ Lógica"]
        direction LR
        logic["🔧 Funciones de procesamiento<br/>src/functions.js"]
    end

    subgraph SG2["💾 Datos"]
        direction LR
        data["📄 Datos de la aplicación<br/>src/data/datos.js"]
    end

    app -- "ejecuta" --> logic
    logic -- "lee" --> data

    classDef g0 fill:#0f172a,stroke:#38bdf8,color:#f8fafc,stroke-width:2px;
    class app g0;

    classDef g1 fill:#111827,stroke:#c084fc,color:#f8fafc,stroke-width:2px;
    class logic g1;

    classDef g2 fill:#08111f,stroke:#34d399,color:#f8fafc,stroke-width:2px;
    class data g2;

    style SG0 fill:#0b1220,stroke:#38bdf8,stroke-width:1.5px,stroke-dasharray: 4 4,color:#e2e8f0
    style SG1 fill:#0b1220,stroke:#c084fc,stroke-width:1.5px,stroke-dasharray: 4 4,color:#e2e8f0
    style SG2 fill:#0b1220,stroke:#34d399,stroke-width:1.5px,stroke-dasharray: 4 4,color:#e2e8f0
```

| Componente | Tecnología | Detalle |
| --- | --- | --- |
| Aplicación | Vite | Punto de entrada principal en `src/main.js` |
| Lógica | JavaScript | Funciones principales en `src/functions.js` |
| Datos | JavaScript | Datos almacenados en `src/data/datos.js` |
| Pruebas | Vitest | Tests automatizados del proyecto |

<!-- readme-gen:architecture:end -->

## 🗂️ Estructura del proyecto

```txt
batoibooks/
├── .github/               # GitHub metadata
│   └── workflows/         # CI/CD workflows
│       └── ci.yml         # CI workflow
├── notes/                 # Project documentation
│   ├── 1-introduccion.md  # Introduction document
│   └── 2-arrays.md        # Arrays documentation
├── public/                # Static assets
│   ├── favicon.svg        # Website favicon
│   ├── icons.svg          # SVG icons
│   └── logoBatoi.png      # Project logo
├── src/                   # Source code
│   ├── data/              # Application data
│   │   └── datos.js       # Data definitions
│   ├── style/             # Stylesheets
│   │   └── styles.css     # Main stylesheet
│   ├── functions.js       # Utility functions
│   └── main.js            # Main application file
├── test/                  # Pruebas files
│   ├── functions.test.js  # Functions Pruebas
│   └── main.test.js       # Main module Pruebas
├── .gitignore             # Git ignore rules
├── docker-compose.yml     # Docker configuration
├── index.html             # Main HTML file
├── package-lock.json      # Dependency lock file
└── package.json           # Project metadata
```

## 📦 Instalación

```bash
npm install
```

## 🧪 Pruebas

Este proyecto incluye pruebas con Vitest.

```bash
npm run test
```

## 🐳 Docker

Este proyecto incluye configuración de Docker.

## 👤 Autor

Hecho por **David Torró**

## 📄 Licencia

Sin licencia especificada.

---

Generado con [readme-gen](https://readme-gen.davidtorro.com).
