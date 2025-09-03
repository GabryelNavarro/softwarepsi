import React, { useEffect } from "react";
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
  planoCov,
  setPlanoCov,
  tempo_atendimento,
  setTempo_atendimento,
  loading,
  handleSubmit
}) {
  // Mapa de valores por plano
  const valoresPlano = {
    CNU: 26.40,
    Amil: 40.0,
    BlueSaude: 45.0,
    CarePlus: 50.0,
    DoutorDeTodos: 50.0,
    Intermedica: 30.0,
    IntermedicaBioSaude: 28.83,
    Metrus: 60.0,
    SeguroUnimed: 27.0,
    Sepaco: 25.0,
    Vivest: 63.37,
  };

  // Atualiza valor_paciente quando o plano muda
  useEffect(() => {
    if (planoCov && valoresPlano.hasOwnProperty(planoCov)) {
      setValor_paciente(
        valoresPlano[planoCov].toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      );
    } else {
      setValor_paciente("");
    }
  }, [planoCov]);

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Finanças</h2>

      <input
        className="paciente"
        type="text"
        placeholder="Nome paciente"
        value={nome}
        onChange={(e) => setNome(e.target.value.toUpperCase())}
        required
      />

      <select
        className="plano-cov"
        value={planoCov}
        onChange={(e) => setPlanoCov(e.target.value)}
        required
      >
        <option value="">Selecione o plano</option>
        <option value="CNU">C N Unimed</option>
        <option value="Amil">AMIL</option>
        <option value="BlueSaude">Blue Saude</option>
        <option value="CarePlus">Care Plus</option>
        <option value="DoutorDeTodos">Doutor de Todos</option>
        <option value="Intermedica">Intermedica</option>
        <option value="IntermedicaBioSaude">Intermedica (Bio Saúde)</option>
        <option value="Metrus">Metrus (Bio Saúde)</option>
        <option value="SeguroUnimed">Seguro Unimed</option>
        <option value="Sepaco">Sepaco</option>
        <option value="Vivest">Vivest</option>
      </select>

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
        readOnly
      />

      <input
        className="time"
        type="number"
        placeholder="Tempo de Atendimento (minutos)"
        value={tempo_atendimento}
        onChange={(e) => setTempo_atendimento(e.target.value)}
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