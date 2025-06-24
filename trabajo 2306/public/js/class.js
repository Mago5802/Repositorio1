class Videojuego {
    constructor(titulo, desarrollador, genero, SKU, stock, precio) {
        this.titulo = titulo;
        this.desarrollador = desarrollador;
        this.genero = genero;
        this.SKU = SKU;
        this.stock = stock;
        this.precio = precio;
    }
    calcularPrecioEnTotal() {
        return this.precio * this.stock;
    }    
}
class VideojuegoFísico extends Videojuego {
    constructor(titulo, desarrollador, genero, SKU, stock, precio, plataforma, tipodeembalaje) {
        super(titulo,desarrollador, genero, SKU, stock, precio);
        this.plataforma = plataforma;
        this.tipodeembalaje = tipodeembalaje;
    }
}
class VideojuegoDigital extends Videojuego {
    constructor(titulo, desarrollador, genero, SKU, stock, precio, tamañodedescarga, plataformacompatible) {
        super(titulo, desarrollador , genero, SKU, stock, precio);
        this.tamañodedescarga = tamañodedescarga;
        this.plataformacompatible = plataformacompatible;
       }
}
class VideojuegoEdicionEspecial extends Videojuego {
    constructor(titulo, desarrollador, genero, SKU, stock, precio, contenidoextra, edicionlimitada) {
        super(titulo, desarrollador , genero, SKU, stock, precio);
        this.contenidoextra = contenidoextra;
        this.edicionlimitada = edicionlimitada;
    }
}