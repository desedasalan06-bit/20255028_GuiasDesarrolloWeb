//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

/*
Funciones para la persistencia de datos con LocalStorage.
LocalStorage solo guarda texto, por eso los arreglos se
convierten con JSON.stringify y se recuperan con JSON.parse
*/
function leerLocalStorage(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch (error) {
    //Si el dato guardado esta dañado se inicia con un arreglo vacio
    return [];
  }
}

const guardarPacientes = () => {
  localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};

//Arreglo global de pacientes, se recupera del LocalStorage si existe
let arrayPaciente = leerLocalStorage("pacientes");

//Posicion del paciente que se esta editando (-1 = ninguno)
let posicionEditar = -1;

/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  //Saliendo del modo edicion
  posicionEditar = -1;
  buttonAgregarPaciente.innerHTML = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;

  inputNombre.focus();
};

/*
 Funcion para validar el ingreso del paciente
*/

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    let paciente = new Array(
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion
    );

    if (posicionEditar == -1) {
      //Agregando informacion al arreglo paciente
      arrayPaciente.push(paciente);
      //Asignando un mensaje a nuestra notificacion
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    } else {
      //Reemplazando la informacion del paciente que se esta editando
      arrayPaciente[posicionEditar] = paciente;
      mensaje.innerHTML = "Se han actualizado los datos del paciente";
      //Actualizando la tabla con los nuevos datos
      imprimirPacientes();
    }
    //Guardando los cambios en LocalStorage
    guardarPacientes();
    //Llamando al componente de Bootstrap
    toast.show();

    //Limpiando formulario
    limpiarForm();
  } else {
    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Faltan campos por completar";
    //Llamando al componente de Bootstrap
    toast.show();
  }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element) => {
    $fila += `<tr>
                <td scope="row" class="text-center fw-bold">${contador}</td>
                <td>${element[0]}</td>
                <td>${element[1]}</td>
                <td>${element[2]}</td>
                <td>${element[3]}</td>
                <td>${element[4]}</td>
                <td>${element[5]}</td>
                <td>
                    <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" alt="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" alt="Eliminar">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  let $table = `<div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                    <tr>
                        <th scope="col" class="text-center" style="width:5%">#</th>
                        <th scope="col" class="text-center" style="width:15%">Nombre</th>
                        <th scope="col" class="text-center" style="width:15%">Apellido</th>
                        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                        <th scope="col" class="text-center" style="width:10%">Sexo</th>
                        <th scope="col" class="text-center" style="width:10%">País</th>
                        <th scope="col" class="text-center" style="width:25%">Dirección</th>
                        <th scope="col" class="text-center" style="width:10%">Opciones</th>
                    </tr>
                    ${imprimirFilas()}
                </table>
            </div>
        `;
  document.getElementById("idTablaPacientes").innerHTML = $table;
};

//Carga los datos del paciente en el formulario para poder editarlos
const editarPaciente = (posicion) => {
  let paciente = arrayPaciente[posicion];

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];
  inputRdMasculino.checked = paciente[3] == "Hombre";
  inputRdFemenino.checked = paciente[3] == "Mujer";
  //Buscando el option del pais por su texto
  for (let option of cmbPais.options) {
    if (option.text == paciente[4]) option.selected = true;
  }
  inputDireccion.value = paciente[5];

  //Entrando al modo edicion
  posicionEditar = posicion;
  buttonAgregarPaciente.innerHTML = `<i class="bi bi-pencil-square"></i> Actualizar Datos`;
  inputNombre.focus();
};

//Elimina un paciente del arreglo previa confirmacion
const eliminarPaciente = (posicion) => {
  let paciente = arrayPaciente[posicion];

  if (confirm(`¿Desea eliminar al paciente ${paciente[0]} ${paciente[1]}?`)) {
    arrayPaciente.splice(posicion, 1);
    guardarPacientes();

    //Ajustando el paciente que se estaba editando
    if (posicion == posicionEditar) {
      limpiarForm();
    } else if (posicion < posicionEditar) {
      posicionEditar--;
    }

    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Se ha eliminado el paciente";
    //Llamando al componente de Bootstrap
    toast.show();

    imprimirPacientes();
  }
};

//Paises agregados por el usuario, se recuperan del LocalStorage
//para que los pacientes guardados con esos paises se puedan editar
let arrayPaises = leerLocalStorage("paises");
arrayPaises.forEach((nombrePais) => {
  let option = document.createElement("option");
  option.textContent = nombrePais;
  option.value = cmbPais.children.length;
  cmbPais.appendChild(option);
});

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value;

  if (paisNew != "") {
    // Creando nuevo option con la API DOM
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;

    //Agregando el nuevo option en el select
    cmbPais.appendChild(option);

    //Guardando el nuevo pais en LocalStorage
    arrayPaises.push(paisNew);
    localStorage.setItem("paises", JSON.stringify(arrayPaises));

    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Pais agregado correctamente";
    //Llamando al componente de Bootstrap
    toast.show();
  } else {
    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Faltan campos por completar";
    //Llamando al componente de Bootstrap
    toast.show();
  }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

// Los botones Editar y Eliminar se crean dinamicamente en la tabla,
// por eso se escucha el click en el contenedor de la tabla
document.getElementById("idTablaPacientes").addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;

  // El id del boton termina con el numero de fila (el contador inicia en 1)
  if (boton.id.startsWith("idBtnEditar")) {
    editarPaciente(parseInt(boton.id.replace("idBtnEditar", "")) - 1);
  } else if (boton.id.startsWith("idBtnEliminar")) {
    eliminarPaciente(parseInt(boton.id.replace("idBtnEliminar", "")) - 1);
  }
});

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
limpiarForm();

//Si hay pacientes guardados en LocalStorage se muestran al cargar la pagina
if (arrayPaciente.length > 0) imprimirPacientes();
