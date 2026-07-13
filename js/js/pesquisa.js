function abrirPesquisa() {
    let caixa = document.getElementById("search-box");

    if (caixa.style.display === "block") {
        caixa.style.display = "none";
    } else {
        caixa.style.display = "block";
    }
}

function pesquisarProduto() {

    let input = document.getElementById("pesquisa").value.toLowerCase();

    let produtos = document.querySelectorAll(".produto");

    produtos.forEach(function (produto) {

        let nome = produto.querySelector(".nome-produto").innerText.toLowerCase();

        if (nome.includes(input)) {
            produto.style.display = "";
        } else {
            produto.style.display = "none";
        }

    });

}