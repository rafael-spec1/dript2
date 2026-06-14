function abrirOverlay() {
        document.getElementById("overlay").style.display = "flex";
}

function fecharOverlay() {
        document.getElementById("overlay").style.display = "none";
}

function abrirPesquisa() {
        let caixa =
                document.getElementById("search-box");
        if (caixa.style.display === "block") {
                caixa.style.display = "none";
        } else {
                caixa.style.display = "block";
        }
}

function pesquisarProduto() {
        let input =
                document.getElementById("pesquisa").value.toLowerCase();
        let produtos =
                document.querySelectorAll(".produto");
        produtos.forEach(function (produto) {
                let nome =
                        produto.querySelector(".nome-produto")
                                .innerText
                                .toLowerCase();
                if (nome.includes(input)) {
                        produto.style.display = "";
                } else {
                        produto.style.display = "none";
                }
        });
}

let quantidade = 1;
function aumentarQtd() {
        quantidade++;
        document.getElementById("qtd").innerText =
                quantidade;
}
function diminuirQtd() {
        if (quantidade > 1) {
                quantidade--;
                document.getElementById("qtd").innerText =
                        quantidade;
        }
}

function selecionarTamanho(botao) {
        let botoes =
                document.querySelectorAll(".opcoes-tamanho button");
        botoes.forEach(function (btn) {
                btn.classList.remove("ativo");
        });
        botao.classList.add("ativo");
        tamanhoSelecionado = botao.innerText;
}

let contadorCarrinho = 0;
let totalCarrinho = 0;
let tamanhoSelecionado = "M";
let quantidadeSelecionada = 1;

function abrirCarrinho() {

        document
                .getElementById("carrinho")
                .classList.add("ativo");
}

function fecharCarrinho() {

        document
                .getElementById("carrinho")
                .classList.remove("ativo");
}

function adicionarCarrinho(nome, preco) {
        let areaCarrinho =
                document.getElementById("itens-carrinho");
        areaCarrinho.innerHTML += `
        <div class="item-carrinho">
        <div>
        <h3>${nome}</h3>
        <p>Tamanho: ${tamanhoSelecionado}</p>
        <p>Qtd: ${quantidade}</p>
        <p>R$ ${(preco * quantidade).toFixed(2).replace('.', ',')}</p>
        </div>
        <button class="btn-remover" onclick="removerItem(this, ${preco}, ${quantidade})">
        ✖
</button>
</div>
        `;
        contadorCarrinho++;
        document.getElementById("contador").innerText =
                contadorCarrinho;
        totalCarrinho += preco * quantidade;
        document.getElementById("total-carrinho").innerText =
                `Total: R$ ${totalCarrinho.toFixed(2)}`;
        quantidade = 1;
        document.getElementById("qtd").innerText =
                quantidade;
        localStorage.setItem("carrinho", areaCarrinho.innerHTML);
        localStorage.setItem("total", totalCarrinho);
        localStorage.setItem("contador", contadorCarrinho);
}

function removerItem(botao, preco, quantidade) {
        let item = botao.closest(".item-carrinho");
        item.remove();
        contadorCarrinho--;
        document.getElementById("contador").innerText =
                contadorCarrinho;
        totalCarrinho -= preco * quantidade;
        document.getElementById("total-carrinho").innerText =
                `Total: R$ ${totalCarrinho.toFixed(2).replace('.', ',')}`;
        localStorage.setItem("carrinho",
                document.getElementById("itens-carrinho").innerHTML);
        localStorage.setItem("total", totalCarrinho);
        localStorage.setItem("contador", contadorCarrinho);
}

function limparCarrinho() {
        document.getElementById("itens-carrinho").innerHTML = "";
        contadorCarrinho = 0;
        totalCarrinho = 0;
        document.getElementById("contador").innerText =
                contadorCarrinho;
        document.getElementById("total-carrinho").innerText =
                "Total: R$ 0,00";
        localStorage.removeItem("carrinho");
        localStorage.removeItem("total");
        localStorage.removeItem("contador");
}

window.onload = function () {
        let carrinhoSalvo =
                localStorage.getItem("carrinho");
        if (carrinhoSalvo) {
                document.getElementById("itens-carrinho").innerHTML =
                        carrinhoSalvo;
                totalCarrinho =
                        Number(localStorage.getItem("total"));
                contadorCarrinho =
                        Number(localStorage.getItem("contador"));
                document.getElementById("contador").innerText =
                        contadorCarrinho;
                document.getElementById("total-carrinho").innerText =
                        `Total: R$ ${totalCarrinho.toFixed(2)}`;
        }
}

function favoritar(botao) {
        botao.classList.toggle("favoritado");
        let favoritos = localStorage.getItem("favoritos");
        if (favoritos === null) {
                favoritos = 0;
        }
        favoritos = Number(favoritos);
        if (botao.classList.contains("favoritado")) {
                favoritos++;
        } else {
                favoritos--;
        }
        localStorage.setItem("favoritos", favoritos);
        document.getElementById("contador-favoritos").textContent = favoritos;
}

function filtrarProdutos(categoria) {
        let produtos = document.querySelectorAll(".produto");
        produtos.forEach(produto => {
                if (
                        categoria === "todos" ||
                        produto.dataset.categoria === categoria
                ) {
                        produto.style.display = "block";
                } else {
                        produto.style.display = "none";
                }
        });
}
