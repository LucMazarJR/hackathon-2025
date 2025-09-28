import * as DB from "../../config/poll.js"


export let getProtocolo = async (nome:string):Promise<any> =>{
    nome = nome.toUpperCase()
    // let result = await DB.pool.query("SELECT * FROM public.tb_procedimentos;", ['nome_procedimento'])
    let result = await DB.pool.query("SELECT nome_procedimento, tipo FROM tb_procedimentos WHERE nome_procedimento = $1", [nome])

    return result
}

console.log(await getProtocolo("IMPLANTE COCLEAR (COM DIRETRIZ DE UTILIZAÇÃO)"))