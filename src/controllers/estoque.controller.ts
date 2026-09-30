import type { Request, Response } from 'express';
import {
	listarEstoques,
	buscarUnidadePorId,
	buscarProdutoPorId,
	criarEstoque,
	buscarEstoque,
} from '../services/estoque.service.js';

export async function getEstoques(req: Request, res: Response) {
	try {
		const estoques = await listarEstoques();

		return res.status(200).json(estoques);
	} catch (error) {
		console.error('Erro ao listar estoques:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}

export async function postEstoque(req: Request, res: Response) {
	try {
		const { unidadeId, produtoId, quantidade } = req.body;

		if (!unidadeId || !produtoId || quantidade === undefined) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['unidadeId, produtoId e quantidade são obrigatórios'],
			});
		}

		if (!Number.isInteger(quantidade) || quantidade < 0) {
			return res.status(400).json({
				erro: 'Campo inválido',
				detalhes: ['quantidade deve ser um número inteiro maior ou igual a zero'],
			});
		}

		const unidade = await buscarUnidadePorId(unidadeId);

		if (!unidade) {
			return res.status(404).json({
				erro: 'Unidade não encontrada',
			});
		}

		const produto = await buscarProdutoPorId(produtoId);

		if (!produto) {
			return res.status(404).json({
				erro: 'Produto não encontrado',
			});
		}

		const estoqueExistente = await buscarEstoque(unidadeId, produtoId);

		if (estoqueExistente) {
			return res.status(409).json({
				erro: 'Estoque já cadastrado',
				detalhes: ['Já existe estoque para este produto nesta unidade'],
			});
		}

		const estoque = await criarEstoque({
			unidadeId,
			produtoId,
			quantidade,
		});

		return res.status(201).json(estoque);
	} catch (error) {
		console.error('Erro ao criar estoque:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
