// id, name, price
const productos = [
  { id: 1, name: "Gorra", price: 30 },
  { id: 2, name: "Mochila", price: 80 },
  { id: 3, name: "Zapatillas", price: 150 },
  { id: 4, name: "Camiseta", price: 25 },
  { id: 5, name: "Bufanda", price: 30 },
  { id: 6, name: "Guantes", price: 15 },
  { id: 7, name: "Buzo", price: 70 },
  { id: 8, name: "Calcetines", price: 10 },
  { id: 9, name: "Chaqueta", price: 100 },
  { id: 10, name: "Gorro", price: 30 },
];

document.addEventListener("DOMContentLoaded", () => {
  const listado = document.getElementById("listado-productos");
  const mensajeExito = document.getElementById("mensaje-exito");
  const detallesProducto = document.getElementById("detalles-producto");
  const detalleNombre = document.getElementById("detalle-nombre");
  const detallePrecio = document.getElementById("detalle-precio");
  const carritoCantidad = document.getElementById("carrito-cantidad");
  const carritoSeccion = document.getElementById("carrito-seccion");
  const carritoLista = document.getElementById("carrito-lista");
  const verCarritoBtn = document.getElementById("ver-carrito-btn");
  const carritoModal = document.getElementById("carrito-modal");
  const carritoModalLista = document.getElementById("carrito-modal-lista");
  const vaciarCarritoBtn = document.getElementById("vaciar-carrito-btn");
  const pagarBtn = document.getElementById("pagar-btn");

  let carrito = parseInt(localStorage.getItem("carrito")) || 0;
  let productosEnCarrito =
    JSON.parse(localStorage.getItem("productosEnCarrito")) || {};

  actualizarCarrito();

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "card-producto";

    const imagenProducto = document.createElement("img");
    imagenProducto.src = `ruta/a/tu/imagen/${producto.id}.jpg`;
    imagenProducto.alt = producto.name;
    card.appendChild(imagenProducto);

    const nombreProducto = document.createElement("p");
    nombreProducto.textContent = producto.name;

    nombreProducto.addEventListener("click", () => {
      mostrarDetalles(producto);
    });

    const precioProducto = document.createElement("p");
    precioProducto.textContent = `$ ${producto.price}`;

    const cartBoton = document.createElement("button");
    cartBoton.textContent = "Añadir al carrito";

    cartBoton.onclick = (function (producto) {
      return function () {
        mensajeExito.style.display = "block";
        setTimeout(() => {
          mensajeExito.style.display = "none";
        }, 3000);

        carrito++;
        if (productosEnCarrito[producto.id]) {
          productosEnCarrito[producto.id].cantidad++;
        } else {
          productosEnCarrito[producto.id] = { ...producto, cantidad: 1 };
        }

        localStorage.setItem("carrito", carrito);
        localStorage.setItem(
          "productosEnCarrito",
          JSON.stringify(productosEnCarrito)
        );

        actualizarCarrito();
      };
    })(producto);

    card.appendChild(imagenProducto);
    card.appendChild(nombreProducto);
    card.appendChild(precioProducto);
    card.appendChild(cartBoton);

    listado.appendChild(card);
  });

  vaciarCarritoBtn.addEventListener("click", () => {
    vaciarCarrito();
  });

  pagarBtn.addEventListener("click", () => {
    const mensajeAgradecimiento = document.getElementById(
      "mensaje-agradecimiento"
    );
    mensajeAgradecimiento.style.display = "block";

    setTimeout(() => {
      mensajeAgradecimiento.style.display = "none";
      vaciarCarrito();
    }, 3000); // Oculta el mensaje después de 3 segundos
  });

  function vaciarCarrito() {
    carrito = 0;
    productosEnCarrito = {};
    localStorage.removeItem("carrito");
    localStorage.removeItem("productosEnCarrito");
    actualizarCarrito();
  }

  function mostrarDetalles(producto) {
    const selectedProducto = listado.querySelector(".selected");
    if (selectedProducto) {
      listado.insertBefore(detallesProducto, selectedProducto.nextSibling);
    }

    detalleNombre.textContent = `Nombre: ${producto.name}`;
    detallePrecio.textContent = `Precio: $${producto.price}`;

    detallesProducto.style.display = "block";
  }

  function actualizarCarrito() {
    carritoCantidad.textContent = `Carrito: ${carrito} productos`;

    if (carrito > 0) {
      carritoSeccion.style.display = "block";
      mostrarProductosEnCarrito();
    } else {
      carritoSeccion.style.display = "none";
    }
  }

  function mostrarProductosEnCarrito() {
    carritoLista.innerHTML = "";

    for (const key in productosEnCarrito) {
      if (productosEnCarrito.hasOwnProperty(key)) {
        const producto = productosEnCarrito[key];

        const listItem = document.createElement("li");
        listItem.textContent = `${producto.name} - Cantidad: ${producto.cantidad}`;

        carritoLista.appendChild(listItem);
      }
    }
  }

  verCarritoBtn.addEventListener("click", () => {
    mostrarProductosEnCarritoModal();
  });

  function mostrarProductosEnCarritoModal() {
    carritoModalLista.innerHTML = "";

    for (const key in productosEnCarrito) {
      if (productosEnCarrito.hasOwnProperty(key)) {
        const producto = productosEnCarrito[key];

        const listItem = document.createElement("li");
        listItem.textContent = `${producto.name} - Cantidad: ${producto.cantidad}`;

        carritoModalLista.appendChild(listItem);
      }
    }

    carritoModal.style.display = "block";
  }

  const modalCloseBtn = carritoModal.querySelector(".close");
  modalCloseBtn.addEventListener("click", () => {
    carritoModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === carritoModal) {
      carritoModal.style.display = "none";
    }
  });
});
