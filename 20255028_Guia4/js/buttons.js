function aviso(){
    alert("Bienvenido al mundo JavaScript");
}

function confirmacion(){
    //los  valores que puede almacenar la variable confirmacion
    //son true o false 
    let confirmacion = confirm("¿Desea salir de la Sesión?");
    alert(`Valor selecionado ${confirmacion}`);
}

function capturarDatos(){
    let nombre = prompt("¿Cúal es tu nombre?");
    //Notese que en campo del promt se mostrara 0 por defecto 
    let edad = prompt("¿Cual es su edad?", 0);

    alert(`Su nombre es ${nombre} y su edad es ${edad}`);
}

function dibujarParrafo(){
    let parrafo = prompt(
        "Escriba la información que desea visualizar en el parrafo"
    );
    const p = document.querySelector("#idParrafo");
    p.innerHTML = parrafo
}

