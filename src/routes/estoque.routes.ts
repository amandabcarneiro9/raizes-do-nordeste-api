import { Router } from 'express';
import { getEstoques, postEstoque } from '../controllers/estoque.controller.js';

const estoqueRouter = Router();

/**
 * @openapi
 * /estoque:
 *   get:
 *     summary: Lista os estoques
 *     description: Retorna os registros de estoque das unidades.
 *     tags:
 *       - Estoque
 *     responses:
 *       200:
 *         description: Estoques retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   unidadeId:
 *                     type: string
 *                     format: uuid
 *                   produtoId:
 *                     type: string
 *                     format: uuid
 *                   quantidade:
 *                     type: integer
 *                   atualizadoEm:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor.
 *
 *   post:
 *     summary: Cadastra um estoque
 *     description: Cria um registro de estoque para um produto em uma unidade.
 *     tags:
 *       - Estoque
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidadeId
 *               - produtoId
 *               - quantidade
 *             properties:
 *               unidadeId:
 *                 type: string
 *                 format: uuid
 *               produtoId:
 *                 type: string
 *                 format: uuid
 *               quantidade:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *     responses:
 *       201:
 *         description: Estoque criado com sucesso.
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos.
 *       404:
 *         description: Produto ou unidade não encontrado.
 *       409:
 *         description: Já existe estoque para este produto nesta unidade.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               erro: "Estoque já cadastrado"
 *               detalhes:
 *                 - "Já existe estoque para este produto nesta unidade"
 *       500:
 *         description: Erro interno do servidor.
 */

estoqueRouter.get('/', getEstoques);
estoqueRouter.post('/', postEstoque);

export default estoqueRouter;
