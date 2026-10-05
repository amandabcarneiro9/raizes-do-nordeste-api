import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { buscarUsuarioPorEmail, criarUsuario } from '../services/usuario.service.js';

const perfisValidos = ['ADMIN', 'ATENDENTE'];

export async function postUsuario(req: Request, res: Response) {
	try {
		const { nome, email, senha, perfil } = req.body;

		if (!nome || !email || !senha || !perfil) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['nome, email, senha e perfil são obrigatórios'],
			});
		}

		if (!perfisValidos.includes(perfil)) {
			return res.status(400).json({
				erro: 'Perfil inválido',
				detalhes: ['perfil deve ser ADMIN ou ATENDENTE'],
			});
		}

		const usuarioExistente = await buscarUsuarioPorEmail(email);

		if (usuarioExistente) {
			return res.status(409).json({
				erro: 'E-mail já cadastrado',
			});
		}

		const senhaHash = await bcrypt.hash(senha, 10);

		const usuario = await criarUsuario({
			nome,
			email,
			senhaHash,
			perfil,
		});

		return res.status(201).json({
			mensagem: 'Usuário criado com sucesso',
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email,
				perfil: usuario.perfil,
				ativo: usuario.ativo,
			},
		});
	} catch (error) {
		console.error('Erro ao criar usuário:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
