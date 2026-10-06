import { Router } from 'express';

import { postUsuario } from '../controllers/usuario.controller.js';
import { autenticar, autorizar } from '../middlewares/auth.middleware.js';

const usuarioRouter = Router();

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Cria um novo usuário no sistema. A operação é permitida apenas para usuários com perfil ADMIN.
 *     tags:
 *       - Usuários
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
 *               - email
 *               - senha
 *               - perfil
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Atendente
 *               email:
 *                 type: string
 *                 format: email
 *                 example: atendente@raizes.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Atendente123!
 *               perfil:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - ATENDENTE
 *                 example: ATENDENTE
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos.
 *       401:
 *         description: Token não informado, inválido ou expirado.
 *       403:
 *         description: Usuário autenticado sem permissão.
 *       409:
 *         description: Já existe um usuário com o email informado.
 *       500:
 *         description: Erro interno do servidor.
 */

usuarioRouter.post('/', autenticar, autorizar('ADMIN'), postUsuario);

export default usuarioRouter;
