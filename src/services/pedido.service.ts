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
