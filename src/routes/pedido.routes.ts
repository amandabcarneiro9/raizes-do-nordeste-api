import { Router } from 'express';
import { postPedido } from '../controllers/pedido.controller.js';

const pedidoRouter = Router();

/**
 * @openapi
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     description: Valida os itens, calcula o valor total, cria o pedido e atualiza o estoque.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidadeId
 *               - canalPedido
 *               - itens
 *             properties:
 *               unidadeId:
 *                 type: string
 *                 format: uuid
 *                 example: "e06836f5-d0f1-42ae-a77c-d79336b717c3"
 *               canalPedido:
 *                 type: string
 *                 enum:
 *                   - APP
 *                   - TOTEM
 *                   - BALCAO
 *                   - PICKUP
 *                   - WEB
 *                 example: APP
 *               itens:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - produtoId
 *                     - quantidade
 *                   properties:
 *                     produtoId:
 *                       type: string
 *                       format: uuid
 *                       example: "0538642f-8682-42d6-a2ac-4ed75d221dc1"
 *                     quantidade:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: "Pedido criado com sucesso"
 *               pedido:
 *                 id: "58218539-7353-4a2b-802e-ae37157bc747"
 *                 clienteId: null
 *                 unidadeId: "e06836f5-d0f1-42ae-a77c-d79336b717c3"
 *                 canalPedido: "APP"
 *                 status: "CRIADO"
 *                 valorTotal: "25"
 *       400:
 *         description: Dados do pedido ausentes ou inválidos.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Canal de pedido inválido"
 *               detalhes:
 *                 - "canalPedido deve ser APP, TOTEM, BALCAO, PICKUP ou WEB"
 *       404:
 *         description: Unidade ou produto não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Produto não encontrado"
 *       409:
 *         description: Produto sem estoque ou com quantidade insuficiente.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Estoque insuficiente"
 *               detalhes:
 *                 - "Quantidade disponível: 48"
 *       500:
 *         description: Erro interno do servidor.
 */

pedidoRouter.post('/', postPedido);

export default pedidoRouter;
