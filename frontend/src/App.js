import { useState } from "react";
import Header from "./components/Header/header";
import Formulario from "./components/Formulario/span";

function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [data, setData] = useState("");
  const [cid, setCid] = useState("");
  const [valor_paciente, setValor_paciente] = useState("");
  const [tempo_atendimento, settempo_atendimento] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log para verificar se todos os dados estão corretos antes de enviar
    console.log("📤 Enviando para backend:", {
      nome_paciente: nome,
      idade_paciente: idade,
      data_atendimento: data,
      cid_paciente: cid,
      valor_paciente: valor_paciente,
      tempo_atendimento: tempo_atendimento
    });

    try {
      const response = await fetch("https://softwarepsi.vercel.app/paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_paciente: nome,
          idade_paciente: idade,
          data_atendimento: data,
          cid_paciente: cid,
          valor_paciente: valor_paciente,
          tempo_atendimento: tempo_atendimento
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const dataResponse = await response.json();
      console.log("✅ Resposta do backend:", dataResponse);
      alert("Paciente cadastrado com sucesso!");

      // limpa o formulário
      setNome("");
      setIdade("");
      setData("");
      setCid("");
      setValor_paciente("");
      settempo_atendimento("");
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      alert("Falha ao cadastrar paciente");
    } finally {
      setLoading(false);
    }
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
        tempo_atendimento={tempo_atendimento}
        settempo_atendimento={settempo_atendimento}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default App;