import express from "express";
import cors from "cors";
import * as routerLog from "../routes/login/routes.js";
import * as Middleware from "../middleware/middleware.js";
import * as adminController from "../controller/admin/adminController.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

export const connectServer = async (PORT: number) => {
  app.listen(PORT, () => {
    console.log("Server is running on port 3333");
  });

  // ROTA LOGIN
  // ADMIN
  app.post(routerLog.loginAdmin, Middleware.authLogAdmin, async (req, res) => {
    const { email, password } = req.body;
    // Lógica de autenticação do administrador

    try {
      let [status, message] = await adminController.loginAdmin(email, password);
      return res.status(status).json({ message });
    } catch (error) {
      console.error("Erro ao autenticar administrador:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // DOCTOR
  app.post(
    routerLog.loginDoctor,
    Middleware.authLogDoctor,
    async (req, res) => {}
  );

  // USER
  app.post(routerLog.loginUser, Middleware.authLogUser, async (req, res) => {});
};
