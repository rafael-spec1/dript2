document.addEventListener("click", function (evento) {

    if (evento.target.closest("#btn-provar")) {

        const modal = document.getElementById("provador-modal");

        modal.style.display = "flex";
    }

    if (evento.target.closest("#fechar-provador")) {

        const modal = document.getElementById("provador-modal");

        modal.style.display = "none";
    }

});