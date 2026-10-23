// =====================================================
//  DATOS
// =====================================================

// Arreglo principal donde se guardan todos los pedidos
let pedidos = [];

// Guarda el precio máximo del filtro activo (null = sin filtro)
let precioMaximoActivo = null;

// =====================================================
//  REFERENCIAS A ELEMENTOS DEL DOM
// =====================================================
const formPedido = document.querySelector("#formPedido");
const txtProducto = document.querySelector("#txtProducto");
const txtPrecio = document.querySelector("#txtPrecio");
const txtCantidad = document.querySelector("#txtCantidad");

const txtPrecioMaximo = document.querySelector("#txtPrecioMaximo");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");
const lblFiltro = document.querySelector("#lblFiltro");

const tbodyPedidos = document.querySelector("#tbodyPedidos");
const lblTotalUnidades = document.querySelector("#lblTotalUnidades");
const lblMontoTotal = document.querySelector("#lblMontoTotal");

// =====================================================
//  FUNCIONES DE PROCESAMIENTO DE DATOS (no tocan el HTML)
// =====================================================

// Crea un objeto pedido con la estructura solicitada
function crearPedido(producto, precio, cantidad) {
  return { producto: producto, precio: precio, cantidad: cantidad };
}

// Valida los datos y devuelve un objeto con los errores encontrados
function validarPedido(producto, precio, cantidad) {
  return {
    producto: producto.trim() === "",
    precio: isNaN(precio) || precio <= 0,
    cantidad: !Number.isInteger(cantidad) || cantidad <= 0,
  };
}

// Devuelve true si no hay ningún error
function esValido(errores) {
  return Object.values(errores).every((error) => error === false);
}

// Agrega un pedido al arreglo
function agregarPedido(pedido) {
  pedidos.push(pedido);
}

// Calcula el subtotal de un pedido
function calcularSubtotal(pedido) {
  return pedido.precio * pedido.cantidad;
}

// Devuelve un NUEVO arreglo con los pedidos cuyo precio sea <= precioMaximo
// (filter no modifica el arreglo original)
function filtrarPorPrecio(lista, precioMaximo) {
  return lista.filter((pedido) => pedido.precio <= precioMaximo);
}

// Devuelve los pedidos que se deben mostrar según el filtro activo
function obtenerPedidosVisibles() {
  return precioMaximoActivo === null
    ? pedidos
    : filtrarPorPrecio(pedidos, precioMaximoActivo);
}

// Suma el total de unidades usando reduce
function calcularTotalUnidades(lista) {
  return lista.reduce((total, pedido) => total + pedido.cantidad, 0);
}

// Suma el monto total usando map + reduce
function calcularMontoTotal(lista) {
  return lista
    .map(calcularSubtotal)
    .reduce((total, subtotal) => total + subtotal, 0);
}

// Vacía el arreglo de pedidos
function vaciarPedidos() {
  pedidos = [];
}

// Da formato de moneda a un número
function formatoMoneda(valor) {
  return "$" + valor.toFixed(2);
}

// =====================================================
//  FUNCIONES DE ACTUALIZACIÓN DEL HTML
// =====================================================

// Crea una fila <tr> a partir de un pedido
function crearFila(pedido, indice) {
  const fila = document.createElement("tr");
  const celdas = [
    indice + 1,
    pedido.producto,
    formatoMoneda(pedido.precio),
    pedido.cantidad,
    formatoMoneda(calcularSubtotal(pedido)),
  ];

  celdas.forEach((valor) => {
    const td = document.createElement("td");
    td.textContent = valor; // textContent evita inyectar HTML
    fila.appendChild(td);
  });

  return fila;
}

// Dibuja la tabla con la lista recibida
function renderizarTabla(lista) {
  if (lista.length === 0) {
    tbodyPedidos.innerHTML = `
      <tr>
        <td colspan="5" class="fila-vacia">No hay pedidos para mostrar</td>
      </tr>`;
    return;
  }
  // map transforma cada pedido en una fila <tr>
  tbodyPedidos.replaceChildren(...lista.map(crearFila));
}

// Actualiza los indicadores de unidades y monto
function renderizarTotales(lista) {
  lblTotalUnidades.textContent = calcularTotalUnidades(lista);
  lblMontoTotal.textContent = formatoMoneda(calcularMontoTotal(lista));
}

// Muestra un texto indicando si hay un filtro activo
function renderizarEstadoFiltro() {
  lblFiltro.textContent =
    precioMaximoActivo === null
      ? `Mostrando todos los pedidos (${pedidos.length}).`
      : `Filtro activo: precio unitario ≤ ${formatoMoneda(precioMaximoActivo)}.`;
}

// Actualiza toda la vista
function actualizarVista() {
  const visibles = obtenerPedidosVisibles();
  renderizarTabla(visibles);
  renderizarTotales(visibles);
  renderizarEstadoFiltro();
}

// Marca en rojo los campos con error (clases de Bootstrap)
function mostrarErrores(errores) {
  txtProducto.classList.toggle("is-invalid", errores.producto);
  txtPrecio.classList.toggle("is-invalid", errores.precio);
  txtCantidad.classList.toggle("is-invalid", errores.cantidad);
}

// Limpia el formulario después de registrar un pedido
function limpiarFormulario() {
  formPedido.reset();
  mostrarErrores({ producto: false, precio: false, cantidad: false });
  txtProducto.focus();
}

// =====================================================
//  MANEJADORES DE EVENTOS
// =====================================================

function manejarAgregarPedido(evento) {
  evento.preventDefault(); // evita que la página se recargue

  const producto = txtProducto.value;
  const precio = parseFloat(txtPrecio.value);
  const cantidad = Number(txtCantidad.value);

  const errores = validarPedido(producto, precio, cantidad);
  mostrarErrores(errores);

  if (!esValido(errores)) return;

  agregarPedido(crearPedido(producto.trim(), precio, cantidad));
  limpiarFormulario();
  actualizarVista();
}

function manejarFiltrar() {
  const precioMaximo = parseFloat(txtPrecioMaximo.value);
  const invalido = isNaN(precioMaximo) || precioMaximo < 0;
  txtPrecioMaximo.classList.toggle("is-invalid", invalido);
  if (invalido) return;

  precioMaximoActivo = precioMaximo;
  actualizarVista();
}

function manejarMostrarTodos() {
  precioMaximoActivo = null;
  txtPrecioMaximo.value = "";
  txtPrecioMaximo.classList.remove("is-invalid");
  actualizarVista();
}

function manejarLimpiar() {
  vaciarPedidos();
  manejarMostrarTodos(); // quita el filtro y actualiza la vista
}

// =====================================================
//  REGISTRO DE EVENTOS (addEventListener, sin onclick en el HTML)
// =====================================================
formPedido.addEventListener("submit", manejarAgregarPedido);
btnFiltrar.addEventListener("click", manejarFiltrar);
btnMostrarTodos.addEventListener("click", manejarMostrarTodos);
btnLimpiar.addEventListener("click", manejarLimpiar);

// Dibujo inicial
actualizarVista();
