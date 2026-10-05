import { db } from '../prisma/db.js';

export async function buscarUnidadePedido(id: string) {
	return db.orm.public.Unidade.where({ id }).first();
}

export async function buscarProdutoPedido(id: string) {
	return db.orm.public.Produto.where({ id }).first();
}

export async function buscarEstoquePedido(unidadeId: string, produtoId: string) {
	return db.orm.public.Estoque.where({
		unidadeId,
		produtoId,
	}).first();
}

export async function criarPedido(dados: {
	unidadeId: string;
	canalPedido: 'APP' | 'TOTEM' | 'BALCAO' | 'PICKUP' | 'WEB';
	valorTotal: number;
	itens: {
		produtoId: string;
		quantidade: number;
		precoUnitario: number;
		subtotal: number;
	}[];
}) {
	return db.transaction(async (tx) => {
		const pedido = await tx.orm.public.Pedido.create({
			clienteId: null,
			unidadeId: dados.unidadeId,
			canalPedido: dados.canalPedido,
			status: 'CRIADO',
			valorTotal: dados.valorTotal.toString(),
		});

		for (const item of dados.itens) {
			await tx.orm.public.ItemPedido.create({
				pedidoId: pedido.id,
				produtoId: item.produtoId,
				quantidade: item.quantidade,
				precoUnitario: item.precoUnitario.toString(),
				subtotal: item.subtotal.toString(),
			});

			const estoque = await tx.orm.public.Estoque.where({
				unidadeId: dados.unidadeId,
				produtoId: item.produtoId,
			}).first();

			if (!estoque) {
				throw new Error('Estoque não encontrado');
			}

			const novaQuantidade = estoque.quantidade - item.quantidade;

			await tx.orm.public.Estoque.where({ id: estoque.id }).update({
				quantidade: novaQuantidade,
			});

			await tx.orm.public.HistoricoStatusPedido.create({
				pedidoId: pedido.id,
				status: 'CRIADO',
				observacao: 'Pedido criado',
			});
		}

		return pedido;
	});
}

export async function buscarPedidoPorId(id: string) {
	return db.orm.public.Pedido.where({ id }).first();
}
