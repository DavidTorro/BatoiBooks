# 1. Introducción

Vamos a hacer una aplicación para vender libros de texto y apuntes entre los estudiantes del CIP FP Batoi. Las tablas con las que trabajaremos son:

- **courses**: son los distintos ciclos del centro. Sus campos son _id_ (autonumérico), _course_ (nombre corto del ciclo), _familyId_ (FK de la tabla _families_), _vliteral_ y _cliteral_ (nombre completo en valenciano y castellano).

- **families**: las familas profesionales del centro (informática, sanitaria, hostelería, ...). Sus campos son _id_ (autonumérico), _vliteral_ y _cliteral_ (nombre completo en valenciano y castellano).

- **modules**: los distintos módulos que se estudian en cada ciclo. Sus campos son _code_ (PK, cadena de 4 caracteres numéricos), _courseId_ (FK de la tabla _courses_), _vliteral_ y _cliteral_ (nombre completo en valenciano y castellano).

- **sales**: donde se registran las ventas producidas. Sus campos son _id_ (autonumérico), _bookId_ (FK de la tabla books), _userId_ (FK de la tabla _users_), _date_ (data de venta en format AAAA-MM-DD) y _status_ (estado de la venta, numérico).

- **users**: datos de los usuarios registrados en la aplicación. Sus campos son _id_ (autonumérico), _nick_, _email_ y _password_.

- **books**: libros y apuntes en venta. Sus campos son:
  - _id_ (autonumérico)
  - _userId_: FK de la tabla _users_
  - _moduleCode_: FK de la tabla _modules_
  - _publisher_: editorial que publica el libro. Si son apuntes su valor es "Apunts"
  - _price_: precio (numérico)
  - _pages_: páginas del libro/apuntes (numérico)
  - _status_: estado del libro que puede tomar uno de los valores "new", "good", "used", "bad". Si es un libro/apuntes digital su valor será "digital"
  - _photo_: ruta a la foto
  - _comments_: comentarios
  - _soldDate_: fecha de venta del libro, en formato YYYY-MM-DD. Si aún no está vendido este campo estará en blanco

## Creación del proyecto

Este proyecto lo iremos desarrollando a lo largo de la primera evaluación y también lo trabajaréis en el módulo de DAW (para desplegarlo) y DWES (para hacer la autenticación y las ventas, pero se hará al final).

De momento los datos con los que trabaja la aplicación los tenemos en el fichero datos.js en una variable llamada data. Más adelante haremos peticiones a una API ficticia que montaremos con json-server y por último lo integraremos con una API que haréis en DWES para dejar la aplicación acabada.

En esta aplicación tendremos muchos ficheros diferentes (para empezar datos.js y luego añadiremos muchos más) así que crearemos un nuevo proyecto usando Vite. Para cada práctica incluida en el proyecto crearemos una nueva rama en git y la entrega será el enlace a la rama de dicha práctica de vuestro repositorio.

Al crear el proyecto con Vite indicaremos que vamos a usar sólo Javascript (Vanilla). Le podéis llamar BatoiBooks. Una vez generado el proyecto y arrancado el servidor de desarrollo cambiaremos el código para adaptarlo a nuestro proyecto como hicimos con el ejercicio 1.3-fraseVite:

- eliminamos los logos (javascript.svg y public/vite.svg)
- copiamos a public/ nuestro logo (logoBatoi.png)
- eliminamos el fichero counter.js
- crearemos una carpeta src donde meteremos todos los ficheros js que vayamos creando (sólo main.js se quedará en el directorio raíz del proyecto)
- creamos una carpeta src/services y copiamos allí el fichero datos.js
- creamos dentro de src nuestro fichero functions.js para incluir y exportar las funciones. Por ahora como no hay funciones su contenido será sólo export { }

En el index.html cambiaremos el título a BatoiBooks miNombre (ej. BatoiBooks Juan).

En el main.js cambiaremos su contenido ya que no queremos renderizar lo que trae de ejemplo sino sólo una cabecera con nuestro logo y el título de la aplicación y un texto que diga que abras la consola para ver su funcionamiento. El resultado será algo como:

## Test

Para testear nuestra aplicación usaremos Vitest (recordad instalarlo como dependencia de desarrollo). Los test los tenéis en el fichero main.test.js que debéis copiar a una carpeta llamada test dentro de nuestro proyecto.

---

> [!NOTE]Info
> Contenido extraido de aules mediante GitHub Copilot.
