import JWT from "jsonwebtoken";

/**
 * Middleware de autenticação para Administradores.
 * 
 * - Verifica se o cabeçalho `Authorization` existe.
 * - Extrai o token JWT do header.
 * - Valida o token usando a chave secreta `TOKEN_ADM`.
 * - Se válido, adiciona o `payload` ao objeto `req.user`.
 * - Caso contrário, retorna erro de autenticação/autorização.
 *
 * @async
 * @function authLogAdmin
 * @param {any} req - Objeto de requisição Express.
 * @param {any} res - Objeto de resposta Express.
 * @param {any} next - Função de próximo middleware.
 * @returns {Promise<void>}
 */
export const authLogAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Não autorizado!" });

  const token = authHeader.split(" ")[1];
  const secretADM = process.env.TOKEN_ADM as string;

  try {
    const payload = JWT.verify(token, secretADM);
    req.user = payload;
    console.log("Payload decodificado:");
    next();
  } catch (error) {
    console.error("Erro JWT:", error);
    res.status(403).json({ msg: "Token inválido!" });
  }
};

/**
 * Middleware de autenticação para Médicos.
 * (Atualmente usa a mesma chave secreta `TOKEN_ADM` do Admin).
 *
 * @async
 * @function authLogDoctor
 * @param {any} req - Objeto de requisição Express.
 * @param {any} res - Objeto de resposta Express.
 * @param {any} next - Função de próximo middleware.
 * @returns {Promise<void>}
 */
export const authLogDoctor = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Não autorizado!" });

  const token = authHeader.split(" ")[1];
  const secretADM = process.env.TOKEN_ADM as string;

  try {
    const payload = JWT.verify(token, secretADM);
    req.user = payload;
    console.log("Payload decodificado:");
    next();
  } catch (error) {
    console.error("Erro JWT:", error);
    res.status(403).json({ msg: "Token inválido!" });
  }
};

/**
 * Middleware de autenticação para Usuários comuns.
 * (Atualmente usa a mesma chave secreta `TOKEN_ADM` do Admin).
 *
 * @async
 * @function authLogUser
 * @param {any} req - Objeto de requisição Express.
 * @param {any} res - Objeto de resposta Express.
 * @param {any} next - Função de próximo middleware.
 * @returns {Promise<void>}
 */
export const authLogUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Não autorizado!" });

  const token = authHeader.split(" ")[1];
  const secretADM = process.env.TOKEN_ADM as string;

  try {
    const payload = JWT.verify(token, secretADM);
    req.user = payload;
    console.log("Payload decodificado:");
    next();
  } catch (error) {
    console.error("Erro JWT:", error);
    res.status(403).json({ msg: "Token inválido!" });
  }
};
