const socket = io();
let html = '';
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
});

function enviarMsg() {
    const fechaActual = Date.now();
    const fecha = new Date(fechaActual);
    const fechaFormat = fecha.toLocaleString();

    let msgUsuario = {
        fecha: fechaFormat,
        email: document.getElementById('email').value,
        msj: document.getElementById('textArea').value,
    };

    socket.emit('msg', msgUsuario);
}

socket.on('chatLista', async (data) => {
    await data.forEach((data) => {
        html = `
              <div>
                <p>${data.email} ${data.fecha} dijo: ${data.msj}</p>
              </div>`;
    });

    document.getElementById('chatLista').innerHTML += html;

    document.getElementById('textArea').value = '';
});
