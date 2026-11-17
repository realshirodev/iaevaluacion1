# ✨ Luz - Asistente con Inteligencia Artificial

Aplicación web interactiva desarrollada por **David Beltrán** como proyecto académico para la cátedra de **Inteligencia Artificial**. Construida con tecnologías web estándar (**HTML5**, **CSS3** y **JavaScript Vanilla**), conectada directamente a los modelos generativos de **Google Gemini** mediante la **Fetch API** nativa del navegador.

---

## 🌟 Características Principales

### 1. Interfaz de Usuario Moderna y Responsiva
- **Tema Oscuro (*Dark Mode*)**: Estilo contemporáneo con efectos de desenfoque (*Glassmorphism*), acentos violeta/cian y sombras suaves.
- **Totalmente Adaptable**: Diseño responsivo optimizado para pantallas de escritorio, tablets y smartphones.
- **Burbujas de Mensajes Diferenciadas**: Avatares e identificación visual clara entre las consultas del usuario y las respuestas de la IA.
- **Preguntas Sugeridas (*Chips*)**: Botones de acceso rápido para consultar conceptos clave de IA en un solo clic.
- **Formato Enriquecido**: Renderizado automático de respuestas con Markdown, bloques de código con sintaxis monoespaciada y listas estructuradas mediante `marked.js`.

### 2. Integración y Lógica con la IA (Google Gemini API)
- **Conexión Directa mediante Fetch API**: Solicitudes asíncronas vía método `POST` al endpoint oficial de Google AI Studio (`v1beta`).
- **Sistema de Auto-Fallback Inteligente**: 
  - Intenta prioritariamente la conexión con **`gemini-1.5-flash`** (solicitado en la pauta de evaluación).
  - Si la API de Google reporta que el modelo está retirado para la clave de API activa (código `404`), conmuta de forma automática e imperceptible a **`gemini-3.1-flash-lite`** / **`gemini-flash-latest`**, actualizando la etiqueta en pantalla y evitando interrupciones.
- **Historial Contextual Multi-Turno**: Mantiene en memoria el hilo de la conversación (`contents: [...]`) para permitir preguntas de seguimiento.
- **Instrucción de Sistema (*System Instruction*)**: Configuración de prompt para moldear el comportamiento didáctico y académico del asistente.

### 3. Experiencia y Robustez
- **Indicador de Carga**: Animación visual de tres puntos flotantes (*"El modelo Gemini está procesando la respuesta..."*) con bloqueo temporal de inputs para evitar envíos duplicados.
- **Manejo Integral de Excepciones**: Detección y notificación clara de errores de autenticación (401/403), límites de cuota (429 Rate Limit) y problemas de red.
- **Gestión Segura de Credenciales**: Cumplimiento de directivas de GitHub Secret Protection mediante variables locales y exclusión en `.gitignore`.

---

## 📁 Estructura del Proyecto

```text
iaevaluacion1/
│
├── index.html           # Estructura semántica, chat box, modales y templates
├── style.css            # Hoja de estilos (Variables CSS, animaciones, scrollbar y responsividad)
├── app.js               # Controlador cliente, conexión Fetch API, historial y fallback
│
├── config.js            # [Privado] Configuración local de API Key (ignorado en git)
├── config.example.js    # [Plantilla] Archivo de ejemplo para configuración con JavaScript
├── .env                 # [Privado] Variables de entorno locales (ignorado en git)
├── .env.example         # [Plantilla] Archivo de ejemplo para variables de entorno
├── .gitignore           # Reglas de exclusión para evitar filtrar secretos en repositorios
└── README.md            # Documentación técnica y académica del proyecto
```

---

## 🔑 Configuración de la API Key de Gemini

Para utilizar el asistente necesitas una clave gratuita de Google Gemini:
1. Ingresa a [Google AI Studio](https://aistudio.google.com/).
2. Inicia sesión con tu cuenta de Google y genera tu clave en la sección **"Get API key"**.

### Métodos soportados para configurarla:

#### Opción 1: Archivo `config.js` (Recomendado para ejecución local)
Crea o edita el archivo `config.js` en la raíz del proyecto (basado en `config.example.js`):
```javascript
const CONFIG = {
  GEMINI_API_KEY: "TU_API_KEY_AQUI"
};
```
> *Este archivo está incluido en `.gitignore` para proteger tus credenciales ante cualquier push a GitHub.*

#### Opción 2: Archivo `.env` (Para entornos con servidor web)
Copia `.env.example` como `.env` y agrega tu clave:
```env
GEMINI_API_KEY=TU_API_KEY_AQUI
```

#### Opción 3: Desde la propia interfaz gráfica
1. Abre la aplicación en el navegador.
2. Haz clic en el ícono de la llave (⚙️ / 🔑) en la esquina superior derecha.
3. Pega tu API Key y presiona **"Guardar Clave"**. Se almacenará de forma segura y permanente en el `LocalStorage` de tu navegador.

---

## 🚀 Cómo Ejecutar la Aplicación

### Método A: En servidor local XAMPP / Apache (Recomendado)
1. Coloca la carpeta del proyecto en `c:\xampp\htdocs\iaevaluacion1`.
2. Inicia el módulo **Apache** desde el panel de control de XAMPP.
3. Abre tu navegador e ingresa a:
   ```url
   http://localhost/iaevaluacion1/
   ```

### Método B: Ejecución directa (Sin servidor)
Haz doble clic sobre el archivo `index.html` para abrirlo en cualquier navegador moderno (Chrome, Edge, Firefox, Brave).

---

## 🛡️ Seguridad y Buenas Prácticas

- Los archivos `.env` y `config.js` están excluidos del control de versiones a través de `.gitignore`.
- Se incluye un historial de Git limpio y protegido contra escaneos de secretos de **GitHub Push Protection**.
- Los tokens y solicitudes viajan cifrados mediante HTTPS directamente a los servidores de Google.
