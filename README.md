# ✨ Luz - Asistente con Inteligencia Artificial

> **Demostración en vivo en GitHub Pages:**  
> 🌐 **[https://realshirodev.github.io/iaevaluacion1/](https://realshirodev.github.io/iaevaluacion1/)**

Aplicación web interactiva desarrollada por **David Beltrán** como proyecto académico para la cátedra de **Inteligencia Artificial**. Construida con tecnologías web estándar (**HTML5**, **CSS3** y **JavaScript Vanilla**), conectada directamente a los modelos generativos de **Google Gemini** mediante la **Fetch API** nativa del navegador.

---

## 🌟 Características Principales

### 1. Interfaz de Usuario Moderna y Responsiva
- **Tema Oscuro (*Dark Mode*)**: Estilo visual vanguardista con desenfoque (*Glassmorphism*), degradados violeta/cian y sombras envolventes.
- **Diseño Adaptable**: Interfaz 100% responsiva para pantallas de escritorio, tablets y dispositivos móviles.
- **Burbujas de Chat Diferenciadas**: Identificación visual para las preguntas del usuario y las respuestas de **Luz**.
- **Preguntas Sugeridas (*Chips*)**: Botones interactivos para consultar temas de Inteligencia Artificial con un solo clic.
- **Renderizado de Markdown y Código**: Formato estructurado de respuestas con negritas, listas y bloques de código monoespaciados mediante `marked.js`.

### 2. Integración con Google Gemini API
- **Conexión Directa con Fetch API**: Solicitudes asíncronas vía método `POST` al endpoint oficial de Google AI Studio (`v1beta`).
- **Sistema de Auto-Fallback Inteligente**: 
  - Intenta prioritariamente la conexión con **`gemini-1.5-flash`** (especificado en la pauta de evaluación).
  - Si la API de Google reporta que el modelo está retirado para la clave de API activa (código `404`), conmuta automáticamente a **`gemini-3.1-flash-lite`** / **`gemini-flash-latest`**, actualizando la etiqueta en pantalla y garantizando alta disponibilidad sin interrumpir al usuario.
- **Memoria Contextual Multi-Turno**: Mantiene en memoria el hilo conversacional para permitir preguntas de seguimiento.
- **Personalidad del Asistente**: Prompt de sistema diseñado para que la IA se reconozca formalmente como **Luz**, desarrollada por **David Beltrán**.

### 3. Experiencia de Usuario y Despliegue
- **Indicador de Carga**: Animación visual de tres puntos (*"El modelo Gemini está procesando la respuesta..."*) con bloqueo temporal de inputs para prevenir solicitudes duplicadas.
- **Manejo Integral de Excepciones**: Detección y notificación clara de errores de autenticación (401/403), límites de cuota (429) y caídas de red.
- **Listo para GitHub Pages**: Configuración de despliegue optimizada que funciona tanto en la nube como en servidores locales y modo offline.

---

## 📁 Estructura del Proyecto

```text
iaevaluacion1/
│
├── index.html           # Estructura semántica, chat box, modales y enlaces de autoría
├── style.css            # Estilos CSS modernos (Dark Mode, variables, animaciones y diseño móvil)
├── app.js               # Controlador cliente, conexión Fetch API, fallback y lógica de chat
├── config.js            # Archivo de configuración activo con credenciales para GitHub Pages
│
├── .env                 # [Local] Variables de entorno para entornos con servidor Apache
├── .env.example         # [Plantilla] Archivo de ejemplo para variables de entorno
├── .gitignore           # Reglas de exclusión para archivos de entorno y temporales
└── README.md            # Documentación técnica y académica del proyecto
```

---

## 🚀 Modos de Ejecución

### Opción 1: En Línea (GitHub Pages)
No requiere instalación ni descargas. Ingresa directamente al enlace oficial:
👉 **[https://realshirodev.github.io/iaevaluacion1/](https://realshirodev.github.io/iaevaluacion1/)**

### Opción 2: En Servidor Local (XAMPP / Apache)
1. Clona o copia la carpeta del proyecto en `c:\xampp\htdocs\iaevaluacion1`.
2. Inicia el módulo **Apache** desde el panel de control de XAMPP.
3. Abre tu navegador e ingresa a:
   ```url
   http://localhost/iaevaluacion1/
   ```

### Opción 3: Apertura Directa (Sin Servidor)
Haz doble clic sobre el archivo `index.html` para abrirlo en cualquier navegador (Chrome, Edge, Firefox, Brave).

---

## 🔑 Gestión de la API Key

La aplicación cuenta con una clave activa incorporada en `config.js` para que la demo en GitHub Pages funcione de inmediato. Sin embargo, permite ingresar claves personalizadas fácilmente:

1. **Desde la Interfaz Gráfica (Recomendado):**
   Haz clic en el ícono de la llave (⚙️ / 🔑) en la esquina superior derecha, ingresa tu API Key personal de Google AI Studio y presiona **"Guardar Clave"**. Se almacenará en el `LocalStorage` de tu navegador con máxima prioridad.
2. **Mediante `config.js`:**
   Edita el valor de `GEMINI_API_KEY` en `config.js`.
3. **Mediante `.env`:**
   Configura `GEMINI_API_KEY=tu_clave` en el archivo `.env` para entornos con backend o servidor web.

---

## 👨‍💻 Autor

- **Desarrollador:** David Beltrán ([@realshirodev](https://github.com/realshirodev))
- **Repositorio:** [github.com/realshirodev/iaevaluacion1](https://github.com/realshirodev/iaevaluacion1)
