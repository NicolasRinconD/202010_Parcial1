let socket = io.connect("http://localhost:3000", { "forceNew": true });
var data, pName, pNit;
socket.on("ofertas", pData=>{
    data = pData;
});


function register() {
    var errorFlag = false;
    
    console.log("PZ");
     let registro = {
            name: document.getElementById("razonsocial").value,
            nit: document.getElementById("nit").value
    };
    console.log("Emitting new registro");
    socket.emit("new-registro", registro);
    toggleFormVisibility();
}

function toggleFormVisibility() {
    console.log("TEST");
    var frm_element = document.getElementById('formaRegistro');
    var sub_link_element = document.getElementById('nit');
    var nosub_link_element = document.getElementById('razonsocial');

    var vis = frm_element.style;

    if (vis.display == '' || vis.display == 'none') {
        vis.display = 'block';
        sub_link_element.style.display = 'none';
        nosub_link_element.style.display = '';
    } else {
        vis.display = 'none';
        sub_link_element.style.display = 'block';
        nosub_link_element.style.display = 'none';


    }
}


function ofertar(){
    if(!data){
        socket.emit("new-oferta", {cantidad : 150000, author: pName} );
    }
    else{
        var max = 0;
        Object.entries(data).forEach(([key, val]) => {
            if(val > max){
                max = val;
            }
        });
        var val = max + (5000000 * Math.random() + 5000000);
        socket.emit("new-oferta", {cantidad : val, author: pName})
    }
}

socket.on('new-oferta', data=>{
    let html = data.map((e, i) => {
        return (`
            <div>
                <strong>${e.author}</strong>
                <em>${e.cantidad}</em>
            </div>
        `);
    }).join(" ");

    document.getElementById("rot").innerHTML = html;
});