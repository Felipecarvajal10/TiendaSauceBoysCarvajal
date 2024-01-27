console.log(Swal);

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
  let precioTotal = parseFloat(localStorage.getItem("precioTotal")) || 0;

  actualizarCarrito();

  listado.textContent = "Cargando...";
  fetch("https://justfields.com/project/pkv2Por2/json")
    .then((res) => res.json())
    .then((json) => {
      const productos = json.store.products;

      if (productos.length === 0) {
        listado.textContent = "No hay productos";
      }

      listado.textContent = "";

      productos.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "card-producto";

        // Añadir la imagen
        const imagenProducto = document.createElement("img");
        imagenProducto.src = producto.image;
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
            }, 2000);

            carrito++;
            if (productosEnCarrito[producto.id]) {
              productosEnCarrito[producto.id].cantidad++;
            } else {
              productosEnCarrito[producto.id] = { ...producto, cantidad: 1 };
            }

            // Actualizar precio total
            precioTotal += Number(producto.price);

            localStorage.setItem("carrito", carrito);
            localStorage.setItem(
              "productosEnCarrito",
              JSON.stringify(productosEnCarrito)
            );
            localStorage.setItem("precioTotal", precioTotal.toFixed(2));

            actualizarCarrito();
          };
        })(producto);

        card.appendChild(imagenProducto);
        card.appendChild(nombreProducto);
        card.appendChild(precioProducto);
        card.appendChild(cartBoton);

        listado.appendChild(card);
      });
    })
    .catch((error) => console.log("Hubo un error"));

  vaciarCarritoBtn.addEventListener("click", () => {
    vaciarCarrito();
  });

  pagarBtn.addEventListener("click", () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Gracias por comprar en Sauce Boys",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      vaciarCarritoDirecto();
    });
  });

  function vaciarCarritoDirecto() {
    carrito = 0;
    productosEnCarrito = {};
    precioTotal = 0;

    localStorage.removeItem("carrito");
    localStorage.removeItem("productosEnCarrito");
    localStorage.removeItem("precioTotal");

    actualizarCarrito();
  }

  function vaciarCarrito() {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo!",
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarritoDirecto();
        Swal.fire({
          title: "¡Eliminado!",
          text: "Su carrito ha sido eliminado.",
          icon: "success",
        });
      }
    });
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

    // Actualizar el precio totals
    const carritoTotalElement = document.getElementById("carrito-total");
    carritoTotalElement.textContent = precioTotal.toFixed(2);

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
