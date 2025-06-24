const inventario = [];

function agregarJuego(juego) {
    inventario.push(juego);
    console.log(`Se ha añadido un juego:`, juego);
    savetolocalStorage();
    renderizarTabla(document.getElementById('filtro').value);
}


const formulario = document.getElementById('formulariodeljuego');

formulario.addEventListener('submit', async function(event) {
    event.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const desarrollador = document.getElementById('desarrollador').value;
    const genero = document.getElementById('genero').value;
    const SKU = document.getElementById('SKU').value;
    const stock = parseInt(document.getElementById('stock').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const tipo = document.getElementById('tipo').value;
    let juego;

    // profe si ve esto minimo 15 no?
    let caratula = '';
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=e0aa105257654479912278efe84efc69&search=${encodeURIComponent(titulo)}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            caratula = data.results[0].background_image || '';
        }
    } catch (error) {
        console.error('Error buscando carátula:', error);
    }

    if (tipo === 'fisico') {
        const plataforma = document.getElementById('plataforma').value;
        const tipodeembalaje = document.getElementById('tipodeembalaje').value;
        juego = new VideojuegoFísico(titulo, desarrollador, genero, SKU, stock, precio, plataforma, tipodeembalaje);
    } else if (tipo === 'digital') {
        const tamañodedescarga = document.getElementById('tamañodedescarga').value;
        const plataformacompatible = document.getElementById('plataformacompatible').value;
        juego = new VideojuegoDigital(titulo, desarrollador, genero, SKU, stock, precio, tamañodedescarga, plataformacompatible);
    } else if (tipo === 'edicionEspecial') {
        const contenidoextra = document.getElementById('contenidoextra').value;
        const edicionlimitada = document.getElementById('edicionlimitada').checked;
        juego = new VideojuegoEdicionEspecial(titulo, desarrollador, genero, SKU, stock, precio, contenidoextra, edicionlimitada);
    }
    juego.caratula = caratula;

    agregarJuego(juego);
    formulario.reset();
});

function savetolocalStorage() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
}

const tipoSelect = document.getElementById('tipo');
const camposFisico = document.getElementById('campos-fisico');
const camposDigital = document.getElementById('campos-digital');
const camposEdicion = document.getElementById('campos-edicion');

tipoSelect.addEventListener('change', function() {
    const tipo = tipoSelect.value;

    camposFisico.style.display = 'none';
    camposDigital.style.display = 'none';
    camposEdicion.style.display = 'none';

    if (tipo === 'fisico') {
        camposFisico.style.display = 'block';
    } else if (tipo === 'digital') {
        camposDigital.style.display = 'block';
    } else if (tipo === 'edicionEspecial') {
        camposFisico.style.display = 'block'; 
        camposEdicion.style.display = 'block';
    }
});

function renderizarTabla(filtro = '') {
    const tbody = document.querySelector('#tabla-inventario tbody');
    tbody.innerHTML = '';

    inventario
        .filter(juego =>
            juego.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            juego.genero.toLowerCase().includes(filtro.toLowerCase())
        )
        .forEach((juego, idx) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
    <td>${juego.titulo}</td>
    <td>${juego.desarrollador}</td>
    <td>${juego.genero}</td>
    <td>${juego.SKU}</td>
    <td>${juego.stock}</td>
    <td>${juego.precio}</td>
    <td>${juego.calcularPrecioEnTotal().toFixed(2)}</td> <!-- Nueva columna -->
    <td>${juego.constructor.name}</td>
    <td>${juego.plataforma || ''}</td>
    <td>${juego.tamañodedescarga || ''}</td>
    <td class="td-contenidoextra">${juego.contenidoextra || ''}</td>
    <td class="td-edicionlimitada">${juego.edicionlimitada ? 'Sí' : ''}</td>
    <td><img src="${juego.caratula || ''}" alt="Carátula" style="max-width:120px;max-height:150px;"></td>
`;
            tbody.appendChild(fila);
        });
    actualizarColumnasEspecial();
}

function actualizarColumnasEspecial() {
    const tipo = document.getElementById('tipo').value;
    const mostrar = tipo === 'edicionEspecial';

    document.getElementById('th-contenidoextra').style.display = mostrar ? '' : 'none';
    document.getElementById('th-edicionlimitada').style.display = mostrar ? '' : 'none';
    document.querySelectorAll('.td-contenidoextra').forEach(td => td.style.display = mostrar ? '' : 'none');
    document.querySelectorAll('.td-edicionlimitada').forEach(td => td.style.display = mostrar ? '' : 'none');
}

document.getElementById('filtro').addEventListener('input', function() {
    renderizarTabla(this.value);
});

window.onload = function() {
    const guardado = localStorage.getItem('inventario');
    if (guardado) {
        const juegos = JSON.parse(guardado);
        juegos.forEach(obj => {
            let juego;
            if (obj.plataforma !== undefined) {
               juego = new VideojuegoFísico(
                    obj.titulo, obj.desarrollador, obj.genero, obj.SKU, obj.stock, obj.precio,
                    obj.plataforma, obj.tipodeembalaje
                );
            } else if (obj.tamañodedescarga !== undefined) {
               juego = new VideojuegoDigital(
                    obj.titulo, obj.desarrollador, obj.genero, obj.SKU, obj.stock, obj.precio,
                    obj.tamañodedescarga, obj.plataformacompatible
                );
            } else if (obj.contenidoextra !== undefined) {
               juego = new VideojuegoEdicionEspecial(
                    obj.titulo, obj.desarrollador, obj.genero, obj.SKU, obj.stock, obj.precio,
                    obj.contenidoextra, obj.edicionlimitada
                );
            } else {
              juego = new Videojuego(
                    obj.titulo, obj.desarrollador, obj.genero, obj.SKU, obj.stock, obj.precio
                );
            }
           if (obj.caratula) juego.caratula = obj.caratula;
            inventario.push(juego);
        });
    }
    renderizarTabla();
};
const audio = document.getElementById('musica');
const btn = document.getElementById('toggle-audio');

btn.addEventListener('click', function() {
    if (audio.paused || audio.muted) {
        audio.muted = false;
        audio.currentTime = 0;
        audio.play();
        btn.textContent = '🔊';
    } else {
        audio.muted = true;
        audio.pause();
        btn.textContent = '🔇';
    }
});

audio.addEventListener('play', () => btn.textContent = '🔊');
audio.addEventListener('pause', () => btn.textContent = '🔇');
