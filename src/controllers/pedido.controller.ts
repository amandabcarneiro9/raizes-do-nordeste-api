import type { Request, Response } from 'express';
import {
	buscarUnidadePedido,
	buscarProdutoPedido,
	buscarEstoquePedido,
} from '../services/pedido.service.js';

const canaisValidos = ['APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB'];

export async function postPedido(req: Request, res: Response) {
	try {
		const { unidadeId, canalPedido, itens } = req.body;

		if (!unidadeId || !canalPedido || !itens) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['unidadeId, canalPedido e itens são obrigatórios'],
			});
		}

		if (!canaisValidos.includes(canalPedido)) {
			return res.status(400).json({
				erro: 'Canal de pedido inválido',
				detalhes: ['canalPedido deve ser APP, TOTEM, BALCAO, PICKUP ou WEB'],
			});
		}

		if (!Array.isArray(itens) || itens.length === 0) {
			return res.status(400).json({
				erro: 'Itens inválidos',
				detalhes: ['O pedido deve possuir pelo menos um item'],
			});
		}

		// Valida a unidade, os produtos e a disponibilidade de estoque antes de criar o pedido.

		const unidade = await buscarUnidadePedido(unidadeId);

		if (!unidade) {
			return res.status(404).json({
				erro: 'Unidade não encontrada',
			});
		}

		for (const item of itens) {
			if (!item.produtoId || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
				return res.status(400).json({
					erro: 'Item inválido',
					detalhes: ['Cada item deve possuir produtoId e quantidade inteira maior que zero'],
				});
			}

			const produto = await buscarProdutoPedido(item.produtoId);

			if (!produto) {
				return res.status(404).json({
					erro: 'Produto não encontrado',
				});
			}

			if (!produto.ativo) {
				return res.status(400).json({
					erro: 'Produto indisponível',
				});
			}

			const estoque = await buscarEstoquePedido(unidadeId, item.produtoId);

			if (!estoque) {
				return res.status(409).json({
					erro: 'Estoque indisponível',
					detalhes: ['Não existe estoque deste produto nesta unidade'],
				});
			}

			if (estoque.quantidade < item.quantidade) {
				return res.status(409).json({
					erro: 'Estoque insuficiente',
					detalhes: [`Quantidade disponível: ${estoque.quantidade}`],
				});
			}
		}

		return res.status(200).json({
			mensagem: 'Pedido validado com sucesso',
		});
	} catch (error) {
		console.error('Erro ao criar pedido:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
