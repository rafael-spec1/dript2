
const opcoesPagamento = document.querySelectorAll('input[name="pagamento"]');
const dadosCartao = document.getElementById("dados-cartao");
const dadosPix = document.getElementById("dados-pix");
const dadosBoleto = document.getElementById("dados-boleto");

const listaPedido = document.getElementById("lista-pedido");
const totalPedido = document.getElementById("total-pedido");
const campoFrete = document.getElementById("frete-pedido");
const botaoFrete = document.getElementById("calcular-frete");

let valorFrete = 0;

// Mostra a seção correspondente ao pagamento escolhido
opcoesPagamento.forEach(opcao => {
    opcao.addEventListener("change", function () {
        dadosCartao.style.display = "none";
        dadosPix.style.display = "none";
        dadosBoleto.style.display = "none";

        if (this.value === "cartao") dadosCartao.style.display = "block";
        if (this.value === "pix") dadosPix.style.display = "block";
        if (this.value === "boleto") dadosBoleto.style.display = "block";
    });
});

// Atualiza o total usando o valor salvo no carrinho
function atualizarTotal() {
    const totalProdutos = Number(localStorage.getItem("total")) || 0;
    const total = totalProdutos + valorFrete;

    totalPedido.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;

    campoFrete.textContent =
        `R$ ${valorFrete.toFixed(2).replace(".", ",")}`;
}

// Carrega os produtos salvos no navegador
function carregarPedido() {
    listaPedido.innerHTML = localStorage.getItem("carrinho") || "";

    if (!listaPedido.querySelector(".item-carrinho")) {
        listaPedido.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    atualizarTotal();
}

carregarPedido();

// Consulta o CEP e calcula o frete estimado
botaoFrete.addEventListener("click", async function () {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("Digite um CEP válido.");
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado.");
            return;
        }

        document.getElementById("cidade").value = dados.localidade;
        document.getElementById("endereco").value =
            [dados.logradouro, dados.bairro].filter(Boolean).join(", ");
    } catch {
        alert("Não foi possível consultar o CEP.");
        return;
    }

    // Estimativa demonstrativa; não é cotação de transportadora
    const primeiroNumero = cep[0];
    const fretes = {
        "0": 15, "1": 18, "2": 25, "3": 25, "4": 30,
        "5": 30, "6": 35, "7": 35, "8": 35, "9": 40
    };

    valorFrete = fretes[primeiroNumero] ?? 0;
    atualizarTotal();

    alert("Frete estimado calculado com sucesso!");
});

// Remove um produto do resumo e sincroniza o carrinho salvo
function removerDoCheckout(botao) {
    const item = botao.closest(".item-carrinho");
    if (!item) return;

    const quantidade = Number(item.dataset.quantidade) || 1;
    const precoCentavos = Number(item.dataset.precoCentavos) || 0;

    let contador = Number(localStorage.getItem("contador")) || 0;
    let total = Number(localStorage.getItem("total")) || 0;

    contador = Math.max(0, contador - quantidade);
    total = Math.max(0, total - precoCentavos * quantidade / 100);

    item.remove();

    // Guarda apenas os produtos restantes
    const itensRestantes = listaPedido.querySelectorAll(".item-carrinho");
    localStorage.setItem("carrinho", Array.from(itensRestantes)
        .map(item => item.outerHTML).join(""));
    localStorage.setItem("contador", contador);
    localStorage.setItem("total", total);

    carregarPedido();
}

// Adiciona os botões de remoção ao resumo
listaPedido.querySelectorAll(".item-carrinho").forEach(item => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-remover-checkout";
    botao.textContent = "REMOVER";
    botao.addEventListener("click", () => removerDoCheckout(botao));
    item.appendChild(botao);
});

// Valida os dados antes de permitir avançar
document.getElementById("btn-finalizar").addEventListener("click", function () {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const pagamento = document.querySelector('input[name="pagamento"]:checked');
    const itens = listaPedido.querySelector(".item-carrinho");

    if (!itens) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!nome || !email || !cep || !numero || !endereco || !cidade) {
        alert("Preencha todos os dados de entrega.");
        return;
    }

    if (!pagamento) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    alert("Dados validados! A finalização real do pedido ainda precisa ser conectada ao sistema de pedidos.");
});
