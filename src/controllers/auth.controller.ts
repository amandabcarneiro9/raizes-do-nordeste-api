import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { buscarUsuarioPorEmail } from '../services/usuario.service.js';

export async function login(req: Request, res: Response) {
	try {
		const { email, senha } = req.body;

		if (!email || !senha) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['email e senha são obrigatórios'],
			});
		}

		const usuario = await buscarUsuarioPorEmail(email);

		if (!usuario) {
			return res.status(401).json({
				erro: 'E-mail ou senha inválidos',
			});
		}

		if (!usuario.ativo) {
			return res.status(403).json({
				erro: 'Usuário inativo',
			});
		}

		// Compara a senha informada com o hash armazenado.
		const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

		if (!senhaValida) {
			return res.status(401).json({
				erro: 'E-mail ou senha inválidos',
			});
		}

		const jwtSecret = process.env['JWT_SECRET'];

		if (!jwtSecret) {
			throw new Error('JWT_SECRET não configurado');
		}

		const token = jwt.sign(
			{
				usuarioId: usuario.id,
				perfil: usuario.perfil,
			},
			jwtSecret,
			{
				expiresIn: '1h',
			},
		);

		return res.status(200).json({
			mensagem: 'Login realizado com sucesso',
			token,
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email,
				perfil: usuario.perfil,
			},
		});
	} catch (error) {
		console.error('Erro ao realizar login:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
