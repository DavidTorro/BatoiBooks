![Banner](./assets/banner.svg)

# 📝 Batoibooks

![JavaScript](https://img.shields.io/badge/-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646cff?style=for-the-badge&logo=vite&logoColor=white) ![Vitest](https://img.shields.io/badge/-Vitest-6e9f18?style=for-the-badge&logo=vitest&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)

![Version](https://img.shields.io/badge/version-1.0.0-4b61c9?style=for-the-badge)

Batoibooks es un proyecto que procesa y filtra datos de libros relacionados con módulos educativos y usuarios. Utiliza funciones para obtener, filtrar y manipular información de libros, mostrando resultados en la consola. Incluye pruebas unitarias con Vitest y se ejecuta mediante Vite para desarrollo.

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

    app -- "llama" --> logic
    app -- "importa" --> data
    data -- "se pasa como parámetro" --> logic

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

| Componente | Tecnología | Detalle                                     |
| ---------- | ---------- | ------------------------------------------- |
| Aplicación | Vite       | Punto de entrada principal en `src/main.js` |
| Lógica     | JavaScript | Funciones principales en `src/functions.js` |
| Datos      | JavaScript | Datos almacenados en `src/data/datos.js`    |
| Pruebas    | Vitest     | Tests automatizados del proyecto            |

<!-- readme-gen:architecture:end -->

## 🗂️ Estructura del proyecto

```txt
batoibooks/
├── .github/                 # Configuración de GitHub
│   └── workflows/           # Flujos de CI/CD
│       └── ci.yml           # Flujo de CI
├── assets/                  # Recursos del proyecto
│   └── banner.svg           # Banner del proyecto
├── notes/                   # Enunciado del proyecto
│   ├── 1-introduccion.md
│   └── 2-arrays.md
├── public/                  # Recursos públicos
│   ├── favicon.svg
│   ├── icons.svg
│   └── logoBatoi.png
├── src/                     # Código fuente
│   ├── data/                # Datos
│   │   └── datos.js
│   ├── style/               # Estilos
│   │   └── styles.css
│   ├── functions.js         # Funciones del proyecto
│   └── main.js              # Punto de entrada principal
├── test/                    # Pruebas
│   ├── functions.test.js    # Pruebas de funciones
│   ├── contrato.test.js     # Pruebas de contrato del profesor
│   └── main.test.js         # Prueba inicial del profesor
├── .gitignore               # Archivos ignorados por Git
├── docker-compose.yml       # Configuración de Docker Compose
├── index.html               # HTML principal
├── package-lock.json        # Versiones bloqueadas de dependencias
├── package.json             # Configuración del proyecto
└── README.md                # Documentación del proyecto
```

## 📦 Instalación

Necesitaremos tener Docker con Docker Compose instalado en nuestro sistema.

### Clonar el repositorio

```bash
git clone https://github.com/DavidTorro/BatoiBooks.git
cd BatoiBooks
```

### Arrancar el proyecto

```bash
docker compose up -d
```

Al arrancar el contenedor, se instalarán las dependencias y se ejecutará el proyecto. Puedes acceder a la aplicación en tu navegador en `http://localhost:5173`.

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

### Ejecutar un test específico para ver si estan las funciones(archivo del profesor)

```bash
docker compose exec batoibooks npm run test:contrato -- --run
```

### Ejecutar un test específico de las funciones (mio propio)

```bash
docker compose exec batoibooks npm run test:functions -- --run
```

## 👤 Autor

Hecho por **David Torró**

---

Generado con [readme-gen](https://readme-gen.davidtorro.com).
