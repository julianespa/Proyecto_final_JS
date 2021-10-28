// constructor de objetos para guardar en local storage
class objeto {
    constructor(codigo,pz,total) {
        this.codigoLs = codigo;
        this. pzLs = pz;
        this.total = total;
        this.id = Math.floor(Math.random() * (1000 - 1)) + 1;
        this.iterado = 0;
    }
};
// funciones
// crea elemento en la canasta que muestra la suma de articulos al stock
const crearElementoCanastaSuma = (objeto) => {
    $("#canastaArticulos").append(`
        <div id="${objeto.id}" class="${objeto.codigoLs}Canasta listadoCanasta">
            <h3>${objeto.codigoLs}</h3>
            <p>+${objeto.pzLs}Pz = ${objeto.total}Pz</p>
            <button id="btnBorrar${objeto.id}" class="borrar">X</button>
        </div>
    `);
    objeto.iterado = 1;
    $(`#btnBorrar${objeto.id}`).click(function() {
        eliminarElemento(objeto);  
    });
};
// crea elementos en la canasta que muestra la resta de articulos al stock
const crearElementoCanastaResta = (objeto) => {
    $("#canastaArticulos").append(`
        <div id="${objeto.id}"class="${objeto.codigoLs}Canasta listadoCanasta">
            <h3>${objeto.codigoLs}</h3>
            <p>-${objeto.pzLs}Pz = ${objeto.total}Pz</p>
            <button id="btnBorrar${objeto.id}" class="borrar">X</button>
        </div>
    `);
    objeto.iterado = 1;
    $(`#btnBorrar${objeto.id}`).click(function() {
        eliminarElemento(objeto);   
    });
};
// elimina elementos de canasta y local storage
const eliminarElemento = (objeto) => {
    for (const elemento of $("#canastaArticulos").children()) {
        if (parseInt(elemento.id) === parseInt(objeto.id)) {
            elemento.parentElement.removeChild(elemento);

            const index = parseInt(canastaLs.indexOf(objeto));
            canastaLs.splice(index,1);
            localStorage.setItem("canasta", JSON.stringify(canastaLs));

        }
    }
};
// definicion de variables
let canastaLs = JSON.parse(localStorage.getItem("canasta")) || [];

// Productos en JSON
let URL = "./productos.json"
// llamo productos desde JSON
$.get(URL, (respuesta, estado) => {
    if (estado === "success") {
        // creo los articulos en el main del sitio
        for (const articulo of respuesta) {
            $("#articulos").append(`
            <div id="${articulo.id}" class="cards">
                <img src="${articulo.imagen}.jpg" class="card-img">
                <h1 class="nombre">${articulo.nombre}</h1>
            </div>
            <div class="emergente ${articulo.id}">
                    <div class="emergenteCuerpo cuerpo${articulo.id}">
                        <button class="btn-cerrar${articulo.id} cerrar">X</button>
                        <div class="cuerpoImg">
                            <img src="${articulo.imagen}.jpg">
                        </div>
                        <div class="cuerpo${articulo.id}Datos datos"></div>
                    </div>      
            </div>
            `);
            // creo los distintos tipos del mismo articulo y los elementos para sumar y restar
            for (const datos of articulo.datos) {
                $(`.cuerpo${articulo.id}Datos`).append(`
                <div class="${datos.codigo} codigo">
                    <h2>${datos.codigo}</h2>
                    <p>
                        medida: ${datos.medida}<br>
                        cantidad: ${datos.cantidad} Pz
                    </p>
                    <form>
                        <input type="number" id="input-${datos.codigo}"></input>
                        <button type="submit" class="suma-${datos.codigo}">+</button>
                        <button type="submit" class="resta-${datos.codigo}">-</button>
                    </form>
                </div>
                `)
                // evento sumar stock
                $(`.suma-${datos.codigo}`).click(function(e){
                    console.log(`${datos.codigo}`);
                    e.preventDefault();
                    let cantAnt = datos.cantidad;
                    let cantInput = parseInt($(`#input-${datos.codigo}`).val());
                    console.log(cantAnt);
                    // sumo cantidad nueva a cantidad recibida por JSON
                    if (cantInput >= 0) {
                        let nuevaCant = cantAnt + cantInput;
                        // creo el objeto con los datos actualizados y lo pusheo 
                        canastaLs.push(new objeto(datos.codigo,cantInput,nuevaCant));
                        console.log(canastaLs);
                        $(`#canasta`).show("slow");
                        // creo los objetos de la canasta y los guardo en LS
                        for (const objeto of canastaLs) {
                            if (objeto.iterado == 0){
                                crearElementoCanastaSuma(objeto)
                                localStorage.setItem("canasta",JSON.stringify(canastaLs));
                            };
                        };
                        $(`#input-${datos.codigo}`).val(null)
                    }
                })

                $(`.resta-${datos.codigo}`).click(function(e){
                    console.log(`${datos.codigo}`);
                    e.preventDefault();
                    let cantAnt = datos.cantidad;
                    let cantInput = parseInt($(`#input-${datos.codigo}`).val());
                    console.log(cantAnt);

                    if (cantInput >= 0) {
                        let nuevaCant = cantAnt - cantInput;
                        canastaLs.push(new objeto(datos.codigo,cantInput,nuevaCant));
                        console.log(canastaLs);
                        $(`#canasta`).show("slow");
                        for (const objeto of canastaLs) {
                            if (objeto.iterado == 0){
                                crearElementoCanastaResta(objeto)
                                localStorage.setItem("canasta",JSON.stringify(canastaLs));
                            };
                        };
                        $(`#input-${datos.codigo}`).val(null)
                    }
                })
            }
        // eventos de cerrar y abrir paneles de articulos
            $(`#${articulo.id}`).click(function(){
                console.log("click");
                $(`.${articulo.id}`).toggle("display");
            })
            $(`.btn-cerrar${articulo.id}`).click(function(){
                $(`.${articulo.id}`).toggle("display");
            });    
        }
        
    }

})
// abrir y cerrar canasta
$(`#abrirCanasta`).click(function(){
    console.log("click");
    $(`#canasta`).toggle("display");
 });
$(`#cerrarCanasta`) .click(function(){
    $(`#canasta`).toggle("display");
})

// mantener carrito al refrescar
if(canastaLs != null) {
    for (const objeto of canastaLs) {
        crearElementoCanastaSuma(objeto);
    }
}