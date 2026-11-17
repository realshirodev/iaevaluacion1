# Asistente FAQ con Inteligencia Artificial

Proyecto académico desarrollado con tecnologías web estándar (**HTML5**, **CSS3** y **JavaScript Vanilla**) integrado directamente con el modelo **Google Gemini 1.5 Flash** mediante la **Fetch API**.

---

## 🚀 Características del Proyecto

1. **Diseño Moderno & Responsivo**:
   - Paleta de colores en modo oscuro (*Dark Mode*) con acabados en cristal (*Glassmorphism*).
   - Adaptable a pantallas de escritorio, tablets y dispositivos móviles.
   - Área de chat con burbujas diferenciadas para el usuario y el modelo de IA.
   - Renderizado dinámico de Markdown (listas, negritas y bloques de código con `marked.js`).

2. **Integración con IA (Google Gemini 1.5 Flash)**:
   - Comunicación directa vía HTTP POST mediante la **Fetch API** nativa de JavaScript.
   - Historial de conversación con memoria de contexto multi-turno (*Multi-Turn Chat*).
   - Prompt de sistema especializado en responder consultas de Inteligencia Artificial y Ciencias de la Computación.

3. **Experiencia de Usuario**:
   - Indicador de estado de carga en tiempo real (*"El modelo Gemini está procesando la respuesta..."* con animación).
   - Manejo integral de excepciones (claves inválidas, cuotas de API excedidas, caídas de red).
   - Configuración flexible de la clave de API: directamente en el código (`app.js`) o visualmente a través del modal de ajustes (guardado en `LocalStorage`).
   - Botones rápidos con preguntas sugeridas (*chips*).

---

## 📁 Estructura de Archivos

```
iaevaluacion1/
│
├── index.html       # Estructura semántica de la aplicación y modales
├── style.css        # Hoja de estilos moderna (variables CSS, layout flexible y animaciones)
├── app.js           # Lógica cliente, conexión Fetch con Gemini API y manipulación del DOM
└── README.md        # Documentación académica del proyecto
```

---

## 🔑 Configuración de la API Key de Gemini

Para obtener una clave gratuita:
1. Accede a [Google AI Studio](https://aistudio.google.com/).
2. Inicia sesión con tu cuenta de Google y haz clic en **"Get API key"**.
3. Copia tu clave generada.

### Dos formas de aplicarla:

- **Opción A (Desde la interfaz gráfica):**
  Abre la aplicación en tu navegador, haz clic en el ícono de la llave / tuerca en la esquina superior derecha, pega tu clave y haz clic en **Guardar Clave**.

- **Opción B (Directamente en el código):**
  Abre `app.js` y colócala en la línea 17:
  ```javascript
  const API_KEY = "AIzaSy..."; 
  ```

---

## 💻 Cómo ejecutar la aplicación

### En tu servidor local (XAMPP):
Dado que los archivos están en `c:\xampp\htdocs\iaevaluacion1`:
1. Inicia **Apache** desde el Panel de Control de XAMPP.
2. Abre tu navegador web y ve a:
   ```
   http://localhost/iaevaluacion1/
   ```

### Sin servidor web:
También puedes hacer doble clic directamente sobre el archivo `index.html` para abrirlo en Chrome, Edge, Firefox u otro navegador moderno.

