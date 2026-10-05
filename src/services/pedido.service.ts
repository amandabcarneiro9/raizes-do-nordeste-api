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
		}

		return pedido;
	});
}
