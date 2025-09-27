import JWT from "jsonwebtoken";

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
