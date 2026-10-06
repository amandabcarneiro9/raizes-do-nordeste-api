import { Router } from 'express';

import { login } from '../controllers/auth.controller.js';

const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@raizes.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Admin123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       400:
 *         description: Email ou senha não informados.
 *       401:
 *         description: Email ou senha inválidos.
 *       403:
 *         description: Usuário inativo.
 *       500:
 *         description: Erro interno do servidor.
 */

authRouter.post('/login', login);

export default authRouter;
