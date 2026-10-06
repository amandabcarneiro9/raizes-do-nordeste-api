import { Router } from 'express';

import { getProdutos, postProduto } from '../controllers/produto.controller.js';

import { autenticar, autorizar } from '../middlewares/auth.middleware.js';

const produtoRouter = Router();

/**
 * @openapi
 * /produtos:
 *   get:
 *     summary: Lista os produtos
 *     description: Retorna todos os produtos cadastrados.
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
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
 *                   descricao:
 *                     type: string
 *                     nullable: true
 *                   preco:
 *                     type: string
 *                     example: "12.5"
 *                   ativo:
 *                     type: boolean
 *       500:
 *         description: Erro interno do servidor.
 *
 *   post:
 *     summary: Cadastra um produto
 *     description: Cria um novo produto no sistema.
 *     tags:
 *       - Produtos
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
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Cuscuz Nordestino
 *               descricao:
 *                 type: string
 *                 example: Cuscuz tradicional de milho
 *               preco:
 *                 type: number
 *                 format: double
 *                 example: 12.50
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "0538642f-8682-42d6-a2ac-4ed75d221dc1"
 *               nome: "Cuscuz Nordestino"
 *               descricao: "Cuscuz tradicional de milho"
 *               preco: "12.5"
 *               ativo: true
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               erro: "Campos obrigatórios não informados"
 *               detalhes:
 *                 - "nome e preco são obrigatórios"
 *       401:
 *         description: Token não informado, inválido ou expirado.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Token não informado"
 *       403:
 *         description: Usuário autenticado sem permissão para esta operação.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Acesso não autorizado"
 *       500:
 *         description: Erro interno do servidor.
 */

produtoRouter.get('/', getProdutos);

produtoRouter.post('/', autenticar, autorizar('ADMIN'), postProduto);

export default produtoRouter;
