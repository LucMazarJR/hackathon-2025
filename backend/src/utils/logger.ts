import express from "express";
import cors from "cors";
import * as routerLog from "../routes/login/routes.js";
import * as routeAdmin from "../routes/admin/routes.js";
import * as routerBot from "../routes/bot/routes.js";
import * as Middleware from "../middleware/middleware.js";
import * as adminController from "../controller/admin/adminController.js";
import * as botController from "../controller/bot/botController.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

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

  // ROTA BOT
  app.post(routerBot.bot, async (req, res) => {
    const { message } = req.body;
    const id = req.body.id;
    try {
      let [status, messageBot] = await botController.messageBotController(
        message
      );
      return res.status(status).json({ message: messageBot });
    } catch (error) {
      console.error("Erro ao autenticar administrador:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post(
    routeAdmin.adminContext,
    async (req, res) => {
      const { context } = req.body;
      try {
        let [status, message] = await adminController.adminContextController(
          context
        );
        return res.status(status).json({ message });
      } catch (error) {
        console.error("Erro ao processar contexto do administrador:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  );
};
