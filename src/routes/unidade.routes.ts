import { Router } from 'express';
import { getUnidades, postUnidade } from '../controllers/unidade.controller.js';
import { autenticar, autorizar } from '../middlewares/auth.middleware.js';

const unidadeRouter = Router();

/**
 * @openapi
 * /unidades:
 *   get:
 *     summary: Lista as unidades
 *     description: Retorna todas as unidades cadastradas.
 *     tags:
 *       - Unidades
 *     responses:
 *       200:
 *         description: Lista de unidades retornada com sucesso.
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
 *                   nome:
 *                     type: string
 *                   endereco:
 *                     type: string
 *                     nullable: true
 *                   ativo:
 *                     type: boolean
 *       500:
 *         description: Erro interno do servidor.
 *
 *   post:
 *     summary: Cadastra uma unidade
 *     description: Cria uma nova unidade no sistema.
 *     tags:
 *       - Unidades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Unidade Centro
 *               endereco:
 *                 type: string
 *                 example: Rua Principal, 100
 *     responses:
 *       201:
 *         description: Unidade criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: "Unidade Centro"
 *               endereco: "Rua Principal, 100"
 *               ativo: true
 *       400:
 *         description: Dados obrigatórios não informados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               erro: "Campos obrigatórios não informados"
 *               detalhes:
 *                 - "nome é obrigatório"
 *       500:
 *         description: Erro interno do servidor.
 *       401:
 *         description: Token não informado, inválido ou expirado.
 *       403:
 *         description: Usuário autenticado sem permissão para esta operação.
 */

unidadeRouter.get('/', getUnidades);
unidadeRouter.post('/', autenticar, autorizar('ADMIN'), postUnidade);

export default unidadeRouter;
