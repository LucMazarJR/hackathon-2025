import * as DB from "../../config/poll.js"


export let getProtocolo = async ():Promise<any> =>{
    let result = await DB.pool.query("SELECT nome_procedimento, tipo FROM tb_procedimentos")

    return result.rows[0].tipo
}
