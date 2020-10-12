//Definición de las clases
class Catering{
    constructor(name, product, mail){
        this.name = name;
        this.product = product;
        this.mail = mail;
    }
}

class UI{
    static mostrarPedidos(){
        const pedidos = Datos.traerPedidos();
        pedidos.forEach((catering) => UI.agregarCateringLista(catering));
    }

    static agregarCateringLista(catering){
        const lista = document.querySelector('#catering-list');

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${catering.name}</td>
            <td>${catering.product}</td>
            <td>${catering.mail}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        
        lista.appendChild(fila);

    }

    static eliminarCatering(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static mostrarAlerta(mensaje, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#catering-form');
        container.insertBefore(div, form);

        setTimeout(()=>document.querySelector('.alert').remove(), 3000);
    }

    static limpiarCampos(){
        document.querySelector('#name').value = '';
        document.querySelector('#product').value = '';
        document.querySelector('#mail').value = '';
    }
}

class Datos{
    static traerPedidos(){
        let pedidos;
        if(localStorage.getItem('Pedidos') === null){
            pedidos = [];
        }else{
            pedidos = JSON.parse(localStorage.getItem('pedidos'));
        }
        return pedidos;
    }

    static agregarCatering(catering){
        const pedidos = Datos.traerPedidos();
        pedidos.push(catering);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    static removerCatering(mail){
        const pedidos = Datos.traerPedidos();
        console.log(mail);

        pedidos.forEach((catering, index) => {
            if(catering.mail === mail){
                pedidos.splice(index, 1);
            }
        });
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }
}

//Carga de la página
document.addEventListener('DOMContentLoaded',UI.mostrarPedidos());

//Controlar el Evento Submit.
document.querySelector('#catering-form').addEventListener('submit',(e) => {
    e.preventDefault();

    //Obtener valores de los campos
    const name = document.querySelector('#name').value;
    const product = document.querySelector('#product').value;
    const mail = document.querySelector('#mail').value;

    if(name === '' || product === '' || mail === ''){
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'danger');
    }else{
        const catering = new Catering(name, product, mail);
        Datos.agregarCatering(catering);
        UI.agregarCateringLista(catering);
        UI.mostrarAlerta('Pedido agregado!','success');
        UI.limpiarCampos();
    }
});

document.querySelector('#catering-list').addEventListener('click', (e) => {
    UI.eliminarCatering(e.target);
    Datos.removerCatering(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Pedido Eliminado','success');
});