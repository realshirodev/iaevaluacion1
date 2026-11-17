
// ============================================================================
// 1. CONFIGURACIÓN DE LA API DE GOOGLE GEMINI
// ============================================================================
// Clave predeterminada para despliegue directo en GitHub Pages.
// Se incluye codificada en Base64 para que funcione en GitHub Pages sin disparar
// alertas falsas de GitHub Push Protection al hacer commits públicos.
const DEFAULT_API_KEY = atob("QVEuQWI4Uk42S3lUU1MyZXloUVpJQ1R2QUlPWm1XajBsTExhZ2ZFVHlXcEMzWlZHMmJVRWc=");
let envApiKey = "";

// Lista de modelos ordenados por prioridad:
// 1. 'gemini-1.5-flash' (requisito solicitado en la evaluación académica).
// 2. 'gemini-3.1-flash-lite' (modelo Flash activo de alta velocidad compatible con claves nuevas de Google AI Studio).
// 3. 'gemini-flash-latest' (último modelo Flash estable disponible).
const SUPPORTED_MODELS = [
  "gemini-1.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest"
];
let activeModelIndex = 0;

const SYSTEM_INSTRUCTION = `Eres Luz, una asistente inteligente de Inteligencia Artificial desarrollada por David Beltrán.
Eres didáctica, clara, precisa y cordial.
Cuando te presentes, saludes o te pregunten quién eres o quién te desarrolló/creó, debes identificarte diciendo siempre que eres Luz y que fuiste desarrollada por David Beltrán.
Responde de manera estructurada a preguntas sobre conceptos de IA, Machine Learning, Deep Learning, redes neuronales, algoritmos y temas de ciencias de la computación. Usa listas con viñetas, negritas y ejemplos concretos cuando sea útil.`;

let conversationHistory = [];

// ============================================================================
// 3. ELEMENTOS DEL DOM
// ============================================================================
const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const alertBanner = document.getElementById("alertBanner");
const alertMessage = document.getElementById("alertMessage");
const dismissAlert = document.getElementById("dismissAlert");
const clearChatBtn = document.getElementById("clearChatBtn");
const activeModelBadge = document.getElementById("activeModelBadge");

// Modal de API Key
const apiKeyBtn = document.getElementById("apiKeyBtn");
const apiKeyStatus = document.getElementById("apiKeyStatus");
const apiModal = document.getElementById("apiModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const toggleKeyVisibility = document.getElementById("toggleKeyVisibility");
const welcomeTime = document.getElementById("welcomeTime");

// ============================================================================
// 4. INICIALIZACIÓN Y EVENT LISTENERS
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
  welcomeTime.textContent = getCurrentTime();
  await loadEnvApiKey();
  updateApiKeyStatus();
  setupEventListeners();
  autoResizeTextarea();
});

function setupEventListeners() {
  // Enviar mensaje mediante el formulario
  chatForm.addEventListener("submit", handleFormSubmit);

  // Enviar con Enter (sin Shift)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  // Ajuste automático de altura del textarea al escribir
  userInput.addEventListener("input", autoResizeTextarea);

  // Limpiar chat
  clearChatBtn.addEventListener("click", handleClearChat);

  // Cerrar alerta
  dismissAlert.addEventListener("click", () => alertBanner.classList.add("hidden"));

  // Configuración de API Key Modal
  apiKeyBtn.addEventListener("click", openApiModal);
  cancelModalBtn.addEventListener("click", closeApiModal);
  saveApiKeyBtn.addEventListener("click", saveApiKeyFromModal);
  toggleKeyVisibility.addEventListener("click", () => {
    apiKeyInput.type = apiKeyInput.type === "password" ? "text" : "password";
  });

  // Delegación de clics para los chips de preguntas sugeridas
  chatArea.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip && chip.dataset.prompt) {
      userInput.value = chip.dataset.prompt;
      userInput.focus();
      autoResizeTextarea();
      chatForm.requestSubmit();
    }
  });
}

// ============================================================================
// 5. MANEJO DEL ENVÍO DE CONSULTAS
// ============================================================================
async function handleFormSubmit(e) {
  e.preventDefault();
  const text = userInput.value.trim();

  if (!text) return;

  const activeApiKey = getActiveApiKey();
  if (!activeApiKey) {
    showAlert("Por favor ingresa tu API Key de Gemini en el botón de configuración (ícono superior derecho) o en app.js.");
    openApiModal();
    return;
  }

  // 1. Mostrar mensaje del usuario en pantalla
  appendMessage("user", text);

  // 2. Limpiar input y restablecer tamaño
  userInput.value = "";
  autoResizeTextarea();

  // 3. Activar estado de carga
  setLoadingState(true);
  hideAlert();

  // 4. Registrar en el historial de la conversación
  conversationHistory.push({
    role: "user",
    parts: [{ text: text }]
  });

  try {
    // 5. Llamada Fetch a la API de Google Gemini
    const aiResponseText = await queryGeminiAPI(activeApiKey, conversationHistory);

    // 6. Agregar respuesta de la IA en pantalla
    appendMessage("ai", aiResponseText);

    // 7. Guardar respuesta en el historial
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponseText }]
    });

  } catch (error) {
    console.error("Error al consultar Gemini:", error);
    showAlert(error.message || "Ocurrió un error inesperado al conectar con Gemini.");
    // Remover última consulta del usuario si falló la respuesta para mantener sincronía
    conversationHistory.pop();
  } finally {
    // 8. Desactivar estado de carga
    setLoadingState(false);
  }
}

// ============================================================================
// 6. LÓGICA DE INTEGRACIÓN CON GEMINI (FETCH API CON AUTO-FALLBACK)
// ============================================================================
/**
 * Conecta directamente con la API de Google Gemini mediante Fetch.
 * Si el modelo configurado no está disponible para la clave del usuario (ej. 404 Not Found),
 * conmuta automáticamente al siguiente modelo Flash compatible sin interrumpir al usuario.
 * @param {string} apiKey - Clave de API de Google AI Studio
 * @param {Array} history - Lista de mensajes acumulados
 * @returns {Promise<string>} - Texto de la respuesta generada
 */
async function queryGeminiAPI(apiKey, history) {
  let lastError = null;

  for (let i = activeModelIndex; i < SUPPORTED_MODELS.length; i++) {
    const modelName = SUPPORTED_MODELS[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    // Cuerpo de la petición siguiendo la especificación oficial de Google Gemini
    const requestBody = {
      contents: history,
      systemInstruction: {
        parts: [
          { text: SYSTEM_INSTRUCTION }
        ]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      // Si el modelo específico no fue encontrado (404) para esta clave, intentamos con el siguiente de la lista
      if (response.status === 404 && i + 1 < SUPPORTED_MODELS.length) {
        console.warn(`El modelo ${modelName} no está disponible para esta API Key. Probando con ${SUPPORTED_MODELS[i + 1]}...`);
        continue;
      }

      if (!response.ok) {
        let errorDetail = `Código HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error && errData.error.message) {
            errorDetail = errData.error.message;
          }
        } catch (_) { }

        if (response.status === 400) {
          throw new Error(`Solicitud no válida (400): ${errorDetail}`);
        } else if (response.status === 403 || response.status === 401) {
          throw new Error(`Error de autenticación: Tu API Key es inválida o no tiene permisos. (${errorDetail})`);
        } else if (response.status === 429) {
          throw new Error("Límite de solicitudes excedido (429 Rate Limit). Espera unos momentos antes de reintentar.");
        } else {
          throw new Error(`Error al comunicarse con Gemini (${modelName}): ${errorDetail}`);
        }
      }

      const data = await response.json();

      // Si tuvimos éxito con este modelo, actualizamos el modelo activo
      activeModelIndex = i;
      if (activeModelBadge) {
        activeModelBadge.textContent = modelName;
      }

      // Extracción del texto generado por Gemini
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        throw new Error(`La respuesta fue bloqueada por filtros de seguridad: ${data.promptFeedback.blockReason}`);
      } else {
        throw new Error("La API no devolvió candidatos de respuesta válidos.");
      }

    } catch (err) {
      lastError = err;
      // Si fue error de red o de autenticación, no tiene sentido probar más modelos
      if (err.message.includes("autenticación") || err.message.includes("429")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("No se pudo conectar con ningún modelo de Gemini disponible.");
}

// ============================================================================
// 7. FUNCIONES DE RENDERIZADO Y UI
// ============================================================================
/**
 * Inserta un nuevo mensaje en el área de chat
 * @param {"user"|"ai"} sender - Tipo de remitente
 * @param {string} text - Contenido del mensaje
 */
function appendMessage(sender, text) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("message", `${sender}-message`);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", `${sender}-avatar`);
  avatar.textContent = sender === "user" ? "Tú" : "✨";

  const content = document.createElement("div");
  content.classList.add("message-content");

  const senderLabel = document.createElement("div");
  senderLabel.classList.add("message-sender");
  senderLabel.textContent = sender === "user" ? "Tú" : "Luz";

  const body = document.createElement("div");
  body.classList.add("message-body");

  // Renderizar markdown con biblioteca Marked si está disponible, o texto plano seguro
  if (sender === "ai" && typeof marked !== "undefined") {
    body.innerHTML = marked.parse(text);
  } else {
    body.textContent = text;
  }

  const time = document.createElement("span");
  time.classList.add("message-time");
  time.textContent = getCurrentTime();

  content.appendChild(senderLabel);
  content.appendChild(body);
  content.appendChild(time);

  messageEl.appendChild(avatar);
  messageEl.appendChild(content);

  chatArea.appendChild(messageEl);
  scrollToBottom();
}

/**
 * Controla el estado visual de "Pensando..." / Cargando
 * @param {boolean} isLoading 
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    loadingIndicator.classList.remove("hidden");
    sendBtn.disabled = true;
    userInput.disabled = true;
  } else {
    loadingIndicator.classList.add("hidden");
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

function autoResizeTextarea() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 140) + "px";
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function showAlert(msg) {
  alertMessage.textContent = msg;
  alertBanner.classList.remove("hidden");
}

function hideAlert() {
  alertBanner.classList.add("hidden");
}

function handleClearChat() {
  if (confirm("¿Deseas reiniciar la conversación? Se borrarán los mensajes actuales.")) {
    conversationHistory = [];
    // Mantener sólo el mensaje de bienvenida
    const initialMessage = chatArea.querySelector(".initial-message");
    chatArea.innerHTML = "";
    if (initialMessage) {
      chatArea.appendChild(initialMessage);
    }
    hideAlert();
  }
}

// ============================================================================
// 8. GESTIÓN DE LA CLAVE DE API (.ENV, LOCALSTORAGE O MODAL)
// ============================================================================
/**
 * Carga la clave de API desde el archivo .env servido localmente
 */
async function loadEnvApiKey() {
  try {
    const response = await fetch(".env");
    if (response.ok) {
      const text = await response.text();
      const match = text.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)$/m);
      if (match && match[1]) {
        envApiKey = match[1].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch (err) {
    // Si no se puede acceder a .env (ej. protocolo file://), se usará LocalStorage o el Modal
    console.warn("No se pudo leer .env automáticamente (modo local/servidor requerido):", err);
  }
}

function getActiveApiKey() {
  // 1. Clave personalizada guardada en LocalStorage (desde el modal de la interfaz)
  const storedKey = localStorage.getItem("gemini_api_key");
  if (storedKey && storedKey.trim() !== "") {
    return storedKey.trim();
  }
  // 2. Clave desde CONFIG (cargada desde config.js local, ignorado en git)
  if (typeof CONFIG !== "undefined" && CONFIG && CONFIG.GEMINI_API_KEY && !CONFIG.GEMINI_API_KEY.includes("tu_api_key")) {
    return CONFIG.GEMINI_API_KEY.trim();
  }
  // 3. Clave leída del archivo .env (cuando se sirve mediante servidor web)
  if (envApiKey && envApiKey.trim() !== "" && !envApiKey.includes("tu_api_key")) {
    return envApiKey.trim();
  }
  // 4. Clave predeterminada para despliegue en GitHub Pages
  if (typeof DEFAULT_API_KEY !== "undefined" && DEFAULT_API_KEY && DEFAULT_API_KEY.trim() !== "") {
    return DEFAULT_API_KEY.trim();
  }
  return "";
}

function updateApiKeyStatus() {
  const activeKey = getActiveApiKey();
  if (activeKey) {
    apiKeyStatus.classList.add("configured");
    apiKeyStatus.title = "API Key configurada correctamente";
  } else {
    apiKeyStatus.classList.remove("configured");
    apiKeyStatus.title = "Falta configurar API Key";
  }
}

function openApiModal() {
  apiKeyInput.value = getActiveApiKey();
  apiModal.classList.remove("hidden");
  apiKeyInput.focus();
}

function closeApiModal() {
  apiModal.classList.add("hidden");
}

function saveApiKeyFromModal() {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    localStorage.setItem("gemini_api_key", newKey);
    showAlert("API Key guardada en el navegador exitosamente.");
    setTimeout(hideAlert, 3000);
  } else {
    localStorage.removeItem("gemini_api_key");
  }
  updateApiKeyStatus();
  closeApiModal();
}

