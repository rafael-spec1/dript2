const opcoesPagamento = document.querySelectorAll(
    'input[name="pagamento"]'
);

const dadosCartao = document.getElementById("dados-cartao");
const dadosPix = document.getElementById("dados-pix");
const dadosBoleto = document.getElementById("dados-boleto");


opcoesPagamento.forEach(opcao => {

    opcao.addEventListener("change", function () {

        dadosCartao.style.display = "none";
        dadosPix.style.display = "none";
        dadosBoleto.style.display = "none";


        if (this.value === "cartao") {
            dadosCartao.style.display = "block";
        }

        if (this.value === "pix") {
            dadosPix.style.display = "block";
        }

        if (this.value === "boleto") {
            dadosBoleto.style.display = "block";
        }

    });

});

const listaPedido = document.getElementById("lista-pedido");
const totalPedido = document.getElementById("total-pedido");
const botaoFrete = document.getElementById("calcular-frete");
const valorFrete = 20;

botaoFrete.addEventListener("click", function () {

    const cep = document.getElementById("cep").value
        .replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("Digite um CEP válido.");
        return;
    }

    console.log("CEP informado:", cep);

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {

            if (dados.erro) {
                alert("CEP não encontrado.");
                return;
            }

            document.getElementById("cidade").value = dados.localidade;


            document.getElementById("endereco").value =
                `${dados.logradouro}, ${dados.bairro}`;
        })
        .catch(() => {
            alert("Não foi possível consultar o CEP.");
        });

    let valorFrete;

    if (cep.startsWith("0")) {
        valorFrete = 15; // São Paulo
    } else if (cep.startsWith("1")) {
        valorFrete = 18; // São Paulo
    } else if (cep.startsWith("2")) {
        valorFrete = 25; // Rio de Janeiro e Espírito Santo
    } else if (cep.startsWith("3")) {
        valorFrete = 25; // Minas Gerais
    } else if (cep.startsWith("4")) {
        valorFrete = 30; // Bahia e Sergipe
    } else if (cep.startsWith("5")) {
        valorFrete = 30; // Pernambuco e região
    } else if (cep.startsWith("6")) {
        valorFrete = 35; // Norte/Nordeste
    } else if (cep.startsWith("7")) {
        valorFrete = 35; // Centro-Oeste
    } else if (cep.startsWith("8")) {
        valorFrete = 35; // Paraná e Santa Catarina
    } else if (cep.startsWith("9")) {
        valorFrete = 40; // Rio Grande do Sul
    }

    document.getElementById("frete-pedido").textContent =
        `R$ ${valorFrete.toFixed(2).replace(".", ",")}`;

    const totalProdutos = Number(localStorage.getItem("total")) || 0;
    const novoTotal = totalProdutos + valorFrete;

    totalPedido.textContent =
        `R$ ${novoTotal.toFixed(2).replace(".", ",")}`;

    alert("Frete calculado com sucesso!");
});


document.getElementById("frete-pedido").textContent =
    `R$ ${valorFrete.toFixed(2).replace(".", ",")}`;
atualizarTotal();


document.getElementById("frete-pedido").textContent =
    `R$ ${valorFrete.toFixed(2).replace(".", ",")}`;

const carrinhoSalvo = localStorage.getItem("carrinho");
const totalSalvo = localStorage.getItem("total");

if (totalSalvo) {
    totalPedido.textContent =
        `R$ ${Number(totalSalvo).toFixed(2).replace(".", ",")}`;
} else {
    totalPedido.textContent = "R$ 0,00";
}

if (carrinhoSalvo) {
    listaPedido.innerHTML = carrinhoSalvo;

    listaPedido.querySelectorAll(".item-carrinho").forEach(item => {
        item.insertAdjacentHTML("beforeend", '<button class="btn-remover-checkout" onclick="removerDoCheckout(this)">REMOVER</button>');
    });
}

atualizarTotal();

function atualizarTotal() {
    const subtotal = [...listaPedido.querySelectorAll(".item-carrinho")]
        .reduce((soma, item) => soma + Number(item.dataset.precoCentavos || 0) * Number(item.dataset.quantidade || 0), 0) / 100;
    totalPedido.textContent = `R$ ${(subtotal + valorFrete).toFixed(2).replace(".", ",")}`;
}

function removerDoCheckout(botao) {
    const item = botao.closest(".item-carrinho");

    if (!item) return;

    item.remove();

    const itensRestantes = document.querySelectorAll("#lista-pedido .item-carrinho");
    const total = [...itensRestantes].reduce((soma, atual) => soma + Number(atual.dataset.precoCentavos || 0) * Number(atual.dataset.quantidade || 0), 0) / 100;
    const contador = [...itensRestantes].reduce((soma, atual) => soma + Number(atual.dataset.quantidade || 0), 0);

    localStorage.setItem(
        "carrinho",
        document.getElementById("lista-pedido").innerHTML
    );

    localStorage.setItem("total", total);
    localStorage.setItem("contador", contador);

    atualizarTotal();
}

document.getElementById("btn-finalizar").addEventListener("click", async () => {
    const itens = [...listaPedido.querySelectorAll(".item-carrinho")].map(item => ({
        produto_id: Number(item.dataset.produtoId),
        quantidade: Number(item.dataset.quantidade),
        tamanho: item.dataset.tamanho
    }));
    const metodo = document.querySelector('input[name="pagamento"]:checked')?.value;
    const entrega = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        cep: document.getElementById("cep").value.trim(),
        endereco: document.getElementById("endereco").value.trim(),
        numero: document.getElementById("numero").value.trim(),
        cidade: document.getElementById("cidade").value.trim()
    };

    if (!itens.length || itens.some(item => !item.produto_id)) {
        alert("Seu carrinho está vazio ou contém um item inválido.");
        return;
    }
    if (!metodo || Object.values(entrega).some(valor => !valor)) {
        alert("Preencha os dados de entrega e selecione a forma de pagamento.");
        return;
    }

    try {
        const resposta = await fetch("../php/pedidos.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ metodo, itens, entrega, frete_centavos: valorFrete * 100 })
        });
        const retorno = await resposta.json();
        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }
        if (!resposta.ok) throw new Error(retorno.mensagem || "Não foi possível salvar o pedido.");
        localStorage.removeItem("carrinho");
        localStorage.removeItem("total");
        localStorage.removeItem("contador");
        alert(`Pedido #${retorno.pedido_id} salvo com sucesso.`);
        window.location.href = "pedidos.html";
    } catch (erro) {
        alert(erro.message);
    }
});