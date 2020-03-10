let socket = io();

var gData, pName, pNit;
var registro = {};
// SOCKET LISTENERS

socket.on("ofertas", data => {
    gData = data;
    var html = data.map(e=>{
        if(e.aceptada){
            return(`
            <p>${e.nombre} [<strong>Oferta aceptada. Valor:$${e.cantidad}</strong> ]</p>
            `);
        }
        else{
        return(`
            <p>${e.nombre} [Oferta No Aceptada] </p>
        `);
        }
    }).join(" ");
    document.getElementById('rot').innerHTML = html;
});

socket.on("new-registro", data => {
    console.log("SEEP");
    toggleFormVisibility();
});

socket.on("new-message", data =>{
    var node = document.createElement('p');
    var textNode = document.createTextNode(data.text);
    node.appendChild(textNode);
    document.getElementById('rot').appendChild(node);
});

socket.on('oferta-aceptada', data=>{
    document.getElementById('ofertaBttn').disabled = true;
});

socket.on('oferta-declined', data=>{
    document.getElementById('ofertaBttn').disabled = true;
    setTimeout(function(){document.getElementById('ofertaBttn').disabled = false;},30000);
})

function register() {


    registro = {
        name: document.getElementById("razonsocial").value,
        nit: document.getElementById("nit").value
    };
    console.log("Emitting new registro", registro);
    socket.emit("new-registro", registro);

}


function toggleFormVisibility() {
    var titulo = document.getElementById('formulario-h2');
    var ofertaButton = document.getElementById('ofertaBttn');
    var registroButton = document.getElementById('registroBttn');
    var divElements = document.getElementsByClassName('form-group');
    for(var i = 0; i < divElements.length; i++){
        if(divElements[i].style.display === "none"){
            divElements[i].style.display = "block";
        }
        else{
            divElements[i].style.display = "none";
        }
    }

    titulo.style.display = "none";
    registroButton.style.visibility = "hidden";
    ofertaButton.disabled = false;
}


function ofertar() {
    socket.emit('pre-oferta',{});
    
}
socket.on('crear-oferta', data =>{
    var oferta = {};
    if (data.length == 0 ) {
        oferta =  { cantidad: 150000000, nombre: registro.name, aceptada: false };
    }
    else {
        var max = 0;
        for(var i = 0; i < data.length; i++){
            if(data[i].cantidad > max){
                max = data[i].cantidad;
            }
        }
        var val = Math.round( (max + (5000000 * Math.random() + 5000000))*100/100);
        
        oferta = { cantidad: val, nombre: registro.name, aceptada: false };
    }
    if(asignarContrato()){
        oferta.aceptada = true;
    }
    socket.emit("new-oferta", oferta);
});

function asignarContrato() {
    var ret = false;
    var PB = Math.random() * 0.8 + 0.3;
    var PO = Math.random() * 0.8 + 0.3;
    if (PO > PB) {
        ret = true;
    }
    return ret;
}


function reset(){
    socket.emit('reset', {});
}