const socket = io();
let html = '';
/* 
let productoNuevo = {
    producto: document.getElementById('productoId').value,
    precio: document.getElementById('precioId').value,
    img: document.getElementById('myFileId').value,
};

function cargarProducto() {
    socket.emit('prodActualizado', productoNuevo);
}

socket.on('producList', (data) => {
    data.forEach((data) => {
        html = `<div>
            <ul>
            <li>${data.producto}</li>
            <li><img src=${data.img} alt="#"></img></li>
            <li>$${data.precio}</li>
            </ul> 
        </div>`;
    });

    document.getElementById('productos').innerHTML = html;

    productoNuevo = {
        producto: (document.getElementById('productoId').value = ''),
        precio: (document.getElementById('precioId').value = ''),
        img: (document.getElementById('myFileId').value = ''),
    };
}); */

function enviarMsg() {
    const fechaActual = Date.now();
    const fecha = new Date(fechaActual);
    const fechaFormat = fecha.toLocaleString();

    let msgUsuario = {
        fecha: fechaFormat,
        email: document.getElementById('email').value,
        msg: document.getElementById('textArea').value,
    };

    socket.emit('msg', msgUsuario);
}

socket.on('chatLista', async (data) => {
    await data.forEach((data) => {
        html += `
              <div>
                <p>${data.email} ${data.fecha} dijo: ${data.msg}</p>
              </div>`;
    });

    document.getElementById('chatLista').innerHTML = html;

    document.getElementById('textArea').value = '';
});

async function cargarProducto(a) {
    let options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=utf-8 ' },
        body: JSON.stringify({ a }),
    };
    await fetch('http://localhost:8080/api/carrito', options);
}
async function eliminarItemCarrito(value) {
    try {
        let options = {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=utf-8 ' },
        };
        await fetch(`http://localhost:8080/api/carrito/${value}`, options);
    } catch (e) {
        console.log(e);
    }
}
async function vaciarCarrito() {
    try {
        let options = {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=utf-8 ' },
        };
        await fetch(`http://localhost:8080/api/carrito`, options);
    } catch (e) {
        console.log(e);
    }
}
