import { Router } from 'express';
import { postPagamento } from '../controllers/pagamento.controller.js';

const pagamentoRouter = Router();

/**
 * @openapi
 * /pagamentos:
 *   post:
 *     summary: Processa um pagamento simulado
 *     description: Simula o processamento do pagamento e, quando aprovado, atualiza o status do pedido para PAGO.
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedidoId
 *               - metodo
 *               - resultadoSimulado
 *             properties:
 *               pedidoId:
 *                 type: string
 *                 format: uuid
 *                 example: "5a5ae03a-ad14-4c11-8dfb-7a40bb84c50f"
 *               metodo:
 *                 type: string
 *                 example: "CARTAO"
 *               resultadoSimulado:
 *                 type: string
 *                 enum:
 *                   - APROVADO
 *                   - NEGADO
 *                 example: APROVADO
 *     responses:
 *       201:
 *         description: Pagamento processado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: "Pagamento aprovado"
 *               pagamento:
 *                 pedidoId: "5a5ae03a-ad14-4c11-8dfb-7a40bb84c50f"
 *                 metodo: "CARTAO"
 *                 status: "APROVADO"
 *                 valor: "12.5"
 *                 transacaoId: "550e8400-e29b-41d4-a716-446655440000"
 *                 mensagem: "Pagamento aprovado"
 *       400:
 *         description: Dados do pagamento ausentes ou inválidos.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Resultado de pagamento inválido"
 *               detalhes:
 *                 - "resultadoSimulado deve ser APROVADO ou NEGADO"
 *       404:
 *         description: Pedido não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Pedido não encontrado"
 *       500:
 *         description: Erro interno do servidor.
 */
pagamentoRouter.post('/', postPagamento);

export default pagamentoRouter;
