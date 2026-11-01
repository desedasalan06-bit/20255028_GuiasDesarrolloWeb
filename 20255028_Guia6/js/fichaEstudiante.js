//Accediendo a los elementos html
const formFicha = document.getElementById("idFormFicha");
const buttonLimpiarFicha = document.getElementById("idBtnLimpiarFicha");
const resultadoFicha = document.getElementById("idResultadoFicha");

/*
Cada campo tiene su expresion regular.
- ^ y $ obligan a que TODO el valor cumpla el patron
- La bandera i del carnet permite escribir las letras en minuscula
*/
const campos = [
  {
    id: "idTxtCarnet",
    nombre: "Carnet",
    patron: /^[A-Z]{2}[0-9]{3}$/i,
  },
  {
    id: "idTxtNombreCompleto",
    nombre: "Nombre completo",
    patron: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+( [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/,
  },
  {
    id: "idTxtDui",
    nombre: "DUI",
    patron: /^\d{8}-\d$/,
  },
  {
    id: "idTxtNit",
    nombre: "NIT",
    patron: /^\d{4}-\d{6}-\d{3}-\d$/,
  },
  {
    id: "idTxtFecha",
    nombre: "Fecha de nacimiento",
    // ([\/-]) captura el separador y \2 obliga a usar el mismo en ambos lugares
    patron: /^(0[1-9]|[12]\d|3[01])([\/-])(0[1-9]|1[0-2])\2(\d{4})$/,
  },
  {
    id: "idTxtCorreo",
    nombre: "Correo electrónico",
    patron: /^[\w.+-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/,
  },
  {
    id: "idTxtEdad",
    nombre: "Edad",
    patron: /^[0-9]{1,3}$/,
  },
];

/*
La expresion regular solo revisa el formato de la fecha.
Con los grupos capturados por .exec() se comprueba que la
fecha exista (por ejemplo 31/02 no existe) y que no sea futura
*/
const fechaExiste = (texto) => {
  const partes = campos[4].patron.exec(texto);
  if (!partes) return false;

  const dia = parseInt(partes[1]);
  const mes = parseInt(partes[3]);
  const anio = parseInt(partes[4]);
  const fecha = new Date(anio, mes - 1, dia);

  return (
    fecha.getFullYear() == anio &&
    fecha.getMonth() == mes - 1 &&
    fecha.getDate() == dia &&
    fecha <= new Date()
  );
};

//Valida un campo y le coloca el estilo de Bootstrap correspondiente
const validarCampo = (campo) => {
  const input = document.getElementById(campo.id);
  const valor = input.value.trim();

  let valido = campo.patron.test(valor);
  if (valido && campo.id == "idTxtFecha") valido = fechaExiste(valor);

  input.classList.toggle("is-valid", valido);
  input.classList.toggle("is-invalid", !valido);
  return valido;
};

//Quita los estilos de validacion de un campo
const quitarEstilo = (input) => {
  input.classList.remove("is-valid", "is-invalid");
};

//Validacion en tiempo real: se valida mientras el usuario escribe
campos.forEach((campo) => {
  const input = document.getElementById(campo.id);
  input.addEventListener("input", () => {
    if (input.value == "") {
      quitarEstilo(input);
    } else {
      validarCampo(campo);
    }
  });
});

//Muestra los datos de la ficha cuando todos los campos son validos
const imprimirFicha = () => {
  let $ficha = `<div class="alert alert-success mb-0">
                  <h5><i class="bi bi-check-circle-fill"></i> Ficha válida</h5>
                  <ul class="mb-0">`;
  campos.forEach((campo) => {
    let valor = document.getElementById(campo.id).value.trim();
    if (campo.id == "idTxtCarnet") valor = valor.toUpperCase();
    $ficha += `<li><b>${campo.nombre}:</b> ${valor}</li>`;
  });
  $ficha += `</ul></div>`;
  resultadoFicha.innerHTML = $ficha;
};

//Al enviar el formulario se validan todos los campos
formFicha.addEventListener("submit", (e) => {
  //Evitando que el formulario recargue la pagina
  e.preventDefault();

  //Se usa map (y no every) para que se marquen TODOS los campos con error
  const errores = campos
    .map((campo) => (validarCampo(campo) ? null : campo.nombre))
    .filter((nombre) => nombre != null);

  if (errores.length == 0) {
    imprimirFicha();
  } else {
    resultadoFicha.innerHTML = `<div class="alert alert-danger mb-0">
        <b>Revise los siguientes campos:</b> ${errores.join(", ")}
      </div>`;
    //Colocando el cursor en el primer campo con error
    document.querySelector(".is-invalid").focus();
  }
});

//Limpia el formulario y los estilos de validacion
buttonLimpiarFicha.onclick = () => {
  formFicha.reset();
  campos.forEach((campo) => quitarEstilo(document.getElementById(campo.id)));
  resultadoFicha.innerHTML = "";
  document.getElementById("idTxtCarnet").focus();
};
