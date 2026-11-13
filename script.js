
/* =========================================
   GERADOR DE ORÇAMENTO
   Funcionalidades profissionais
   AW TECHNOLOGY
========================================= */

const containerItens = document.getElementById("itens-container");
const campoCliente = document.getElementById("cliente");
const campoObservacoes = document.getElementById("observacoes");

const botaoAdicionar = document.getElementById("adicionar-item");
const botaoGerarPDF = document.getElementById("gerar-pdf");
const botaoSalvar = document.getElementById("salvar-orcamento");

const STORAGE_KEY = "aw_gerador_orcamento_historico";

// Formatação de moeda brasileira
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);
};

// Cria um botão para remover o item
function criarBotaoRemover() {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "remove-item-button";
  botao.textContent = "×";
  botao.title = "Remover item";
  botao.setAttribute("aria-label", "Remover este item");

  return botao;
}

// Prepara os itens existentes
function prepararItens() {
  document.querySelectorAll(".item").forEach((item) => {
    if (!item.querySelector(".remove-item-button")) {
      item.appendChild(criarBotaoRemover());
    }
  });

  atualizarEstadoRemocao();
}

// Atualiza os botões de remoção
function atualizarEstadoRemocao() {
  const itens = containerItens.querySelectorAll(".item");

  itens.forEach((item) => {
    const botao = item.querySelector(".remove-item-button");

    if (botao) {
      botao.disabled = itens.length === 1;

      botao.title = itens.length === 1
        ? "É necessário manter pelo menos um item"
        : "Remover item";
    }
  });
}

// Adiciona um novo item
function adicionarItem() {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  const produtoInput = document.createElement("input");
  produtoInput.type = "text";
  produtoInput.className = "produto";
  produtoInput.placeholder = "Produto ou serviço";
  produtoInput.setAttribute("aria-label", "Produto ou serviço");

  const quantidadeInput = document.createElement("input");
  quantidadeInput.type = "number";
  quantidadeInput.className = "quantidade";
  quantidadeInput.placeholder = "Qtd.";
  quantidadeInput.min = "1";
  quantidadeInput.step = "1";
  quantidadeInput.value = "1";
  quantidadeInput.setAttribute("aria-label", "Quantidade");

  const valorInput = document.createElement("input");
  valorInput.type = "number";
  valorInput.className = "valorUnitario";
  valorInput.placeholder = "0,00";
  valorInput.min = "0";
  valorInput.step = "0.01";
  valorInput.setAttribute("aria-label", "Valor unitário");

  itemDiv.append(
    produtoInput,
    quantidadeInput,
    valorInput,
    criarBotaoRemover()
  );

  containerItens.appendChild(itemDiv);

  atualizarResumo();
  atualizarEstadoRemocao();

  produtoInput.focus();
}

// Captura os dados dos itens
function obterItens() {
  return [...containerItens.querySelectorAll(".item")].map((item) => {
    const produto = item.querySelector(".produto").value.trim();

    const quantidade = Number(
      item.querySelector(".quantidade").value
    );

    const valorUnitario = Number(
      item.querySelector(".valorUnitario").value
    );

    return {
      produto,
      quantidade,
      valorUnitario,
      total: quantidade * valorUnitario
    };
  });
}

// Calcula os valores
function calcularOrcamento() {
  const itens = obterItens();

  const totalGeral = itens.reduce((soma, item) => {
    return soma + item.total;
  }, 0);

  return {
    itens,
    totalGeral,
    quantidadeItens: itens.length
  };
}

// Atualiza o resumo lateral
function atualizarResumo() {
  const cliente = campoCliente.value.trim();
  const resumo = calcularOrcamento();

  const elementoCliente = document.getElementById("resumo-cliente");
  const elementoQuantidade = document.getElementById("quantidade-itens");
  const elementoTotal = document.getElementById("total-geral");

  if (elementoCliente) {
    elementoCliente.textContent = cliente || "Não informado";
  }

  if (elementoQuantidade) {
    elementoQuantidade.textContent = resumo.quantidadeItens;
  }

  if (elementoTotal) {
    elementoTotal.textContent = formatarMoeda(resumo.totalGeral);
  }
}

// Valida os dados antes de salvar ou gerar o PDF
function validarOrcamento() {
  const cliente = campoCliente.value.trim();

  if (!cliente) {
    alert("Preencha o nome do cliente.");
    campoCliente.focus();
    return false;
  }

  const itens = obterItens();

  for (let i = 0; i < itens.length; i++) {
    const item = itens[i];

    if (!item.produto) {
      alert(`Preencha a descrição do item ${i + 1}.`);
      containerItens.querySelectorAll(".produto")[i].focus();
      return false;
    }

    if (
      !Number.isInteger(item.quantidade) ||
      item.quantidade < 1
    ) {
      alert(`Informe uma quantidade válida no item ${i + 1}.`);
      containerItens.querySelectorAll(".quantidade")[i].focus();
      return false;
    }

    const campoValor = containerItens.querySelectorAll(".valorUnitario")[i];

    if (
      campoValor.value.trim() === "" ||
      !Number.isFinite(item.valorUnitario) ||
      item.valorUnitario < 0
    ) {
      alert(`Informe um valor unitário válido no item ${i + 1}.`);
      campoValor.focus();
      return false;
    }

    if (
      !Number.isFinite(item.total) ||
      item.total < 0
    ) {
      alert(`O valor total do item ${i + 1} é inválido.`);
      return false;
    }
  }

  return true;
}

// Monta os dados completos do orçamento
function criarDadosOrcamento() {
  const cliente = campoCliente.value.trim();
  const observacoes = campoObservacoes.value.trim();
  const resumo = calcularOrcamento();
  const dataAtual = new Date();

  return {
    id: Date.now(),
    cliente,
    data: dataAtual.toISOString(),
    itens: resumo.itens,
    total: resumo.totalGeral,
    observacoes
  };
}

// Salva o orçamento no histórico local
function salvarHistorico(dados) {
  try {
    const historicoAtual = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(historicoAtual)) {
      throw new Error("O histórico armazenado possui formato inválido.");
    }

    historicoAtual.unshift(dados);

    // Mantém os últimos 50 orçamentos
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(historicoAtual.slice(0, 50))
    );

    return true;

  } catch (erro) {
    console.error("Não foi possível salvar o histórico:", erro);
    return false;
  }
}

// Limpa o formulário após o salvamento
function limparFormulario() {
  campoCliente.value = "";
  campoObservacoes.value = "";

  // Mantém apenas um item vazio
  containerItens.innerHTML = `
    <div class="item">
      <input
        type="text"
        class="produto"
        placeholder="Produto ou serviço"
        aria-label="Produto ou serviço"
      >

      <input
        type="number"
        class="quantidade"
        placeholder="Qtd."
        min="1"
        step="1"
        value="1"
        aria-label="Quantidade"
      >

      <input
        type="number"
        class="valorUnitario"
        placeholder="0,00"
        min="0"
        step="0.01"
        aria-label="Valor unitário"
      >
    </div>
  `;

  prepararItens();
  atualizarResumo();

  campoCliente.focus();
}

// Salvar orçamento sem gerar PDF
function salvarOrcamento() {
  if (!validarOrcamento()) {
    return;
  }

  const dados = criarDadosOrcamento();

  if (!salvarHistorico(dados)) {
    alert(
      "Não foi possível salvar o orçamento. " +
      "Seus dados foram mantidos no formulário. Tente novamente."
    );
    return;
  }

  alert(
    `Orçamento de ${dados.cliente} salvo com sucesso!\n\n` +
    `Valor total: ${formatarMoeda(dados.total)}\n\n` +
    "O formulário será limpo para um novo orçamento."
  );

  limparFormulario();
}

// Geração do PDF
function gerarPDF() {
  if (!validarOrcamento()) {
    return;
  }

  if (
    !window.jspdf ||
    !window.jspdf.jsPDF
  ) {
    alert(
      "Não foi possível carregar a biblioteca de PDF. " +
      "Verifique sua conexão com a internet."
    );
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (typeof doc.autoTable !== "function") {
    alert(
      "Não foi possível carregar o recurso de tabela do PDF. " +
      "Atualize a página e tente novamente."
    );
    return;
  }

  const dados = criarDadosOrcamento();

  const cliente = dados.cliente;
  const observacoes = dados.observacoes;
  const resumo = calcularOrcamento();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margem = 15;
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

  // Cabeçalho
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("ORÇAMENTO", margem, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Documento demonstrativo", margem, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("AW TECHNOLOGY", pageWidth - margem, 17, {
    align: "right"
  });

  // Dados do documento
  doc.setTextColor(23, 43, 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DADOS DO CLIENTE", margem, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Cliente: ${cliente}`, margem, 57);

  doc.text(`Data: ${dataFormatada}`, pageWidth - margem, 57, {
    align: "right"
  });

  // Tabela
  const dadosTabela = resumo.itens.map((item) => [
    item.produto,
    item.quantidade.toString(),
    formatarMoeda(item.valorUnitario),
    formatarMoeda(item.total)
  ]);

  doc.autoTable({
    startY: 66,

    head: [[
      "Produto / Serviço",
      "Qtd.",
      "Valor unitário",
      "Total"
    ]],

    body: dadosTabela,

    margin: {
      left: margem,
      right: margem,
      bottom: 20
    },

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      textColor: [55, 65, 81],
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },

    headStyles: {
      fillColor: [15, 118, 110],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },

    columnStyles: {
      0: {
        cellWidth: "auto"
      },
      1: {
        halign: "center",
        cellWidth: 18
      },
      2: {
        halign: "right",
        cellWidth: 40
      },
      3: {
        halign: "right",
        cellWidth: 40
      }
    },

    didDrawPage: () => {
      const numeroPagina = doc.internal.getNumberOfPages();

      doc.setFontSize(8);
      doc.setTextColor(120, 130, 140);

      doc.text(
        "Gerador de Orçamento | AW TECHNOLOGY",
        margem,
        pageHeight - 9
      );

      doc.text(
        `Página ${numeroPagina}`,
        pageWidth - margem,
        pageHeight - 9,
        { align: "right" }
      );
    }
  });

  let posicaoY = doc.lastAutoTable.finalY + 13;

  // Total geral
  if (posicaoY + 15 > pageHeight - 20) {
    doc.addPage();
    posicaoY = 25;
  }

  doc.setFillColor(220, 239, 234);

  doc.roundedRect(
    margem,
    posicaoY - 8,
    pageWidth - margem * 2,
    19,
    2,
    2,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 94, 89);

  doc.text("TOTAL GERAL", margem + 5, posicaoY + 4);

  doc.text(
    formatarMoeda(resumo.totalGeral),
    pageWidth - margem - 5,
    posicaoY + 4,
    { align: "right" }
  );

  posicaoY += 25;

  // Observações com suporte a múltiplas páginas
  if (observacoes) {
    const linhas = doc.splitTextToSize(
      observacoes,
      pageWidth - margem * 2
    );

    const alturaLinha = 5;
    const alturaTitulo = 8;

    let indiceLinha = 0;

    while (indiceLinha < linhas.length) {
      if (posicaoY + alturaTitulo + alturaLinha > pageHeight - 18) {
        doc.addPage();
        posicaoY = 25;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(23, 43, 58);

      doc.text("Observações:", margem, posicaoY);

      posicaoY += alturaTitulo;

      const linhasDisponiveis = Math.max(
        1,
        Math.floor((pageHeight - 20 - posicaoY) / alturaLinha)
      );

      const trecho = linhas.slice(
        indiceLinha,
        indiceLinha + linhasDisponiveis
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);

      doc.text(trecho, margem, posicaoY);

      indiceLinha += trecho.length;
      posicaoY += trecho.length * alturaLinha + 8;
    }
  }

  // Nome do arquivo
  const nomeArquivo = cliente
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const nomePDF = `Orcamento-${nomeArquivo || "Cliente"}.pdf`;

  // Mantém o registro automático no histórico
  salvarHistorico({
    ...dados,
    arquivo: nomePDF
  });

  // Gera e baixa o PDF sem limpar o formulário
  doc.save(nomePDF);
}

// Eventos
botaoAdicionar.addEventListener("click", adicionarItem);
botaoGerarPDF.addEventListener("click", gerarPDF);
botaoSalvar.addEventListener("click", salvarOrcamento);

// Atualização automática do resumo
containerItens.addEventListener("input", atualizarResumo);
campoCliente.addEventListener("input", atualizarResumo);

// Remover itens
containerItens.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".remove-item-button");

  if (!botao || botao.disabled) {
    return;
  }

  const item = botao.closest(".item");

  if (item) {
    item.remove();
    atualizarResumo();
    atualizarEstadoRemocao();
  }
});

// Inicialização
prepararItens();
atualizarResumo();
