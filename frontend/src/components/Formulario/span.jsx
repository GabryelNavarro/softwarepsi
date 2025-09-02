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
  palnoCov,
  setPalnoCov,
  tempo_atendimento,
  settempo_atendimento,
  loading,
  handleSubmit
}) {
  // Mapa de valores por plano
  const valoresPlano = {
    cnu: 26.40,
    amil: 40.0,
    bluesaude: 45.0,
    careplus: 50.0,
    dtts: 50.0,
    iter:30,
    iter_b: 28.83,
    metrus: 60.0,
    seguro_u: 27.0,
    sepaco: 25.0,
    vivest: 63.37,




  };

  // Atualiza valor_paciente quando o plano muda
  useEffect(() => {
    if (palnoCov && valoresPlano.hasOwnProperty(palnoCov)) {
      setValor_paciente(
        valoresPlano[palnoCov].toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      );
    } else {
      setValor_paciente("");
    }
  }, [palnoCov]);

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

      <select
        className="plano-cov"
        value={palnoCov}
        onChange={(e) => setPalnoCov(e.target.value)}
        required
      >
        <option value="">Selecione o plano</option>
        <option value="cnu">C N Unimed</option>
        <option value="amil">AMIL</option>
        <option value="bluesaude">Blue Saude</option>
        <option value="careplus">Care Plus</option>
        <option value="dtts">Doutor de Todos</option>
        <option value="iter">Intermedica</option>
        <option value="iter_b">Intermedica (Bio Saúde)</option>
         <option value="metrus">Metrus (Bio Saúde)</option>
          <option value="seguro_u">Seguro Unimed</option>
          <option value="sepaco">Sepaco</option>
          <option value="vivest">Vivest</option>
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

      {/* Campo de valor apenas para visualização */}
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