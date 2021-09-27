window.onload = function () {
 
// Constantes.
const REGULAR_TYPE = 0.21;
const LOWER_TYPE = 0.04;
const EXEMPT_TYPE = 0;

const baseDeDatos = [
    {
      id: 1,
      nombre: 'Goma',
      precio: 0.25,
      tax: LOWER_TYPE,
      stock: 2,
      units: 0,
    },
    {
      id: 2,
      nombre: 'Lápiz H2',
      precio: 0.4,
      tax: LOWER_TYPE,
      stock: 5,
      units: 0, 
    },
    {
      id: 3,
      nombre: 'Cinta rotular',
      precio: 9.3,
      tax: REGULAR_TYPE,
      stock: 2,
      units: 0, 
    },
    {
      id: 4,
      nombre: 'Papelera',
      precio: 2.75,
      tax: REGULAR_TYPE,
      stock: 5,
      units: 0, 
    },
    {
      id: 5,
      nombre: 'Escuadra',
      precio: 8.4,
      tax: REGULAR_TYPE,
      stock: 3,
      units: 0,  
    },
    {
      id: 6,
      nombre: 'Libro ABC',
      precio: 19,
      tax: EXEMPT_TYPE,
      stock: 2,
      units: 0, 
    }
  ];

let carrito = [];
    let total = 0;
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMsubtotal = document.querySelector('#subtotal');
    const DOMtotalTax = document.querySelector('#tax');
    const DOMtotal = document.querySelector('#total');
            
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    // FUNCIONES

    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito */
    function renderizarProductos() {
      baseDeDatos.forEach((info) => {
        // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
        // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
        // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
        // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = info.precio + '€';
        // Tax
            const miNodoTax = document.createElement('p');
            miNodoTax.classList.add('card-text');
            miNodoTax.textContent = ' iva' + ': ' + info.tax;
        // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Boton -
            const miNodoBotonMenos = document.createElement('button');
            miNodoBotonMenos.classList.remove('btn', 'btn-primary');
            miNodoBotonMenos.textContent = '-';
            miNodoBotonMenos.setAttribute('marcador', info.id);
            miNodoBotonMenos.addEventListener('click', quitarProductoAlCarrito);
        // Insertamos
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoTax);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodoCardBody.appendChild(miNodoBotonMenos);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
            });
            }
  
        //Evento para añadir un producto al carrito de la compra
        function anyadirProductoAlCarrito(evento) {
            // Anyadimos el Nodo a nuestro carrito
            carrito.push(evento.target.getAttribute('marcador'))
            // Calculo el subtotal
            calcularSubtotal();
            // Calculo el IVA
            calcularTotalTax();
            // Calculo el total
            calcularTotal();
            // Actualizamos el carrito 
            renderizarCarrito();
            // Actualizamos el LocalStorage
            guardarCarritoEnLocalStorage();
            }

        //EVENTO PARA QUITAR UN PRODUCTO AL CARRITO DE LA COMPRA.
            function quitarProductoAlCarrito(evento) {
            // Anyadimos el Nodo a nuestro carrito
            carrito.pop(evento.target.getAttribute('marcador'))
            // Calculo el subtotal
            calcularSubtotal();
            // Calculo el IVA
            calcularTotalTax();
            // Calculo el total
            calcularTotal();
            // Actualizamos el carrito 
            renderizarCarrito();
            // Actualizamos el LocalStorage
            guardarCarritoEnLocalStorage();
            }

            
        //Dibuja todos los productos guardados en el carrito
            function renderizarCarrito() {
                // Vaciamos todo el html
                DOMcarrito.textContent = '';
                // Quitamos los duplicados
                const carritoSinDuplicados = [...new Set(carrito)];
                // Generamos los Nodos a partir de carrito
                carritoSinDuplicados.forEach((item) => {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        // ¿Coincide las id? Solo puede existir un caso
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Cuenta el número de veces que se repite el producto
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Creamos el nodo del item del carrito
                    const miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}€`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '0.6rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos nodos
                    miNodo.appendChild(miBoton);
                    DOMcarrito.appendChild(miNodo);
                });
            }

            //Evento para borrar un elemento del carrito
            function borrarItemCarrito(evento) {
                // Obtenemos el producto ID que hay en el boton pulsado
                const id = evento.target.dataset.item;
                // Borramos todos los productos
                carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                });
                // volvemos a renderizar
                renderizarCarrito();
                // Calculamos el subtotal
                calcularSubtotal();
                // Calculamos el IVA
                calcularTotalTax();
                // Calculamos de nuevo el precio
                calcularTotal();
                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();
            }

            //Calcula el precio total teniendo en cuenta los productos repetidos SIN IVA
            function calcularSubtotal() {
              // Limpiamos precio anterior
              subtotal = 0;
              // Recorremos el array del carrito
              carrito.forEach((item) => {
                  // De cada elemento obtenemos su precio
                  const miItem = baseDeDatos.filter((itemBaseDatos) => {
                      return itemBaseDatos.id === parseInt(item);
                  });
                  subtotal = subtotal + miItem[0].precio;
              });
              // Renderizamos el precio en el HTML
              DOMsubtotal.textContent = subtotal.toFixed(2);
            }

            //CALCULA EL IVA
            function calcularTotalTax() {
            // Limpiamos precio anterior
            totalTax = 0;
            // Recorremos el array del carrito
            carrito.forEach((item) => {
                // De cada elemento obtenemos su precio
                const miItem = baseDeDatos.filter((itemBaseDatos) => {
                    return itemBaseDatos.id === parseInt(item);
                });
                totalTax = totalTax + miItem[0].precio * miItem[0].tax;
            });
            // Renderizamos el precio en el HTML
            DOMtotalTax.textContent = totalTax.toFixed(2);
        }

            /**
            * Calcula el precio total teniendo en cuenta los productos repetidos CON IVA INCLUIDO
            */
            function calcularTotal() {
                // Limpiamos precio anterior
                total = 0;
                // Recorremos el array del carrito
                carrito.forEach((item) => {
                    // De cada elemento obtenemos su precio
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        return itemBaseDatos.id === parseInt(item);
                    });
                    total = total + miItem[0].precio + miItem[0].precio * miItem[0].tax;
                });
                // Renderizamos el precio en el HTML
                DOMtotal.textContent = total.toFixed(2);
            }

            //Varia el carrito y vuelve a dibujarlo
            
            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                calcularSubtotal();
                calcularTotalTax();
                calcularTotal();
                // Borra LocalStorage
                localStorage.clear();
            }

            function guardarCarritoEnLocalStorage () {
                miLocalStorage.setItem('carrito', JSON.stringify(carrito));
            }

            function cargarCarritoDeLocalStorage () {
            // ¿Existe un carrito previo guardado en LocalStorage?
              if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
              carrito = JSON.parse(miLocalStorage.getItem('carrito'));
             }
            }
          
            // Eventos
            DOMbotonVaciar.addEventListener('click', vaciarCarrito);

            // Inicio
            cargarCarritoDeLocalStorage();
            renderizarProductos();
            calcularSubtotal();
            calcularTotalTax();
            calcularTotal();
            renderizarCarrito();
        }



      

    