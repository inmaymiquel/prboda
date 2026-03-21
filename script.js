/* =========================================================
   CONFIGURACIÓN GENERAL
   Aquí puedes cambiar datos importantes del evento y del envío
========================================================= */
const EVENT_ISO = "2026-06-20T19:30:00";
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxNHE-6EJU9YdX0pJqAj49vP93o3aijog9lcECHbxm9akYLGmuJfjvyDx1PyeQJVxZ9mA/exec";

/* =========================================================
   HELPERS
========================================================= */
function pad2(value) {
  return String(value).padStart(2, "0");
}

/* =========================================================
   CUENTA ATRÁS
========================================================= */
const countdownTitle = document.getElementById("countdownTitle");
const daysEl = document.getElementById("cdDays");
const hoursEl = document.getElementById("cdHours");
const minsEl = document.getElementById("cdMins");
const secsEl = document.getElementById("cdSecs");

const countdownTarget = new Date(EVENT_ISO).getTime();

function updateCountdown() {
  const now = Date.now();
  let diff = countdownTarget - now;

  if (diff <= 0) {
    countdownTitle.textContent = "¡Ya ha llegado el gran día!";
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    clearInterval(countdownTimer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);

  const secs = Math.floor(diff / 1000);

  daysEl.textContent = pad2(days);
  hoursEl.textContent = pad2(hours);
  minsEl.textContent = pad2(mins);
  secsEl.textContent = pad2(secs);
}

updateCountdown();
const countdownTimer = setInterval(updateCountdown, 1000);

/* =========================================================
   SCROLL DESDE EL HERO HASTA EL RSVP
========================================================= */
const heroScroll = document.getElementById("heroScroll");

heroScroll.addEventListener("click", () => {
  document.getElementById("rsvp").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* =========================================================
   BOTÓN FLOTANTE PARA VOLVER ARRIBA
========================================================= */
const fab = document.getElementById("fab");

window.addEventListener("scroll", () => {
  fab.classList.toggle("show", window.scrollY > 600);
});

fab.addEventListener("click", () => {
  document.getElementById("top").scrollIntoView({
    behavior: "smooth"
  });
});

/* =========================================================
   FORMULARIO RSVP
========================================================= */
const form = document.getElementById("rsvpForm");
const result = document.getElementById("result");
const submitBtn = form.querySelector('button[type="submit"]');

const attendInputs = form.querySelectorAll('input[name="attend"]');
const guestsSelect = document.getElementById("guestsSelect");
const busSelect = document.getElementById("busSelect");
const busStopGroup = document.getElementById("busStopGroup");
const busStopInputs = form.querySelectorAll('input[name="busStop"]');

const fullNameInput = form.querySelector('input[name="fullName"]');
const phoneInput = form.querySelector('input[name="phone"]');
const dietInput = form.querySelector('input[name="diet"]');
const songInput = form.querySelector('input[name="song"]');
const messageInput = form.querySelector('textarea[name="message"]');

/* ---------- Lectura de valores ---------- */
function getSelectedAttend() {
  const checked = form.querySelector('input[name="attend"]:checked');
  return checked ? checked.value : "";
}

function isAttending() {
  return getSelectedAttend() === "Sí, asistiré";
}

function getSelectedBusStop() {
  const checked = form.querySelector('input[name="busStop"]:checked');
  return checked ? checked.value : "";
}

/* ---------- Mostrar / ocultar parada de bus ---------- */
function toggleBusStop() {
  const showBusStop = isAttending() && busSelect.value === "Sí";

  busStopGroup.hidden = !showBusStop;

  busStopInputs.forEach((input) => {
    input.disabled = !showBusStop;

    if (!showBusStop) {
      input.checked = false;
    }
  });
}

/* ---------- Activar / desactivar campos según asistencia ---------- */
function toggleAttendanceFields() {
  const attending = isAttending();

  if (!attending) {
    guestsSelect.value = "0";
    guestsSelect.disabled = true;

    busSelect.value = "No";
    busSelect.disabled = true;

    dietInput.value = "";
    dietInput.disabled = true;

    songInput.value = "";
    songInput.disabled = true;

    fullNameInput.disabled = false;
    phoneInput.disabled = false;
    messageInput.disabled = false;
  } else {
    guestsSelect.disabled = false;
    busSelect.disabled = false;
    dietInput.disabled = false;
    songInput.disabled = false;

    if (guestsSelect.value === "0") {
      guestsSelect.value = "1";
    }
  }

  toggleBusStop();
}

/* ---------- Recoger datos del formulario ---------- */
function getFormData() {
  return {
    attend: getSelectedAttend(),
    fullName: fullNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    guests: guestsSelect.value,
    bus: busSelect.value,
    busStop: busSelect.value === "Sí" ? getSelectedBusStop() : "",
    diet: dietInput.value.trim(),
    song: songInput.value.trim(),
    message: messageInput.value.trim()
  };
}

/* ---------- Validaciones ---------- */
function validateForm(data) {
  if (!data.fullName) {
    return "Por favor, indica tu nombre y apellidos.";
  }

  if (!/^\d{9}$/.test(data.phone)) {
    return "Por favor, indica un teléfono válido de 9 números.";
  }

  if (data.attend === "Sí, asistiré" && data.bus === "Sí" && !data.busStop) {
    return "Por favor, indica en qué parada cogerás el autobús.";
  }

  return "";
}

/* ---------- Mensajes al usuario ---------- */
function showResult(message, isError = false) {
  result.style.display = "block";
  result.textContent = message;
  result.classList.toggle("is-error", isError);

  result.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

/* ---------- Teléfono: solo números y máximo 9 ---------- */
phoneInput.addEventListener("input", () => {
  phoneInput.setCustomValidity("");
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 9);
});

phoneInput.addEventListener("invalid", () => {
  phoneInput.setCustomValidity("Introduce un teléfono de 9 números.");
});

/* ---------- Eventos de interfaz ---------- */
attendInputs.forEach((input) => {
  input.addEventListener("change", toggleAttendanceFields);
});

busSelect.addEventListener("change", toggleBusStop);

/* Estado inicial del formulario */
toggleAttendanceFields();

/* ---------- Envío del formulario ---------- */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = getFormData();
  const error = validateForm(data);

  if (error) {
    showResult(error, true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Respuesta no válida del servidor: ${text.slice(0, 200)}`);
    }

    if (!json.ok) {
      throw new Error(json.message || "No se pudo guardar el RSVP.");
    }

    showResult(json.message || "¡Gracias! Tu confirmación se ha enviado correctamente.");

    form.reset();

    const defaultAttend = form.querySelector(
      'input[name="attend"][value="Sí, asistiré"]'
    );

    if (defaultAttend) {
      defaultAttend.checked = true;
    }

    guestsSelect.value = "1";
    busSelect.value = "No";
    phoneInput.setCustomValidity("");

    toggleAttendanceFields();
  } catch (error) {
    console.error(error);
    showResult(`Error: ${error.message}`, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar RSVP";
  }
});
