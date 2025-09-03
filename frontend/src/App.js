import { useState, useEffect } from "react";
import Header from "./components/Header/header";
import Formulario from "./components/Formulario/span";
import {
  DataGrid,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
  gridRowsLookupSelector
} from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import "./components/Formulario/Dados/divvalores.css";

function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [data, setData] = useState("");
  const [cid, setCid] = useState("");
  const [valor_paciente, setValor_paciente] = useState("");
  const [planoCov, setPlanoCov] = useState("");
  const [tempo_atendimento, setTempo_atendimento] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  // estados para exportar PDF
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const apiRef = useGridApiRef();

  useEffect(() => {
    buscarPacientes();
  }, []);

  async function buscarPacientes() {
    try {
      const response = await fetch("http://localhost:5000/paciente");
      if (!response.ok) throw new Error("Erro ao buscar pacientes");
      const data = await response.json();
      setRows(data);
      setFilteredRows(data); // inicia com todos
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const valorNumerico = parseFloat(valor_paciente.replace(/\D/g, "")) / 100;

    try {
      const response = await fetch("http://localhost:5000/paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_paciente: nome,
          idade_paciente: idade,
          data_atendimento: data,
          cid_paciente: cid,
          palno_cov: planoCov,
          valor_paciente: valorNumerico.toFixed(2),
          tempo_atendimento: tempo_atendimento,
        }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      await response.json();
      alert("Paciente cadastrado com sucesso!");
      buscarPacientes();

      // limpa o formulário
      setNome("");
      setIdade("");
      setData("");
      setCid("");
      setValor_paciente("");
      setPlanoCov("");
      setTempo_atendimento("");
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      alert("Falha ao cadastrar paciente");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "nome_paciente", headerName: "Nome", flex: 1 },
    { field: "palno_cov", headerName: "Plano", flex: 1 },
    { field: "idade_paciente", headerName: "Idade", flex: 0.5 },
    { field: "data_atendimento", headerName: "Data", flex: 1 },
    { field: "cid_paciente", headerName: "CID", flex: 1 },
    { field: "valor_paciente", headerName: "Valor", flex: 1 },
    { field: "tempo_atendimento", headerName: "Tempo", flex: 1 },
  ];

  // Totais dinâmicos com base nas linhas visíveis
  const somaTotalTempo = filteredRows.reduce(
    (total, item) => total + parseFloat(item.tempo_atendimento || 0),
    0
  );

  const somaTotalValor = filteredRows.reduce(
    (total, item) => total + parseFloat(item.valor_paciente || 0),
    0
  );

  // Função para gerar PDF único com todos os pacientes filtrados
  const gerarPDFHolerites = () => {
    if (!dataInicio || !dataFim) {
      alert("Selecione as duas datas para exportar.");
      return;
    }

    const inicio = dayjs(dataInicio).startOf("day");
    const fim = dayjs(dataFim).endOf("day");

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

    // Cabeçalho do relatório
    doc.setFontSize(14).setFont("helvetica", "bold");
    doc.text("Relatório de Atendimentos", 40, 40);
    doc.setFontSize(10).setFont("helvetica", "normal");
    doc.text(
      `Período: ${dayjs(dataInicio).format("DD/MM/YYYY")} até ${dayjs(dataFim).format("DD/MM/YYYY")}`,
      40,
      55
    );
    doc.text(`Emitido em: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 40, 70);

    // Monta os dados para a tabela
    const body = filtrados.map((r) => {
      const bruto = Number(r.valor_paciente) || 0;
      const liquido = bruto * 0.4;
      return [
        r.nome_paciente,
        r.palno_cov,
        r.idade_paciente,
        dayjs(r.data_atendimento).format("DD/MM/YYYY"),
        r.cid_paciente,
        bruto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        `${r.tempo_atendimento} min`,
        liquido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      ];
    });

    autoTable(doc, {
      startY: 90,
      head: [["Nome", "Plano", "Idade", "Data", "CID", "Valor Bruto", "Tempo", "Valor Líquido (40%)"]],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [25, 118, 210], halign: "center" },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40, halign: "center" },
        3: { cellWidth: 60, halign: "center" },
        4: { cellWidth: 50, halign: "center" },
        5: { cellWidth: 60, halign: "right" },
        6: { cellWidth: 50, halign: "center" },
        7: { cellWidth: 70, halign: "right" }
      },
      margin: { left: 40, right: 40 }
    });

    // Totais no final
    const totalTempo = filtrados.reduce((acc, r) => acc + (Number(r.tempo_atendimento) || 0), 0);
    const totalValor = filtrados.reduce((acc, r) => acc + (Number(r.valor_paciente) || 0), 0);
    const totalLiquido = totalValor * 0.4;

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "bold");
    doc.text(`Total de tempo: ${totalTempo} minutos`, 40, finalY);
    doc.text(`Total bruto: ${totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, 300, finalY);
    doc.text(`Total líquido (40%): ${totalLiquido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, 300, finalY + 20);

    doc.save(`relatorio-${dataInicio}-a-${dataFim}.pdf`);
  };

  return (
    <>
      <Header />
      <Formulario
        nome={nome}
        setNome={setNome}
        idade={idade}
        setIdade={setIdade}
        data={data}
        setData={setData}
        cid={cid}
        setCid={setCid}
        valor_paciente={valor_paciente}
        setValor_paciente={setValor_paciente}
        planoCov={planoCov}
        setPlanoCov={setPlanoCov}
        tempo_atendimento={tempo_atendimento}
        setTempo_atendimento={setTempo_atendimento}
        loading={loading}
        handleSubmit={handleSubmit}
      />
        {/* Filtro de datas e botão de exportação */}
      <div className="div_pdf">
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
          Exportar Relatório PDF
        </button>
      </div>

      <div className="div_grid">
        <DataGrid
          className="table"
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          filterMode="client"
          disableColumnMenu={false}
          onStateChange={(gridState) => {
            const ids = gridFilteredSortedRowIdsSelector(gridState);
            const lookup = gridRowsLookupSelector(gridState);
            const visibleRows = ids.map((id) => lookup[id]).filter(Boolean);

            const currentIds = filteredRows.map((r) => r.id).join(",");
            const nextIds = visibleRows.map((r) => r.id).join(",");

            if (currentIds !== nextIds) {
              setFilteredRows(visibleRows);
            }
          }}
        />
      </div>

      <div className="divvalores">
        <p>Tempo de atendimento: {somaTotalTempo} minutos</p>
        <p>
          Total Bruto:{" "}
          {somaTotalValor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <div className="divliq">
        <p className="liquido">
          Total Líquido:{" "}
          {(somaTotalValor * 0.4).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        </div>
      </div>
    </>
  );
}

export default App;

