# 📘 Banco de 30 Preguntas y Respuestas Técnicas para la Demostración

**Asignatura:** Ingeniería Web  
**Práctica:** Desarrollo de un Publicador de Mensajes con JavaScript Asíncrono, Fetch y DOM  
**Puntaje Máximo:** 60 puntos (Escala vigesimal: Nota = Puntaje / 3)  
**Archivos del Proyecto:** [`index.html`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes%20Asincronos/index.html) | [`styles.css`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes%20Asincronos/styles.css) | [`script.js`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes%20Asincronos/script.js)

---

## 📑 Índice de Bloques Temáticos
1. [Bloque A: HTML y Manipulación del DOM (Preguntas 1 a 6)](#bloque-a-html-y-manipulaci%C3%B3n-del-dom)
2. [Bloque B: JavaScript Asíncrono y Promesas (Preguntas 7 a 12)](#bloque-b-javascript-as%C3%ADncrono-y-promesas)
3. [Bloque C: Fetch API y Peticiones HTTP (Preguntas 13 a 18)](#bloque-c-fetch-api-y-peticiones-http)
4. [Bloque D: Manejo de Respuestas y Errores (Preguntas 19 a 24)](#bloque-d-manejo-de-respuestas-y-errores)
5. [Bloque E: Validación, Interfaz y Comportamiento (Preguntas 25 a 28)](#bloque-e-validaci%C3%B3n-interfaz-y-comportamiento)
6. [Bloque F: Análisis, Pruebas y Mejoras (Preguntas 29 y 30)](#bloque-f-an%C3%A1lisis-pruebas-y-mejoras)

---

## Bloque A: HTML y Manipulación del DOM

### 1. ¿Qué función cumple el formulario HTML en la miniaplicación y qué ventajas ofrece frente a utilizar únicamente botones y campos independientes?
- **Función:** Agrupa semánticamente los campos de entrada (`<input>`, `<textarea>`) y el botón de acción (`<button type="submit">`), estableciendo una unidad lógica de captura y envío de datos.
- **Ventajas frente a campos sueltos:**
  1. **Disparo unificado del evento `submit`:** Permite capturar el envío tanto si el usuario hace clic en el botón como si presiona la tecla `Enter` dentro de un campo de texto.
  2. **Accesibilidad (a11y):** Los lectores de pantalla y tecnologías de asistencia identifican el formulario como una región interactiva coherente.
  3. **Métodos nativos:** Facilita el uso de métodos del navegador como `form.reset()` para limpiar todos los campos con una sola instrucción.

---

### 2. ¿Qué diferencia existe entre `querySelector()` y `getElementById()`? ¿Cuál utilizaste y por qué?
- **Diferencias:**
  - `getElementById('id')`: Busca exclusivamente por el atributo `id` exacto de forma directa y optimizada en el árbol del DOM. Es más veloz en términos de rendimiento.
  - `querySelector('selector')`: Acepta cualquier selector CSS válido (`#id`, `.clase`, `input[type="text"]`, selectores anidados). Es más flexible pero evalúa la sintaxis CSS antes de buscar.
- **¿Cuál se utilizó?:** En nuestro proyecto utilizamos **`getElementById()`** para los elementos principales (como `document.getElementById('post-form')` o `post-title`), debido a que todos cuentan con identificadores únicos, lo que garantiza mayor claridad, rapidez y menor probabilidad de colisión o ambigüedad en la selección.

---

### 3. ¿Cómo se obtiene el contenido ingresado por el usuario en los campos del título y del mensaje?
- Se accede a la propiedad **`.value`** del elemento del DOM correspondiente y se aplica el método **`.trim()`** para retirar espacios en blanco al inicio y al final:
  ```javascript
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  ```
- **Líneas en el código:** Se implementa en [`script.js`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes%20Asincronos/script.js) dentro de la función de validación `validateInputs()` y al momento de construir el `payload` en `handleFormSubmit()`.

---

### 4. ¿Qué función cumple `addEventListener()`? ¿Qué evento utilizaste para detectar el envío del formulario?
- **Función:** Es el método del estándar de JavaScript que suscribe un manejador de eventos (callback o función) a un elemento del DOM específico, permitiendo reaccionar a las acciones del usuario sin sobrescribir propiedades (como `onclick` u `onsubmit`).
- **Evento utilizado:** Utilizamos el evento **`submit`** sobre el elemento `<form>`:
  ```javascript
  postForm.addEventListener('submit', handleFormSubmit);
  ```
- **Por qué no `click`:** Escuchar `submit` en el formulario garantiza capturar el envío sin importar si el usuario hizo clic o presionó `Enter`.

---

### 5. ¿Por qué se recomienda utilizar `textContent` en lugar de insertar directamente los datos mediante `innerHTML`?
- **Seguridad contra ataques XSS (Cross-Site Scripting):** `innerHTML` interpreta cualquier cadena como código HTML. Si un atacante o usuario ingresa `<img src=x onerror=alert('hack')>` o etiquetas `<script>`, el navegador ejecutaría ese código arbitrario en la sesión del usuario.
- **Comportamiento de `textContent`:** Trata cualquier dato estrictamente como texto plano sin analizar ni ejecutar etiquetas HTML o scripts. Además, tiene un mejor rendimiento al no requerir el análisis sintáctico (parsing) del HTML por parte del motor del navegador.
- **Líneas en el código:** En `renderSuccessResponse()`:
  ```javascript
  resTitle.textContent = data.title;
  resBody.textContent = data.body;
  ```

---

### 6. ¿Cómo actualiza JavaScript el DOM para mostrar un mensaje de éxito o error sin recargar toda la página?
1. Al interceptar el evento con `event.preventDefault()`, el ciclo natural de recarga y petición del navegador se cancela.
2. JavaScript realiza la operación en segundo plano mediante `fetch()`.
3. Al recibir la respuesta o detectar un fallo, JavaScript modifica directamente las clases CSS (`classList.remove('hidden')`, `classList.add(...)`) y los contenidos textuales (`textContent`) de los nodos preexistentes en el DOM (como `#result-box`, `#status-container` y `#empty-state`).
4. El navegador aplica un *re-render* parcial solo en la sección del DOM afectada, manteniendo intacto el resto de la interfaz.

---

## Bloque B: JavaScript Asíncrono y Promesas

### 7. ¿Qué significa que una operación sea asíncrona? Identifica una operación asíncrona en tu aplicación.
- **Significado:** Significa que la tarea se inicia y se delega al entorno de ejecución (Web APIs del navegador o motor de eventos), permitiendo que el hilo principal de JavaScript (*single thread*) continúe ejecutándose sin bloquear la interfaz de usuario ni congelar la pantalla.
- **Operación en la aplicación:** La llamada de red con **`fetch(API_URL, ...)`** y la lectura del flujo de datos con **`response.json()`**. Mientras el servidor remoto procesa la petición HTTP POST, el navegador sigue respondiendo a animaciones, clics y eventos.

---

### 8. ¿Qué es una promesa en JavaScript y qué relación tiene con la función `fetch()`?
- **Qué es:** Un objeto que representa la eventual finalización (éxito) o fallo de una operación asíncrona, y su valor resultante. Puede encontrarse en tres estados: *pending* (pendiente), *fulfilled* (cumplida) o *rejected* (rechazada).
- **Relación con `fetch()`:** La función `fetch()` **siempre devuelve una Promesa**. Cuando se invoca, la promesa está en estado *pending*; cuando el servidor responde con las cabeceras HTTP, la promesa pasa a estar *fulfilled* (resolviendo el objeto `Response`), o pasa a *rejected* si hubo un fallo de red o caída de conexión.

---

### 9. ¿Qué diferencia existe entre utilizar `async/await` y utilizar `.then()` y `.catch()`?
- Ambos mecanismos operan sobre el mismo concepto subyacente (Promesas de JavaScript).
- **Diferencia sintáctica y legibilidad:**
  - `.then().catch()`: Utiliza encadenamiento funcional de callbacks, lo que en operaciones complejas puede llevar a anidaciones difíciles de leer (*promise chaining hell*).
  - `async/await`: Es azúcar sintáctico (*syntactic sugar*) sobre las promesas. Permite escribir código asíncrono con una estructura y apariencia secuencial síncrona, utilizando bloques estándar `try...catch...finally` para el control de errores, lo cual hace el código mucho más legible y mantenible.

---

### 10. ¿Qué función cumple la palabra clave `async` y qué tipo de valor devuelve esa función?
- **Función:** Se coloca antes de la declaración de una función (ej. `async function handleFormSubmit(event)`) para habilitar el uso del operador `await` dentro de su cuerpo.
- **Valor que devuelve:** Una función declarada con `async` **siempre devuelve una Promesa**. Si la función retorna un valor primitivo o un objeto, JavaScript lo envuelve automáticamente en una promesa resuelta (`Promise.resolve(valor)`). Si arroja una excepción con `throw`, la promesa se rechaza (`Promise.reject(error)`).

---

### 11. ¿Qué función cumple `await` cuando se utiliza para esperar la respuesta de `fetch()`?
- **Función:** Pausa la ejecución de la función `async` en ese punto exacto hasta que la promesa devuelta por `fetch()` se resuelva o sea rechazada.
- **Importante:** No bloquea el hilo de ejecución del navegador general (otros eventos pueden seguir procesándose en el *Event Loop*). Una vez que la promesa se resuelve, `await` extrae y entrega el valor resuelto (el objeto `Response`).

---

### 12. ¿Qué ocurriría si se eliminara `await` delante de `response.json()`?
- Si ejecutamos `const data = response.json();` sin `await`:
  1. `response.json()` devuelve una **Promesa** en estado pendiente (`Promise {<pending>}`), no el objeto con los datos deserializados.
  2. Si después se intenta acceder a `data.id`, `data.title` o `data.body`, esos valores serán `undefined`.
  3. `JSON.stringify(data)` mostraría `{}` (un objeto de promesa vacío en vez de las propiedades).
  4. Por tanto, la interfaz no mostraría los datos del mensaje ni el identificador asignado.

---

## Bloque C: Fetch API y Peticiones HTTP

### 13. ¿Qué es la Fetch API y para qué se utiliza en la miniaplicación?
- **Qué es:** Es una interfaz nativa moderna provista por los navegadores web para realizar solicitudes de red HTTP/HTTPS de manera asíncrona, reemplazando al antiguo objeto `XMLHttpRequest`.
- **Uso en la aplicación:** Se utiliza para enviar los datos de la publicación en formato JSON hacia el servidor de prueba JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`) mediante una solicitud `POST`, y recibir la respuesta con el nuevo identificador generado.

---

### 14. ¿Qué diferencia existe entre una petición HTTP GET y una petición POST? ¿Por qué se utiliza POST en este ejercicio?
- **Diferencias:**
  - `GET`: Se utiliza para **consultar o recuperar** recursos existentes en el servidor. Los parámetros viajan en la URL (*query params*), tiene límites de tamaño y no envía un cuerpo (`body`).
  - `POST`: Se utiliza para **crear nuevos recursos** o enviar datos para ser procesados. La información viaja encapsulada en el cuerpo (*request body*), permitiendo enviar estructuras complejas como JSON o binarios con mayor volumen y seguridad.
- **Por qué POST aquí:** Porque el ejercicio consiste en simular la creación de un nuevo recurso ("publicación") en el servidor.

---

### 15. ¿Qué función cumple el encabezado `Content-Type: application/json`?
- Informa al servidor el **tipo MIME** (formato de datos) del contenido enviado en el cuerpo (`body`) de la petición HTTP.
- Al especificar `application/json`, el servidor sabe que debe usar un analizador (*parser*) de JSON para interpretar la cadena de texto recibida y convertirla en un objeto o estructura de datos utilizable en el backend. Sin este encabezado, muchos servidores asumen texto plano o rechazan la petición con un error `400 Bad Request` o `415 Unsupported Media Type`.

---

### 16. ¿Por qué se utiliza `JSON.stringify()` en el cuerpo de la petición? ¿Qué recibe y qué devuelve?
- **Por qué:** En el protocolo HTTP, los datos en el cuerpo deben transmitirse como texto o bytes, no como referencias de objetos en memoria de JavaScript.
- **Qué recibe:** Recibe un objeto, arreglo o valor JavaScript (ej. `{ title: '...', body: '...', userId: 1 }`).
- **Qué devuelve:** Devuelve una **cadena de texto formateada en JSON** (ej. `'{"title":"...","body":"...","userId":1}'`).

---

### 17. ¿Qué información contiene el objeto de configuración que se entrega como segundo argumento a `fetch()`?
Contiene los metadatos y opciones de la solicitud HTTP:
```javascript
{
  method: 'POST',                     // Método HTTP a utilizar
  headers: {
    'Content-Type': 'application/json' // Encabezados HTTP (metadatos del contenido)
  },
  body: JSON.stringify(payload)       // Cuerpo de la solicitud serializado en cadena JSON
}
```
*(También puede admitir opciones como `mode`, `credentials`, `cache`, etc., si se requirieran).*

---

### 18. ¿Qué función cumple `response.json()`? ¿En qué se diferencia de `JSON.stringify()`?
- **Función de `response.json()`:** Es un método del objeto `Response` de Fetch que lee el flujo de datos entrante (*stream*) del cuerpo de la respuesta HTTP hasta completarlo y lo analiza (*parsea*) asíncronamente como JSON, devolviendo una Promesa que resuelve en un **objeto JavaScript**.
- **Diferencia clave con `JSON.stringify()`:** Son operaciones inversas:
  - `JSON.stringify()`: Convierte **Objeto JS → Cadena de texto JSON** (para enviar).
  - `response.json()`: Convierte **Flujo de texto JSON entrante → Objeto JS** (para leer y usar en el código).

---

## Bloque D: Manejo de Respuestas y Errores

### 19. ¿Qué representa la propiedad `response.ok` y por qué debe comprobarse antes de considerar exitosa una petición?
- **Qué representa:** Es una propiedad booleana del objeto `Response`. Devuelve `true` si el código de estado HTTP se encuentra en el rango de éxito **200 a 299** (como `200 OK` o `201 Created`), y `false` en caso contrario (como `400`, `404`, `500`).
- **Por qué debe comprobarse:** Porque por especificación, **`fetch()` NO rechaza la promesa ante códigos de error HTTP**. Para `fetch()`, cualquier respuesta recibida del servidor (incluso un error 500 o 404) es una comunicación completada con éxito. Por ende, si no se comprueba `response.ok`, el programa trataría un error de servidor como si fuera una publicación exitosa.

---

### 20. ¿Qué diferencia existe entre un error HTTP, como un estado 404, y un error de conexión?
- **Error HTTP (ej. 404 Not Found, 500 Server Error):**
  - Hubo comunicación física exitosa con el servidor.
  - El servidor recibió la petición y respondió deliberadamente con un código indicando que no encontró la ruta (404) o que falló su proceso interno (500).
  - `fetch()` **resuelve** la promesa satisfactoriamente (con `response.ok = false`).
- **Error de conexión (ej. DNS caído, sin internet, CORS bloqueado):**
  - No se pudo establecer comunicación con el servidor.
  - La petición nunca llegó o no hubo respuesta.
  - `fetch()` **rechaza** la promesa lanzando una excepción de tipo `TypeError: Failed to fetch`.

---

### 21. ¿Qué sucede si el servidor devuelve una respuesta HTTP no satisfactoria y el código no comprueba `response.ok`?
- El código continuará ejecutándose como si todo hubiera ido bien: intentará hacer `await response.json()` y llamar a `renderSuccessResponse()`.
- La interfaz del usuario mostrará una confirmación de éxito falsa ("¡Publicación creada!") con datos vacíos o con el mensaje de error del servidor como si fuera el título de la publicación, engañando al usuario y ocultando el problema real.

---

### 22. ¿Para qué se utiliza `try/catch` cuando se trabaja con `async/await`? ¿Qué errores puede ayudar a gestionar?
- **Propósito:** Permite capturar de manera estructurada cualquier excepción síncrona o promesa rechazada producida dentro del bloque `try`.
- **Errores que ayuda a gestionar:**
  1. **Errores de red:** Falta de conexión a internet o servidor apagado.
  2. **Errores HTTP controlados:** Las excepciones arrojadas manualmente con `throw new Error(...)` cuando `!response.ok`.
  3. **Errores de parseo JSON:** Respuestas del servidor que no son JSON válido (por ejemplo, una página de error en HTML).
  4. **Errores sintácticos en tiempo de ejecución:** Intentos de acceder a propiedades de variables nulas o indefinidas.

---

### 23. ¿Qué ocurriría si la respuesta del servidor no contuviera JSON válido y se ejecutara `response.json()`?
- El método `response.json()` intentará analizar el cuerpo y, al detectar sintaxis inválida (como texto plano o código HTML `<!DOCTYPE html>`), **rechazará su promesa** arrojando un error de tipo `SyntaxError: Unexpected token < in JSON at position 0`.
- Si está envuelto en un bloque `try/catch`, la ejecución saltará inmediatamente al bloque `catch`, permitiendo informar al usuario que la respuesta del servidor no tiene el formato esperado.

---

### 24. ¿Cómo modificarías la aplicación para que muestre un mensaje comprensible cuando falle la conexión con el servidor?
- En el bloque `catch`, inspeccionando la propiedad `error.name` o su mensaje:
  ```javascript
  catch (error) {
    let friendlyMessage = 'Ocurrió un error inesperado al procesar la publicación.';
    
    // Detección de error de red nativo de Fetch
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      friendlyMessage = 'Sin conexión: No se pudo conectar con el servidor. Revisa tu acceso a Internet.';
    } else {
      friendlyMessage = error.message; // Mensaje del Error HTTP o personalizado
    }
    
    showStatus(friendlyMessage, 'error');
  }
  ```
- Ya implementado en [`script.js`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes Asincronos/script.js#L182-L195).

---

## Bloque E: Validación, Interfaz y Comportamiento

### 25. ¿Por qué es necesario validar el título y el contenido antes de enviar la petición? ¿Cómo impedirías enviar campos vacíos o que solo contengan espacios?
- **Por qué es necesario:**
  1. Evita tráfico de red innecesario hacia el servidor.
  2. Mejora la experiencia de usuario (UX) ofreciendo retroalimentación inmediata sin latencia.
  3. Mantiene la integridad de los datos evitando crear registros basura o vacíos en el backend.
- **Cómo se impide:**
  Utilizando `.trim()` sobre el valor ingresado. Si la longitud de la cadena resultante es `0` o no cumple el mínimo requerido, se cancela la ejecución retornando `false` y mostrando los mensajes de error en el DOM antes de invocar a `fetch()`.

---

### 26. ¿Por qué conviene deshabilitar temporalmente el botón mientras se procesa la petición? ¿Cuándo debería habilitarse nuevamente?
- **Por qué conviene deshabilitarlo:** Para prevenir envíos múltiples accidentales o intencionales (*double submit* o *spam* de clics), lo que ocasionaría duplicación de publicaciones o sobrecarga de solicitudes al servidor.
- **Cuándo debe habilitarse:** **Siempre en el bloque `finally`**. El bloque `finally` se ejecuta sin importar si la petición fue exitosa o si ocurrió un error en el bloque `try`, garantizando que la interfaz nunca quede bloqueada permanentemente.

---

### 27. ¿Cómo implementarías un indicador de carga y qué debería ocurrir si falla la operación?
- **Implementación:**
  1. Al iniciar la función de envío (`setLoadingState(true)`):
     - Se cambia el texto del botón a `"Publicando..."`.
     - Se remueve la clase `.hidden` de un elemento de spinner animado con CSS (`@keyframes spin`).
     - Se añade un mensaje contextual en `#status-container`.
  2. **Si falla la operación:**
     - En el bloque `catch`: Se oculta el spinner y se despliega un mensaje visual en color rojo con el detalle del error.
     - En el bloque `finally`: Se reactiva el botón y se restaura el texto a `"Publicar Mensaje"`, permitiendo que el usuario pueda corregir los datos y reintentar.

---

### 28. ¿Cómo evitarías que el navegador recargue la página al enviar el formulario? Explica el propósito de `event.preventDefault()`.
- **Cómo se evita:** Invocando `event.preventDefault()` en la primera línea de la función manejadora del evento `submit`:
  ```javascript
  async function handleFormSubmit(event) {
    event.preventDefault();
    // ...
  }
  ```
- **Propósito de `event.preventDefault()`:** Cancela la acción predeterminada que el navegador tiene asociada a dicho evento. Para un formulario HTML, la acción predeterminada es empaquetar los campos y enviar una petición HTTP síncrona recargando la página completa. Al cancelarlo, permitimos que JavaScript tome el control completo del ciclo de vida de la petición de forma asíncrona mediante la Fetch API (Single Page Application / AJAX flow).

---

## Bloque F: Análisis, Pruebas y Mejoras

### 29. ¿Cómo comprobarías, mediante las herramientas de desarrollo del navegador, que la petición POST se ejecutó correctamente? Indica qué revisarías en Network.
1. Presionar `F12` (o clic derecho > **Inspeccionar**) y abrir la pestaña **Network (Red)**.
2. Filtrar por peticiones **Fetch/XHR**.
3. Enviar el formulario en la página web.
4. Seleccionar la petición hacia `posts` y revisar:
   - **Headers > General:**
     - `Request URL`: `https://jsonplaceholder.typicode.com/posts`
     - `Request Method`: `POST`
     - `Status Code`: `201 Created`
   - **Headers > Request Headers:**
     - `Content-Type`: `application/json`
   - **Payload (o Carga útil):**
     - Verificar que el objeto JSON enviado contenga las claves `title`, `body` y `userId` con los datos que se escribieron en el formulario.
   - **Response (o Respuesta):**
     - Verificar que el servidor responda con un objeto JSON que incluya las mismas propiedades más el campo `id: 101`.

---

### 30. Si el servidor devuelve una respuesta satisfactoria con un identificador, pero no encuentras el mensaje al volver a consultar la API, ¿cómo explicarías ese comportamiento en JSONPlaceholder? ¿Qué cambiarías para implementar almacenamiento persistente real?
- **Explicación del comportamiento:**
  - `JSONPlaceholder` es una API de simulación (mock/fake REST API) destinada exclusivamente a pruebas y prototipado frontend.
  - Cuando recibe una petición `POST`, responde simulando una creación exitosa devolviendo un código `201 Created` y un identificador simulado (ej. `id: 101`), **pero no guarda el registro en ninguna base de datos real**. Por ende, si luego realizamos un `GET https://jsonplaceholder.typicode.com/posts/101`, el servidor no lo encontrará o devolverá un recurso no persistido.
- **Qué se cambiaría para persistencia real:**
  1. **Servidor Backend Real:** Construir una API propia (por ejemplo, con **Node.js + Express** o Python/FastAPI).
  2. **Base de Datos Persistente:** Conectar el backend a un motor de base de datos relacional (como **SQLite**, PostgreSQL o MySQL) o NoSQL (como MongoDB).
  3. **Ruta POST en Backend:** Crear un controlador que ejecute una sentencia `INSERT INTO posts (title, body, user_id) VALUES (...)` en la base de datos y retorne el registro persistido con el ID autoincremental real.
  4. **Modificar la URL en el Frontend:** Cambiar `API_URL` en `script.js` para que apunte al servidor backend propio (ej. `http://localhost:3000/api/posts`).

---

> [!TIP]
> **Consejo para la sustentación oral:**
> Durante la demostración, mantén la consola del navegador (`F12`) abierta en la pestaña **Network**, muestra la petición con estado `201`, y cuando el docente te haga una pregunta de código, abre [`script.js`](file:///c:/Users/LENOVO/Documents/Proyectos/IW-Mensajes%20Asincronos/script.js) y señala directamente la línea donde está implementada la solución (por ejemplo: la línea de `response.ok`, `trim()` o `finally`).
