// Elementos del HTML
const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaPregunta = document.getElementById("pantallaPregunta");
const pantallaResultados = document.getElementById("pantallaResultados");
const totalPreguntas = document.getElementById("totalPreguntas");
const btnComenzar = document.getElementById("btnComenzar");
const progreso = document.getElementById("progreso");
const tiempo = document.getElementById("tiempo");
const puntajeTexto = document.getElementById("puntaje");
const textoPregunta = document.getElementById("textoPregunta");
const opciones = document.getElementById("opciones");
const mensaje = document.getElementById("mensaje");
const btnSiguiente = document.getElementById("btnSiguiente");
const puntajeFinal = document.getElementById("puntajeFinal");
const listaResultados = document.getElementById("listaResultados");
const btnReiniciar = document.getElementById("btnReiniciar");

// Variables del estado del quiz
const TIEMPO_POR_PREGUNTA = 60;
// Las preguntas vienen del archivo js/preguntas.js
const preguntas = datosPreguntas;
let indiceActual = 0;
let puntaje = 0;
let resultados = [];
let segundos = 0;
let intervalo = null;

totalPreguntas.textContent = preguntas.length;

function comenzar() {
    indiceActual = 0;
    puntaje = 0;
    resultados = [];
    pantallaInicio.classList.add("oculto");
    pantallaResultados.classList.add("oculto");
    pantallaPregunta.classList.remove("oculto");
    mostrarPregunta();
}

// Muestra la pregunta actual y crea un botón por cada opción
function mostrarPregunta() {
    const pregunta = preguntas[indiceActual];

    progreso.textContent = "Pregunta " + (indiceActual + 1) + " de " + preguntas.length;
    puntajeTexto.textContent = "Puntaje: " + puntaje;
    textoPregunta.textContent = pregunta.pregunta;
    mensaje.textContent = "";
    opciones.innerHTML = "";
    btnSiguiente.classList.add("oculto");

    pregunta.opciones.forEach(function (opcion) {
        const boton = document.createElement("button");
        boton.textContent = opcion;
        boton.addEventListener("click", function () {
            seleccionarRespuesta(boton, opcion);
        });
        opciones.appendChild(boton);
    });

    iniciarTemporizador();
}

// Cuenta regresiva de 60 segundos que se ejecuta cada segundo
function iniciarTemporizador() {
    clearInterval(intervalo);
    segundos = TIEMPO_POR_PREGUNTA;
    tiempo.textContent = "Tiempo: " + segundos + "s";

    intervalo = setInterval(function () {
        segundos--;
        tiempo.textContent = "Tiempo: " + segundos + "s";
        if (segundos === 0) {
            tiempoAgotado();
        }
    }, 1000);
}

// Si no responde a tiempo se resta un punto y pasa a la siguiente
function tiempoAgotado() {
    clearInterval(intervalo);
    const pregunta = preguntas[indiceActual];
    puntaje--;
    resultados.push({
        pregunta: pregunta.pregunta,
        elegida: "Sin responder",
        correcta: pregunta.correcta,
        acerto: false
    });
    siguientePregunta();
}

function seleccionarRespuesta(botonElegido, opcionElegida) {
    clearInterval(intervalo);
    const pregunta = preguntas[indiceActual];
    const acerto = opcionElegida === pregunta.correcta;

    // Se bloquean los botones y se pinta en verde la correcta
    const botones = opciones.querySelectorAll("button");
    botones.forEach(function (boton) {
        boton.disabled = true;
        if (boton.textContent === pregunta.correcta) {
            boton.classList.add("correcta");
        }
    });

    if (acerto) {
        puntaje++;
        mensaje.textContent = "¡Correcto!";
    } else {
        botonElegido.classList.add("incorrecta");
        mensaje.textContent = "Incorrecto. La respuesta correcta es: " + pregunta.correcta;
    }

    puntajeTexto.textContent = "Puntaje: " + puntaje;
    resultados.push({
        pregunta: pregunta.pregunta,
        elegida: opcionElegida,
        correcta: pregunta.correcta,
        acerto: acerto
    });
    btnSiguiente.classList.remove("oculto");
}

function siguientePregunta() {
    indiceActual++;
    if (indiceActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

// Muestra el puntaje final y el detalle de cada pregunta
function mostrarResultados() {
    pantallaPregunta.classList.add("oculto");
    pantallaResultados.classList.remove("oculto");
    puntajeFinal.textContent = "Tu puntaje final es " + puntaje + " de " + preguntas.length;
    listaResultados.innerHTML = "";

    resultados.forEach(function (resultado, i) {
        const item = document.createElement("li");
        const estado = resultado.acerto ? "✔ Correcta" : "✘ Incorrecta";
        item.innerText =
            (i + 1) + ". " + resultado.pregunta + "\n" +
            "Tu respuesta: " + resultado.elegida + "\n" +
            "Respuesta correcta: " + resultado.correcta + "\n" +
            estado;
        listaResultados.appendChild(item);
    });
}

btnComenzar.addEventListener("click", comenzar);
btnSiguiente.addEventListener("click", siguientePregunta);
btnReiniciar.addEventListener("click", comenzar);
