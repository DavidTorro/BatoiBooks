# 7. Validar el formulario de libros

Ahora mismo nuestra aplicación manda al servidor lo que el usuario escriba en el formulario, sea lo que sea: un libro sin editorial, con un precio negativo o con 3,5 páginas. En esta práctica vamos a validar los datos antes de enviarlos. Lo haremos en la rama `7-validacion`.

Al acabar, la aplicación:

- no enviará el formulario si hay algún dato incorrecto, y le dirá al usuario qué está mal en cada campo;
- no dejará que un usuario ponga a la venta más de un libro del mismo módulo. Esto el navegador no lo puede saber solo: hay que preguntárselo al servidor.

Haremos la validación con la **API de validación de formularios** de HTML5, sin ninguna librería (las usaremos en el bloque de Vue). Antes de empezar repasa el tema [Validación de formularios](https://cipfpbatoi.github.io/materials/daw/dwc/01-js/08-forms.html).

Como en las ramas anteriores, los tests comprueban lo que hace la aplicación desde el punto de vista del usuario, no cómo está organizado tu código. Y se mantienen las reglas del MVC: la vista es la única que accede al DOM y el controlador es el único que usa el modelo.

## Validar el formulario

### Qué hay que validar

| Campo | Requisitos |
| --- | --- |
| `moduleCode` | obligatorio |
| `publisher` | obligatorio |
| `price` | obligatorio, numérico y mayor o igual que 0. Se pueden poner céntimos |
| `pages` | obligatorio, número entero y mayor o igual que 1 |
| `status` | obligatorio |

No se valida nada de la `id` (el usuario no puede cambiarla), ni de la foto ni de los comentarios, que pueden quedarse vacíos.

Revisa los atributos que ya tiene tu formulario: algunos los pusiste en ramas anteriores y puede que no cumplan exactamente lo que pide esta tabla.

### Cómo se comporta

- Al enviar el formulario, si hay algún error **no se hace ninguna petición al servidor** y se muestran a la vez los errores de **todos** los campos que estén mal.
- El error de cada campo se muestra en un elemento con id `NOMBRE-error`, donde `NOMBRE` es el `name` del campo (`moduleCode-error`, `publisher-error`, `price-error`, `pages-error` y `status-error`). Ponlo donde quieras, pero **los tests leen ahí los errores**. Si un campo está bien, su elemento de error está vacío.
- Los mensajes de error son **nuestros y en castellano**, no los del navegador (que salen en el idioma del navegador). Y dicen qué es lo que falla: un precio vacío, uno negativo y uno con demasiados decimales dan mensajes distintos.
- Cuando el usuario corrige un campo que tenía un error, su mensaje se actualiza sin tener que volver a enviar.
- Al pulsar *Reset*, al ir a *Añadir libro* o al ir a editar un libro no se ve ningún error de antes.
- Al editar se aplican las mismas validaciones que al añadir.

La validación la hace la **vista**, que es la que conoce el formulario: qué campos tiene, qué requisitos y dónde se muestran los errores. Al controlador sólo le deben llegar datos que ya son correctos.

## Un libro de cada módulo

Un usuario no puede tener a la venta más de un libro del mismo módulo. Para saberlo no basta con lo que hay en el formulario: hay que mirar los libros que tiene ese usuario, y no en nuestra copia local de los datos (otra persona, u otra pestaña, puede haber cambiado algo desde que se cargó la página) sino **en el servidor**.

### El modelo

Añade a tu clase `Books` un método `bookExists(userId, moduleCode)` que le pregunte al servidor si ese usuario ya tiene un libro de ese módulo. Como hay que esperar la respuesta del servidor, será asíncrono. Hará una petición GET como ésta, que busca si el usuario 4 tiene algún libro del módulo 5021:

```text
/books?userId=4&moduleCode=5021
```

**ATENCIÓN:** ¿qué devuelve el servidor a esa petición si existe ese libro? ¿Y si no existe? Pruébalo con tu json-server antes de escribir el método.

Esta forma de validar, preguntando al servidor si algo ya existe, es la misma que se usa para comprobar si un nombre de usuario o un e-mail ya están registrados.

### Cuándo se comprueba

No esperaremos a que el usuario envíe el formulario: lo comprobaremos **en cuanto cambie el módulo** en el SELECT. La vista no tiene acceso al modelo, así que avisará al controlador del módulo elegido y será el controlador quien le pregunte al modelo. Si el usuario ya tiene un libro de ese módulo, el campo `moduleCode` no es válido: el controlador le dirá a la vista que le ponga un **error personalizado** (con `setCustomValidity`) y que muestre su mensaje.

- El mensaje dice que el módulo está repetido (no es el de campo obligatorio).
- Sólo se muestra el error del módulo. **No hay que validar todo el formulario** en ese momento: lo normal es elegir el módulo lo primero, y el usuario vería errores en campos que todavía no ha tenido tiempo de rellenar.
- Si el usuario cambia a un módulo del que no tiene libros, el error desaparece y el formulario se puede guardar.
- Si no se puede hacer la comprobación (por ejemplo, porque el servidor no responde), se muestra un mensaje de error en la zona de mensajes y el módulo no se marca como repetido.

## Arquitectura

En esta rama la validación queda repartida entre la vista y el controlador, y te vas a encontrar con varios problemas que tendrás que resolver sin saltarte las reglas del MVC. Te preguntaremos por ellos:

- **Quién valida qué.** ¿Qué validaciones puede hacer la vista sola y cuáles necesitan al controlador? ¿Por qué el controlador no puede llamar directamente a `setCustomValidity`?
- **El error personalizado.** El controlador decide si el módulo está repetido, pero el error lo pone la vista en el campo. ¿Cuándo hay que quitarlo? ¿Qué pasa con él si el usuario pulsa *Reset* o se va a editar otro libro?
- **La espera.** Entre que el usuario cambia el módulo y llega la respuesta del servidor pasa un tiempo. ¿Qué puede hacer el usuario mientras tanto, y qué le pasa entonces a tu aplicación?
- **El servidor.** Aunque nuestra aplicación lo compruebe, ¿está garantizado que nadie pueda tener dos libros del mismo módulo?
