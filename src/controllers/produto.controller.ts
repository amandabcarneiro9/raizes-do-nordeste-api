import type { Request, Response } from 'express';
import { listarProdutos, criarProduto } from '../services/produto.service.js';

export async function getProdutos(req: Request, res: Response) {
	try {
		const produtos = await listarProdutos();

		return res.status(200).json(produtos);
	} catch (error) {
		console.error('Erro ao listar produtos:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}

// validar a requisição antes de mandar os dados para o service.
export async function postProduto(req: Request, res: Response) {
	try {
		const { nome, descricao, preco } = req.body;

		if (!nome || preco === undefined) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['nome e preco são obrigatórios'],
			});
		}

		if (typeof preco !== 'number' || preco <= 0) {
			return res.status(400).json({
				erro: 'Campo inválido',
				detalhes: ['preco deve ser um número maior que zero'],
			});
		}

		const produto = await criarProduto({
			nome,
			descricao,
			preco,
		});

		return res.status(201).json(produto);
	} catch (error) {
		console.error('Erro ao criar produto:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
