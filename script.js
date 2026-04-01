/* =========================================================
   CONFIGURACIÓN GENERAL
   Aquí puedes cambiar datos importantes del evento y del envío
========================================================= */
const EVENT_ISO = "2026-06-20T19:30:00";
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyRjz6cmsD8PJXFlsrUaab6DjeqQa_EOYoDxFJLlF0MMS0Dgea7N1Fx4cIyWuSNic4wWg/exec"

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
   BOTÓN FLOTANTE PARA VOLVER ARRIBA
========================================================= */
const fab = document.getElementById("fab");

window.addEventListener("scroll", () => {
    fab.classList.toggle("show", window.scrollY > 600);
});

fab.addEventListener("click", () => {
    document.getElementById("top").scrollIntoView({
        behavior: "smooth",
    });
});

/* =========================================================
   FORMULARIO RSVP
========================================================= */
const form = document.getElementById("rsvpForm");
const result = document.getElementById("result");
const submitBtn = form.querySelector('button[type="submit"]');

const attendInputs = form.querySelectorAll('input[name="attend"]');

const guestMinus = document.getElementById("guestMinus");
const guestPlus = document.getElementById("guestPlus");
const guestCountEl = document.getElementById("guestCount");
const guestsInput = document.getElementById("guestsInput");
const guestCards = document.getElementById("guestCards");
const guestsGroup = document.getElementById("guestsGroup");

const preweddingFields = document.getElementById("preweddingFields");
const preweddingLabel = document.getElementById("preweddingLabel");
const preweddingInputs = form.querySelectorAll('input[name="preweddingAttend"]');
const attendYesText = document.getElementById("attendYesText");
const attendNoText = document.getElementById("attendNoText");

const hasPreweddingForm = !!preweddingFields;

const busFields = document.getElementById("busFields");
const busSelect = document.getElementById("busSelect");
const busStopGroup = document.getElementById("busStopGroup");
const busStopInputs = form.querySelectorAll('input[name="busStop"]');
const busLabel = document.getElementById("busLabel");
const busStopLabel = document.getElementById("busStopLabel");

const songInput = form.querySelector('input[name="song"]');
const messageInput = form.querySelector('textarea[name="message"]');
const songField = document.getElementById("songField");

const defaultSubmitHTML = submitBtn.innerHTML;

let guestCount = 1;
const MIN_GUESTS = 1;
const MAX_GUESTS = 5;

/* ---------- Lectura de valores ---------- */
function getSelectedAttend() {
    const checked = form.querySelector('input[name="attend"]:checked');
    return checked ? checked.value : "";
}

function isAttending() {
    return getSelectedAttend() === "Sí, asistiré";
}

function getSelectedPreweddingAttend() {
    if (!hasPreweddingForm) return "No";
    const checked = form.querySelector('input[name="preweddingAttend"]:checked');
    return checked ? checked.value : "No";
}

function getSelectedBusStop() {
    const checked = form.querySelector('input[name="busStop"]:checked');
    return checked ? checked.value : "";
}

/* Etiquetas en plural de bus */
function updateBusLabels() {
    if (busLabel) {
        busLabel.textContent = guestCount > 1 ? "¿Necesitáis autobús?" : "¿Necesitas autobús?";
    }

    if (busStopLabel) {
        busStopLabel.textContent =
            guestCount > 1 ? "¿En qué parada cogeréis el bus?" : "¿En qué parada cogerás el bus?";
    }
}

/* ---------- Texto dinámico preboda ---------- */
function updatePreweddingLabel() {
    if (!preweddingLabel) return;

    preweddingLabel.textContent =
        guestCount > 1 ? "¿Asistiréis también a la preboda?" : "¿Asistirás también a la preboda?";
}

function updateAttendLabels() {
    if (!hasPreweddingForm || !attendYesText || !attendNoText) return;

    if (guestCount > 1) {
        attendYesText.textContent = "Sí, asistiremos";
        attendNoText.textContent = "No, no podremos asistir";
    } else {
        attendYesText.textContent = "Sí, asistiré";
        attendNoText.textContent = "No, no podré asistir";
    }
}

/* ---------- Reset preboda a "No" ---------- */
function resetPreweddingToNo() {
    if (!hasPreweddingForm) return;

    const defaultPreweddingNo = form.querySelector('input[name="preweddingAttend"][value="No podré asistir"]');

    if (defaultPreweddingNo) {
        defaultPreweddingNo.checked = true;
    }
}

/* ---------- Render de tarjetas de invitados ---------- */
function renderGuestCards() {
    guestCards.innerHTML = "";

    const attending = isAttending();
    const totalCards = attending ? guestCount : 1;

    for (let i = 1; i <= totalCards; i++) {
        const isMain = i === 1;

        const card = document.createElement("div");
        card.className = "guest-card";

        card.innerHTML = `
      <div class="guest-card-head">
        <h3 class="guest-card-title">
          ${attending ? (isMain ? "Contacto principal" : `Invitado ${i}`) : "Tus datos"}
        </h3>
        ${
            attending && isMain
                ? `<p class="guest-card-subtitle">Usaremos este nombre como referencia principal de la confirmación</p>`
                : ""
        }
      </div>

      <div class="guest-fields">
        <label for="guest_name_${i}">
          Nombre y apellidos *
          <input
            type="text"
            name="guest_name_${i}"
            id="guest_name_${i}"
            placeholder="Nombre y apellidos"
            required
          />
        </label>

        ${
            attending
                ? `
            <label for="guest_diet_${i}">
              Alergias / intolerancias / dietas específicas
              <input
                type="text"
                name="guest_diet_${i}"
                id="guest_diet_${i}"
                placeholder="Sin gluten, sin lactosa, vegetariano…"
              />
            </label>
          `
                : ""
        }
      </div>
    `;

        guestCards.appendChild(card);
    }
}

/* ---------- Actualizar contador de invitados ---------- */
function updateGuestCount(newCount) {
    guestCount = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, newCount));
    guestCountEl.textContent = guestCount;
    guestsInput.value = String(guestCount);

    updateAttendLabels();
    updatePreweddingLabel();
    updateBusLabels();
    renderGuestCards();
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

/* ---------- Activar / desactivar bloques según asistencia ---------- */
function toggleAttendanceFields() {
    const attending = isAttending();

    guestsGroup.classList.toggle("is-hidden", !attending);
    busFields.classList.toggle("is-hidden", !attending);
    songField.classList.toggle("is-hidden", !attending);

    if (hasPreweddingForm && preweddingFields) {
        preweddingFields.classList.toggle("is-hidden", !attending);
    }

    if (!attending) {
        busSelect.value = "No";
        busSelect.disabled = true;

        busStopInputs.forEach((input) => {
            input.checked = false;
            input.disabled = true;
        });

        songInput.value = "";
        songInput.disabled = true;

        if (hasPreweddingForm) {
            resetPreweddingToNo();
            preweddingInputs.forEach((input) => {
                input.disabled = true;
            });
        }
    } else {
        busSelect.disabled = false;
        songInput.disabled = false;

        if (hasPreweddingForm) {
            preweddingInputs.forEach((input) => {
                input.disabled = false;
            });
        }
    }

    updatePreweddingLabel();
    renderGuestCards();
    toggleBusStop();
}
/* ---------- Recoger datos de invitados ---------- */
function getGuestsData() {
    const guestsData = [];
    const totalGuests = isAttending() ? guestCount : 1;

    for (let i = 1; i <= totalGuests; i++) {
        const name = document.getElementById(`guest_name_${i}`)?.value.trim() || "";
        const diet = document.getElementById(`guest_diet_${i}`)?.value.trim() || "";

        guestsData.push({
            guestNumber: i,
            type: i === 1 ? "Contacto principal" : "Invitado",
            fullName: name,
            diet,
        });
    }

    return guestsData;
}

/* ---------- Recoger datos del formulario ---------- */
function getFormData() {
    const guestsData = getGuestsData();

    return {
        attend: getSelectedAttend(),
        guests: isAttending() ? guestsInput.value : "1",
        guestsData,
        fullName: guestsData[0]?.fullName || "",
        diet: guestsData[0]?.diet || "",
        preweddingAttend: isAttending()
            ? (hasPreweddingForm ? getSelectedPreweddingAttend() : "No")
            : "No",
        bus: isAttending() ? busSelect.value : "No",
        busStop: isAttending() && busSelect.value === "Sí" ? getSelectedBusStop() : "",
        song: isAttending() ? songInput.value.trim() : "",
        message: messageInput.value.trim(),
    };
}

/* ---------- Validaciones ---------- */
function validateForm(data) {
    if (!data.fullName) {
        return "Por favor, indica tu nombre y apellidos.";
    }

    for (let i = 0; i < data.guestsData.length; i++) {
        if (!data.guestsData[i].fullName) {
            return `Por favor, completa el nombre del ${i === 0 ? "contacto principal" : `invitado ${i + 1}`}.`;
        }
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
        block: "nearest",
    });
}

/* ---------- Eventos de interfaz ---------- */
attendInputs.forEach((input) => {
    input.addEventListener("change", toggleAttendanceFields);
});

busSelect.addEventListener("change", toggleBusStop);

guestMinus.addEventListener("click", () => {
    updateGuestCount(guestCount - 1);
});

guestPlus.addEventListener("click", () => {
    updateGuestCount(guestCount + 1);
});

/* Estado inicial */
updateGuestCount(1);
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
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(data),
        });

        const text = await response.text();
        let json;

        try {
            json = JSON.parse(text);
        } catch {
            throw new Error(`Respuesta no válida del servidor: ${text.slice(0, 200)}`);
        }

        if (!json.ok) {
            throw new Error(json.message || "No se pudo guardar la confirmación.");
        }

        showResult(json.message || "¡Gracias! Tu confirmación se ha enviado correctamente.");

        form.reset();

        const defaultAttend = form.querySelector('input[name="attend"][value="Sí, asistiré"]');

        if (defaultAttend) {
            defaultAttend.checked = true;
        }

        resetPreweddingToNo();
        busSelect.value = "No";

        updateGuestCount(1);
        toggleAttendanceFields();
    } catch (error) {
        console.error(error);
        showResult(`Error: ${error.message}`, true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = defaultSubmitHTML;
    }
});
