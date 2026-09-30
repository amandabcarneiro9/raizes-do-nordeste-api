import type { Request, Response } from 'express';
import { listarUnidades, criarUnidade } from '../services/unidade.service.js';

export async function getUnidades(req: Request, res: Response) {
	try {
		const unidades = await listarUnidades();

		return res.status(200).json(unidades);
	} catch (error) {
		console.error('Erro ao listar unidades:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}

export async function postUnidade(req: Request, res: Response) {
	try {
		const { nome, endereco } = req.body;

		if (!nome) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['nome é obrigatório'],
			});
		}

		const unidade = await criarUnidade({
			nome,
			endereco,
		});

		return res.status(201).json(unidade);
	} catch (error) {
		console.error('Erro ao criar unidade:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
