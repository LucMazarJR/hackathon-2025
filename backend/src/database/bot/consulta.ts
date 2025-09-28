import * as DB from "../../config/poll.js"

// Mock de dados de procedimentos
const procedimentosMock = [
  { nome_procedimento: "Angioplastia transluminal percutânea", tipo: "Com protocolo" },
  { nome_procedimento: "Ressonância magnética", tipo: "Sem protocolo" },
  { nome_procedimento: "Tomografia computadorizada", tipo: "Com ou sem protocolo" }
];

export let getProtocolo = async (nome?: string): Promise<any> => {
  try {
    // Tenta buscar no banco primeiro
    let result = await DB.pool.query("SELECT nome_procedimento, tipo FROM tb_procedimentos");
    return result.rows;
  } catch (error) {
    console.log("Usando dados mock para procedimentos (banco indisponível)");
    // Se falhar, usa dados mock
    if (nome) {
      const procedimento = procedimentosMock.find(p => 
        p.nome_procedimento.toLowerCase().includes(nome.toLowerCase())
      );
      return procedimento ? [procedimento] : [];
    }
    return procedimentosMock;
  }
}
