
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrinho | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>

    <main class="pagina-carrinho">
        <h1>SEU CARRINHO</h1>

        <div id="lista"></div>

        <h2 id="total">Total: R$ 0,00</h2>

        <div class="acoes-carrinho">
            <a href="index.php" class="voltar-loja">
                CONTINUAR COMPRANDO
            </a>

            <button id="btn-finalizar" onclick="finalizar()">
                FINALIZAR COMPRA
            </button>
        </div>
    </main>

    <script>
        const lista = document.getElementById("lista");
        const total = document.getElementById("total");

        // Recupera o carrinho salvo
        function carregarCarrinho() {
            lista.innerHTML = localStorage.getItem("carrinho") || "";

            const valor = Number(localStorage.getItem("total")) || 0;

            total.textContent =
                `Total: R$ ${valor.toFixed(2).replace(".", ",")}`;

            // Adiciona opção para remover cada produto
            lista.querySelectorAll(".item-carrinho").forEach(item => {
                if (item.querySelector(".btn-remover-carrinho")) return;

                const botao = document.createElement("button");
                botao.className = "btn-remover-carrinho";
                botao.textContent = "REMOVER";
                botao.type = "button";

                botao.addEventListener("click", () => {
                    const quantidade =
                        Number(item.dataset.quantidade) || 1;

                    const precoCentavos =
                        Number(item.dataset.precoCentavos) || 0;

                    let contador =
                        Number(localStorage.getItem("contador")) || 0;

                    let totalAtual =
                        Number(localStorage.getItem("total")) || 0;

                    contador = Math.max(0, contador - quantidade);
                    totalAtual = Math.max(
                        0,
                        totalAtual - (precoCentavos * quantidade / 100)
                    );

                    item.remove();

                    localStorage.setItem("carrinho", lista.innerHTML);
                    localStorage.setItem("contador", contador);
                    localStorage.setItem("total", totalAtual);

                    carregarCarrinho();
                });

                item.appendChild(botao);
            });
        }

        function finalizar() {
            if (!lista.querySelector(".item-carrinho")) {
                alert("Seu carrinho está vazio!");
                return;
            }

            window.location.href = "checkout.php";
        }

        carregarCarrinho();
    </script>

</body>
</html>
