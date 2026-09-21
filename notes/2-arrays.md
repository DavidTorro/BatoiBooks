# 2. Arrays

Esta primera parte de la aplicación la desarrollaremos en la rama '2-arrays'. Aquí crearemos las principales funciones para trabajar con nuestros datos (recuerda que por ahora los tenemos en el fichero datos.js en una variable llamada data). En esta práctica haremos las funciones para trabajar con libros, usuarios y módulos.

Recuerda que tenemos el código en ficheros JS distintos:

- **/main.js**: es el módulo principal que importa los demás, renderiza la página y hace llamadas a las funciones y muestra datos por la consola
- **/src/functions.js**: es el fichero donde crearemos las funciones, que son:
  - **getBookById(books: array, bookId: number) : object**: recibe el array de libros y una id y devuelve el libro con dicha id. SI no existe lanzará una excepción
  - **getBookIndexById(books: array, bookId: number) : number**: igual pero devuelve la posición del libro dentro del array. Si no existe lanzará una excepción
  - **bookExists(books: array, userId: number, moduleCode: number) : boolean**: recibe el array de libros, la id del usuario y el código del módulo y nos dice si ese usuario ya tiene un libro con ese código
  - **booksFromUser(books: array, userId: number) : array**: recibe el array de libros y la id de un usuario y devuelve el array con todos los libros de dicho usuario
  - **booksFromModule(books: array, moduleCode: string) : array**: recibe el array de libros y el código de un módulo y devuelve el array con todos los libros de dicho módulo
  - **booksCheeperThan(books: array, price: number) : array**: recibe el array de libros y un valor y devuelve el array con todos los libros cuyo precio es inferior o igual al valor pasado
  - **booksWithStatus(books: array, status: string) : array**: recibe el array de libros y un estado ("new", "good", ...) y devuelve el array con todos los libros de dicho estado
  - **averagePriceOfBooks(books: array) : string**: recibe el array de libros y devuelve el precio medio de los mismos, con 2 decimales y el símbolo del € (ej.: "23.40 €")
  - **booksOfTypeNotes(books: array) : array**: recibe el array de libros y devuelve un array con todos los que son apuntes
  - **booksNotSold(books: array) : array**: recibe el array de libros y devuelve un array con todos los que NO se han vendido aún
  - **incrementPriceOfbooks(books: array, percentage: number) : array**: recibe el array de libros y el porcentaje a incrementar (ej. 0,1 == 10%) y devuelve un array igual pero con el precio incrementado en el porcentaje pasado
  - **getUserById(users: array, userId: number) : object**: recibe el array de usuarios y una id y devuelve el usuario con dicha id. SI no existe lanzará una excepción
  - **getUserIndexById(users: array, userId: number) : number**: igual pero devuelve la posición del usuario dentro del array. SI no existe lanzará una excepción
  - **getUserByNickName(users: array, nick: string) : object**: recibe el array de usuarios y un nombre de usuario (_nick_) y devuelve el usuario con dicho _nick_. SI no existe lanzará una excepción
  - **getModuleByCode(modules: array, modeuleCode: string) : object**: recibe el array de módulos y un código y devuelve el módulo con dicho código (campo _code_). SI no existe lanzará una excepción

Recuerda que para que funcione el código al final del fichero debemos tener la instrucción:

```js
export {
  getBookById,
  getBookIndexById,
  bookExists,
  booksFromUser,
  booksFromModule,
  booksCheeperThan,
  booksWithStatus,
  averagePriceOfBooks,
  booksOfTypeNote,
  booksNotSold,
  incrementPriceOfbooks,
  getUserById,
  getUserIndexById,
  getUserByNickName,
  getModuleByCode,
};
```

En el main.js:

- importaremos el fichero con las funciones
- importaremos el fichero con los datos (/srv/services/datos.js)
- mostraremos por consola:
  - todos los libros del usuario 4
  - todos los libros del módulo 5021 que están en buen estado ("good")
- incrementaremos un 10% el precio de los libros y los mostraremos por consola

El resultado debe ser algo como:

**IMPORTANTE**: no usaremos ningún _for_ para recorrer los arrays. Siempre que sea posible usaremos _Functional Programming_.

**RECUERDA**: seguir haciendo todas las buenas prácticas que se indicaban en el ejercicio anterior. Y nunca hay que _hardcodear_ nada!!!.

**MUY IMPORTANTE**: pasa los tests para asegurarte aprobar este ejercicio.

---

> [!NOTE]Info
> Contenido extraido de aules mediante GitHub Copilot.
