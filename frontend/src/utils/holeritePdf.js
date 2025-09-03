import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export default function ListaPacientes({ rows, columns }) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const gerarPDFHolerites = () => {
    if (!dataInicio || !dataFim) {
      alert("Selecione as duas datas para exportar.");
      return;
    }

    const inicio = dayjs(dataInicio).startOf("day");
    const fim = dayjs(dataFim).endOf("day");

    // Filtro sem plugins extras
    const filtrados = rows.filter((r) => {
      const dataAtend = dayjs(r.data_atendimento);
      return (
        (dataAtend.isAfter(inicio) || dataAtend.isSame(inicio)) &&
        (dataAtend.isBefore(fim) || dataAtend.isSame(fim))
      );
    });

    if (!filtrados.length) {
      alert("Nenhum registro encontrado no intervalo.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    filtrados.forEach((r, idx) => {
      if (idx > 0) doc.addPage();

      // Cabeçalho
      doc.setFontSize(14).setFont("helvetica", "bold");
      doc.text("Clínica Exemplo LTDA", 40, 40);
      doc.setFontSize(10).setFont("helvetica", "normal");
      doc.text(`CNPJ: 00.000.000/0000-00`, 40, 55);
      doc.text(
        `Holerite - Referência: ${dayjs(r.data_atendimento).format("MM/YYYY")}`,
        40,
        70
      );

      doc.line(40, 80, 555, 80);

      // Dados do funcionário
      doc.text(`Funcionário: ${r.nome_paciente}`, 40, 95);
      doc.text(`CID: ${r.cid_paciente}`, 300, 95);
      doc.text(`Plano: ${r.palno_cov}`, 40, 110);
      doc.text(`Idade: ${r.idade_paciente}`, 300, 110);

      // Tabela de proventos/descontos
      autoTable(doc, {
        startY: 130,
        head: [["Descrição", "Ref", "Valor"]],
        body: [
          [
            "Atendimento",
            `${r.tempo_atendimento} min`,
            Number(r.valor_paciente).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          ],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [25, 118, 210], halign: "center" },
        columnStyles: { 2: { halign: "right" } },
        margin: { left: 40, right: 40 },
      });

      // Total
      const total = Number(r.valor_paciente) || 0;
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total Bruto: ${total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}`,
        40,
        doc.lastAutoTable.finalY + 20
      );

      // Rodapé
      doc.setFontSize(9).setFont("helvetica", "normal");
      doc.text(
        `Emitido em: ${dayjs().format("DD/MM/YYYY HH:mm")}`,
        40,
        doc.lastAutoTable.finalY + 40
      );
    });

    doc.save(`holerites-${dataInicio}-a-${dataFim}.pdf`);
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>De: </label>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />
        <label style={{ marginLeft: 10 }}>Até: </label>
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />
        <button style={{ marginLeft: 10 }} onClick={gerarPDFHolerites}>
          Exportar Holerites
        </button>
      </div>

      <div style={{ height: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
        />
      </div>
    </div>
  );
}   