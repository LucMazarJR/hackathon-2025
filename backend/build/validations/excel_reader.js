import XLSX from "xlsx";
function lerExcel(arquivo, planilha = 0) {
    const workbook = XLSX.readFile(arquivo);
    const sheetName = workbook.SheetNames[planilha];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}
function obterValor(dados, linha, coluna) {
    const colunas = Object.keys(dados[0]);
    return dados[linha][colunas[coluna]];
}
function obterColuna(dados, nomeColuna) {
    return dados.map((linha) => linha[nomeColuna]);
}
function obterProcedimentoTipo(dados) {
    return dados.map((linha) => ({
        procedimento: linha['PROCEDIMENTO'],
        tipo: linha['TIPO']
    }));
}
// Função para processar arquivo Excel e obter procedimentos e tipos
function processarExcel(caminhoArquivo) {
    const dados = lerExcel(caminhoArquivo);
    const procedimentos = obterColuna(dados, 'PROCEDIMENTO');
    const tipos = obterColuna(dados, 'TIPO');
    const procedimentoTipo = obterProcedimentoTipo(dados);
    return { procedimentos, tipos, procedimentoTipo, dados };
}
export { lerExcel, obterValor, obterColuna, obterProcedimentoTipo, processarExcel };
// Exemplo de uso:
// const resultado = processarExcel('caminho/para/dados.xlsx');
// console.log('Procedimentos e Tipos:', resultado.procedimentoTipo);
