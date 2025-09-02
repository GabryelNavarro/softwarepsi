import React from "react";
import "../Formulario/form.css";

function Formulario({
  nome,
  setNome,
  idade,
  setIdade,
  data,
  setData,
  valor_paciente,
  setValor_paciente,
  cid,
  setCid,
  tempo_atendimento,
  settempo_atendimento,
  loading,
  handleSubmit
}) {
  // Função para formatar como moeda brasileira
  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, ""); // Remove tudo que não é número
    const floatValue = parseFloat(numericValue) / 100;
    if (isNaN(floatValue)) {
      setValor_paciente("");
      return "";
    }
    return floatValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Prontuário</h2>

      <input
        className="paciente"
        type="text"
        placeholder="Nome paciente"
        value={nome}
        onChange={(e) => setNome(e.target.value.toUpperCase())}
        required
      />

      <input
        className="idade"
        type="number"
        placeholder="Idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />

      <input
        className="data"
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />

      <input
        className="cid"
        type="text"
        placeholder="CID"
        value={cid}
        onChange={(e) => setCid(e.target.value.toUpperCase())}
        required
      />

      <input
        className="money"
        type="text"
        placeholder="R$"
        value={valor_paciente}
        onChange={(e) => setValor_paciente(formatCurrency(e.target.value))}
        required
      />

      <input
        className="time"
        type="number"
        placeholder="Tempo de Atendimento (minutos)"
        value={tempo_atendimento}
        onChange={(e) => settempo_atendimento(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="botao_enviar"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}

export default Formulario;