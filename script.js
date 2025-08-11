document.getElementById("adicionar-item").addEventListener("click", () => {
  const container = document.getElementById("itens-container");

  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  const produtoInput = document.createElement("input");
  produtoInput.type = "text";
  produtoInput.classList.add("produto");
  produtoInput.placeholder = "Produto/Serviço";

  const quantidadeInput = document.createElement("input");
  quantidadeInput.type = "number";
  quantidadeInput.classList.add("quantidade");
  quantidadeInput.placeholder = "Qtd";
  quantidadeInput.min = "1";
  quantidadeInput.value = "1";

  const valorInput = document.createElement("input");
  valorInput.type = "number";
  valorInput.classList.add("valorUnitario");
  valorInput.placeholder = "Valor Unitário";
  valorInput.min = "0";
  valorInput.step = "0.01";

  itemDiv.appendChild(produtoInput);
  itemDiv.appendChild(quantidadeInput);
  itemDiv.appendChild(valorInput);

  container.appendChild(itemDiv);
});

document.getElementById("gerar-pdf").addEventListener("click", gerarPDF);

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const cliente = document.getElementById("cliente").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();

  if (!cliente) {
    alert("Preencha o nome do cliente.");
    return;
  }

  const produtos = [...document.querySelectorAll(".produto")].map(input => input.value.trim());
  const quantidades = [...document.querySelectorAll(".quantidade")].map(input => parseInt(input.value));
  const valoresUnitarios = [...document.querySelectorAll(".valorUnitario")].map(input => parseFloat(input.value));

  for (let i = 0; i < produtos.length; i++) {
    if (!produtos[i]) {
      alert(`Preencha o nome do produto/serviço no item ${i + 1}.`);
      return;
    }
    if (isNaN(quantidades[i]) || quantidades[i] < 1) {
      alert(`Quantidade inválida no item ${i + 1}.`);
      return;
    }
    if (isNaN(valoresUnitarios[i]) || valoresUnitarios[i] < 0) {
      alert(`Valor unitário inválido no item ${i + 1}.`);
      return;
    }
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 15;

  doc.setFontSize(22);
  doc.text("Orçamento", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Cliente: ${cliente}`, marginLeft, 30);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - marginLeft - 50, 30);

  let totalGeral = 0;
  const bodyData = produtos.map((produto, i) => {
    const totalItem = quantidades[i] * valoresUnitarios[i];
    totalGeral += totalItem;
    return [
      produto,
      quantidades[i].toString(),
      `R$ ${valoresUnitarios[i].toFixed(2).replace('.', ',')}`,
      `R$ ${totalItem.toFixed(2).replace('.', ',')}`
    ];
  });
  doc.autoTable({
  head: [['Produto/Serviço', 'Qtd', 'Valor Unit.', 'Total']],
  body: bodyData,
  startY: 40,
  styles: { fontSize: 11 },
  headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
  columnStyles: {
    0: { cellWidth: 90 },        // Produto/Serviço - coluna larga
    1: { halign: 'left', cellWidth: 20 },  // Quantidade - alinhado à direita, largura fixa
    2: { halign: 'left', cellWidth: 40 },  // Valor Unitário - alinhado à direita
    3: { halign: 'left', cellWidth: 40 }   // Total - alinhado à direita
  }
});
  const finalY = doc.lastAutoTable.finalY || 50;

  // Total geral destacado
  doc.setFontSize(13);
  doc.setTextColor(22, 160, 133);
  doc.setFont(undefined, "bold");
  doc.text("Total Geral:", pageWidth - marginLeft - 35, finalY + 10, { align: "right" });
  doc.text(`R$ ${totalGeral.toFixed(2).replace('.', ',')}`, pageWidth - marginLeft - 5, finalY + 10, { align: "right" });
  doc.setFont(undefined, "normal");
  doc.setTextColor(0);

  if (observacoes) {
    const obsY = finalY + 25;
    doc.setFontSize(12);
    doc.text("Observações:", marginLeft, obsY);
    const splitObs = doc.splitTextToSize(observacoes, pageWidth - 2 * marginLeft);
    doc.text(splitObs, marginLeft, obsY + 7);
  }

  doc.save(`Orcamento-${cliente}.pdf`);
}

