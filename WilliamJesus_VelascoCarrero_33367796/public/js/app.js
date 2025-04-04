let equipo = document.getElementById("equipo");
let botonagregar = document.getElementById("botonagregar");
let listadeequipos = document.getElementById("listaequipos");
let boton8equipos = document.querySelector(".boton1"); 
let boton16equipos = document.querySelector(".boton2");
let contenedorTorneo = document.createElement("div"); 
let botonSiguienteRonda; 
let equipos = JSON.parse(localStorage.getItem("equipos")) || [];
let equiposNecesarios = 0;
let rondaActual = []; 


function actualizarLista() {
    listadeequipos.innerHTML = '';
    equipos.forEach((equipo, index) => {
        listadeequipos.innerHTML += `
        <div class="borrar">
            ${equipo}
            <button 
                class="boton-borrar"
                data-index="${index}">X</button>
        </div>`;
    });

    const botonesEliminar = document.querySelectorAll(".boton-borrar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", function () {
            const index = boton.dataset.index;
            equipos.splice(index, 1);
            localStorage.setItem("equipos", JSON.stringify(equipos));
            actualizarLista();
            mostrarBotonTorneo(); 
        });
    });
    mostrarBotonTorneo();
}


function mostrarBotonTorneo() {
    let botonTorneo = document.getElementById("botonTorneo");
    if (!botonTorneo && equipos.length === equiposNecesarios && equiposNecesarios > 0) {
        botonTorneo = document.createElement("button");
        botonTorneo.id = "botonTorneo";
        botonTorneo.textContent = "Iniciar Torneo";
        document.body.appendChild(botonTorneo);
        botonTorneo.addEventListener("click", iniciarTorneo);
    } else if (botonTorneo && equipos.length !== equiposNecesarios) {
        botonTorneo.remove(); 
    }
}


function iniciarTorneo() {
    alert("Inicia el torneo");
    rondaActual = equipos.slice(); 
    mostrarRonda();
}


function mostrarRonda() {
    contenedorTorneo.innerHTML = `<h2>Ronda de Enfrentamientos</h2>`;
    document.body.appendChild(contenedorTorneo);

    let ganadores = [];

    while (rondaActual.length > 1) {
        const equipo1 = rondaActual.splice(Math.floor(Math.random() * rondaActual.length), 1)[0];
        const equipo2 = rondaActual.splice(Math.floor(Math.random() * rondaActual.length), 1)[0];
        const ganador = Math.random() < 0.5 ? equipo1 : equipo2;

        contenedorTorneo.innerHTML += `<p>${equipo1} vs ${equipo2} - Gana: <strong>${ganador}</strong></p>`;
        ganadores.push(ganador);
    }

    
    if (rondaActual.length === 1) {
        const equipoSinPareja = rondaActual.pop();
        ganadores.push(equipoSinPareja);
        contenedorTorneo.innerHTML += `<p>${equipoSinPareja} pasa automáticamente a la siguiente ronda.</p>`;
    }

    rondaActual = ganadores; 
    if (rondaActual.length > 1) {
        if (!botonSiguienteRonda) {
            botonSiguienteRonda = document.createElement("button");
            botonSiguienteRonda.id = "botonSiguienteRonda";
            botonSiguienteRonda.textContent = "Siguiente Ronda";
            document.body.appendChild(botonSiguienteRonda);
        }

        botonSiguienteRonda.onclick = mostrarRonda;
    } else {
        contenedorTorneo.innerHTML += `<h2>¡El ganador del torneo es: ${rondaActual[0]}!</h2>`;
        if (botonSiguienteRonda) botonSiguienteRonda.remove(); 
    }
}


boton8equipos.addEventListener("click", function () {
    equiposNecesarios = 8;
    alert("Se necesitan 8 equipos.");
    actualizarLista();
});

boton16equipos.addEventListener("click", function () {
    equiposNecesarios = 16;
    alert("Se necesitan 16 equipos.");
    actualizarLista();
});


botonagregar.addEventListener("click", function () {
    let equipoboton = equipo.value.trim();

    if (equipoboton === "") {
        alert("Agrega un equipo"); 
        return;
    }

    if (equipos.length >= equiposNecesarios && equiposNecesarios > 0) {
        alert(`No puedes agregar más de ${equiposNecesarios} equipos.`);
        return;
    }

    equipos.push(equipoboton);
    localStorage.setItem("equipos", JSON.stringify(equipos)); 
    equipo.value = "";
    actualizarLista();
});
