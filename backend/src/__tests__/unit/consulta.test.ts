/**
 * Testes unitários para consultas
 */

import { salvarConsulta, buscarConsultasPorCPF, gerarProtocolo, type ConsultaData } from '../../database/bot/consultaDatabase.js';
import { pool } from '../../database/connection.js';

// Mock do pool de conexão
jest.mock('../../database/connection.js', () => ({
  pool: {
    query: jest.fn()
  }
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('Consulta Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('salvarConsulta', () => {
    const consultaData: ConsultaData = {
      id_medico: 1,
      nome_paciente: 'João Silva',
      cpf_paciente: '12345678901',
      data_consulta: '2024-01-15',
      hora_consulta: '09:00',
      protocolo: 'AGD123456789',
      observacoes: 'Consulta de rotina'
    };

    it('deve salvar consulta com sucesso', async () => {
      const mockResult = {
        rows: [{
          id_consulta: 1,
          protocolo: 'AGD123456789'
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      const result = await salvarConsulta(consultaData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult.rows[0]);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tb_consultas'),
        expect.arrayContaining([
          consultaData.id_medico,
          consultaData.nome_paciente,
          consultaData.cpf_paciente,
          consultaData.data_consulta,
          consultaData.hora_consulta,
          consultaData.protocolo,
          consultaData.observacoes
        ])
      );
    });

    it('deve tratar erro ao salvar consulta', async () => {
      mockPool.query.mockRejectedValue(new Error('Erro de conexão'));

      const result = await salvarConsulta(consultaData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Erro de conexão');
    });
  });

  describe('buscarConsultasPorCPF', () => {
    it('deve buscar consultas por CPF com sucesso', async () => {
      const mockConsultas = [{
        id_consulta: 1,
        data_consulta: '2024-01-15',
        hora_consulta: '09:00',
        protocolo: 'AGD123456789',
        status: 'agendada',
        observacoes: 'Consulta de rotina',
        nome_medico: 'Dr. Carlos Silva',
        especialidade: 'Cardiologia'
      }];

      mockPool.query.mockResolvedValue({ rows: mockConsultas });

      const result = await buscarConsultasPorCPF('12345678901');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockConsultas);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['12345678901']
      );
    });

    it('deve retornar array vazio quando não há consultas', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await buscarConsultasPorCPF('99999999999');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('deve tratar erro na busca', async () => {
      mockPool.query.mockRejectedValue(new Error('Erro na consulta'));

      const result = await buscarConsultasPorCPF('12345678901');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Erro na consulta');
    });
  });

  describe('gerarProtocolo', () => {
    it('deve gerar protocolo único', () => {
      const protocolo1 = gerarProtocolo();
      const protocolo2 = gerarProtocolo();

      expect(protocolo1).toMatch(/^AGD\d+$/);
      expect(protocolo2).toMatch(/^AGD\d+$/);
      expect(protocolo1).not.toBe(protocolo2);
    });

    it('deve gerar protocolo com formato correto', () => {
      const protocolo = gerarProtocolo();
      
      expect(protocolo).toMatch(/^AGD\d{16}$/); // AGD + timestamp + 3 dígitos
      expect(protocolo.length).toBeGreaterThan(10);
    });
  });
});