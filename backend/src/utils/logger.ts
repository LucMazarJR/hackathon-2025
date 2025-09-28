import express from "express";
import cors from "cors";
import * as routerLog from "../routes/login/routes.js";
import * as routeAdmin from "../routes/admin/routes.js";
import * as routerBot from "../routes/bot/routes.js";
import * as Middleware from "../middleware/middleware.js";
import * as adminController from "../controller/admin/adminController.js";
import * as doctorController from "../controller/admin/doctorController.js";
import * as botController from "../controller/bot/botController.js";
import * as authController from "../controller/auth/authController.js";
import { upload } from "../middleware/upload.js";
import agendamentoRoutes from "../routes/bot/agendamentoRoutes.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

export const connectServer = async (PORT: number) => {
  app.listen(PORT, () => {
    // amazonq-ignore-next-line
    console.log(`Server is running on port ${PORT}`);
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

  // USER LOGIN
  // amazonq-ignore-next-line
  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      let [status, response] = await authController.loginController(email, password);
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      // amazonq-ignore-next-line
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // CHECK EMAIL
  app.post("/auth/check-email", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório" });
    }
    
    try {
      const { checkEmailExists } = await import("../database/auth/userDatabase.js");
      const exists = await checkEmailExists(email);
      return res.status(200).json({ exists });
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // CHECK EMAIL
  // amazonq-ignore-next-line
  app.post("/auth/check-email", async (req, res) => {
    const { email } = req.body;
    try {
      const { checkEmailExists } = await import("../database/auth/emailCheck.js");
      const result = await checkEmailExists(email);
      return res.status(200).json(result);
    // amazonq-ignore-next-line
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // USER REGISTER
  app.post("/auth/register", async (req, res) => {
    const { name, email, cpf, password, confirmPassword } = req.body;
    try {
      let [status, response] = await authController.registerController(
        name, email, cpf, password, confirmPassword
      );
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ROTA DE TESTE DO BOT
  app.get("/bot/test", async (req, res) => {
    try {
      return res.status(200).json({ 
        message: "Bot está funcionando", 
        openai_key_configured: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro no teste do bot:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ROTA BOT
  app.post(routerBot.bot, async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;
    
    console.log("Rota bot recebeu:", { message, id });
    
    try {
      let [status, messageBot] = await botController.messageBotController(
        message,
        id
      );
      console.log("Rota bot retornando:", { status, messageBot });
      return res.status(status).json({ message: messageBot });
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ROTA BOT DOCUMENT UPLOAD
  app.post(routerBot.botDocument, upload.single('document'), async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
    }

    try {
      let [status, messageBot] = await botController.documentUploadController(
        file,
        message,
        id
      );
      return res.status(status).json({ message: messageBot });
    } catch (error) {
      console.error("Erro ao processar documento:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    // amazonq-ignore-next-line
    }
  });

  // ROTAS DE AGENDAMENTO
  app.use(routerBot.agendamento, agendamentoRoutes);

  // GET Context
  app.get("/admin/context", async (req, res) => {
    try {
      const { getCurrentContext } = await import("../database/admin/contextDatabase.js");
      const context = await getCurrentContext();
      
      if (context) {
        return res.status(200).json({ 
          name: context.name, 
          instructions: context.instructions 
        });
      // amazonq-ignore-next-line
      } else {
        return res.status(200).json({ 
          name: "MedBot - Assistente de Saúde", 
          instructions: "Você é um assistente virtual especializado em saúde e atendimento ao cliente. Ajude com agendamentos, informações médicas e suporte geral. Seja sempre educado, empático e profissional." 
        });
      }
    // amazonq-ignore-next-line
    } catch (error) {
      console.error("Erro ao buscar contexto:", error);
      return res.status(200).json({ 
        name: "MedBot - Assistente de Saúde", 
        instructions: "Você é um assistente virtual especializado em saúde e atendimento ao cliente. Ajude com agendamentos, informações médicas e suporte geral. Seja sempre educado, empático e profissional." 
      });
    }
  });

  // POST Context
  app.post("/admin/context", async (req, res) => {
    const { context } = req.body;
    try {
      let [status, response] = await adminController.adminContextController(
        context
      );
      return res.status(status).json({ message: response });
    } catch (error) {
      console.error("Erro ao processar contexto do administrador:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // CONSULTAS API
  app.get("/api/consultas/paciente/:cpf", async (req, res) => {
    const { cpf } = req.params;
    try {
      const { buscarConsultasPorCPF } = await import("../database/bot/consultaDatabase.js");
      const result = await buscarConsultasPorCPF(cpf);
      
      if (result.success) {
        return res.status(200).json({ consultas: result.data });
      } else {
        return res.status(500).json({ message: result.error });
      }
    } catch (error) {
      console.error("Erro ao buscar consultas do paciente:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/consultas/medico/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { buscarConsultasPorMedico } = await import("../database/bot/consultaDatabase.js");
      const result = await buscarConsultasPorMedico(parseInt(id));
      
      if (result.success) {
        return res.status(200).json({ consultas: result.data });
      } else {
        return res.status(500).json({ message: result.error });
      }
    } catch (error) {
      console.error("Erro ao buscar consultas do médico:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/consultas/todas", async (req, res) => {
    try {
      const { pool } = await import("../database/connection.js");
      
      const query = `
        SELECT 
          c.id_consulta,
          c.nome_paciente,
          c.data_consulta,
          c.hora_consulta,
          c.protocolo,
          c.status,
          c.observacoes,
          CONCAT(m.nome, ' ', m.sobrenome) as nome_medico,
          e.nome_especializacao as especialidade
        FROM tb_consultas c
        LEFT JOIN tb_medicos m ON c.id_medico = m.id_medico
        LEFT JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
        ORDER BY c.data_consulta DESC, c.hora_consulta DESC
      `;
      
      const result = await pool.query(query);
      return res.status(200).json({ consultas: result.rows });
    } catch (error) {
      console.error("Erro ao buscar todas as consultas:", error);
      // Fallback para dados de exemplo se o banco falhar
      const consultasExemplo = [
        {
          id_consulta: 1,
          data_consulta: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
          hora_consulta: '08:00',
          protocolo: 'AGD001',
          status: 'agendada',
          nome_paciente: 'José Silva',
          nome_medico: 'Dr. Carlos Silva',
          especialidade: 'Cardiologia',
          observacoes: 'Consulta de rotina'
        }
      ];
      return res.status(200).json({ consultas: consultasExemplo });
    }
  });

  // FINALIZAR CONSULTA
  app.put("/api/consultas/:id/finalizar", async (req, res) => {
    const { id } = req.params;
    const { observacoes } = req.body;
    
    try {
      const { pool } = await import("../database/connection.js");
      
      const query = `
        UPDATE tb_consultas 
        SET status = 'concluida', observacoes = COALESCE($2, observacoes)
        WHERE id_consulta = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, observacoes]);
      
      if (result.rows.length > 0) {
        return res.status(200).json({ 
          message: "Consulta finalizada com sucesso",
          consulta: result.rows[0]
        });
      } else {
        return res.status(404).json({ message: "Consulta não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao finalizar consulta:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // LISTAR MÉDICOS DISPONÍVEIS
  app.get("/api/medicos", async (req, res) => {
    try {
      const { buscarTodosMedicos } = await import("../database/bot/medicosDatabase.js");
      const result = await buscarTodosMedicos();
      
      if (result.success) {
        return res.status(200).json({ medicos: result.data });
      } else {
        return res.status(500).json({ message: result.error });
      }
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/medicos/especialidade/:especialidade", async (req, res) => {
    const { especialidade } = req.params;
    try {
      const { buscarMedicosPorEspecialidadeDB } = await import("../database/bot/medicosDatabase.js");
      const result = await buscarMedicosPorEspecialidadeDB(especialidade);
      
      if (result.success) {
        return res.status(200).json({ medicos: result.data });
      } else {
        return res.status(500).json({ message: result.error });
      }
    } catch (error) {
      console.error("Erro ao buscar médicos por especialidade:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // DOCTORS CRUD
  app.get("/admin/doctors", async (req, res) => {
    try {
      let [status, response] = await doctorController.getDoctorsController();
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/admin/doctors", async (req, res) => {
    const { nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento } = req.body;
    try {
      let [status, response] = await doctorController.createDoctorController(
        nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento
      );
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao criar médico:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/admin/doctors/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento } = req.body;
    try {
      let [status, response] = await doctorController.updateDoctorController(
        parseInt(id), nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento
      );
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao atualizar médico:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/admin/doctors/:id", async (req, res) => {
    const { id } = req.params;
    try {
      let [status, response] = await doctorController.deleteDoctorController(
        parseInt(id)
      );
      return res.status(status).json(response);
    } catch (error) {
      console.error("Erro ao remover médico:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
};
