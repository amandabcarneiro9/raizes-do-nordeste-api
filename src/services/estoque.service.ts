import { db } from '../prisma/db.js';

export async function listarEstoques() {
	return db.orm.public.Estoque.all();
}

export async function buscarUnidadePorId(id: string) {
	return db.orm.public.Unidade.where({ id }).first();
}

export async function buscarProdutoPorId(id: string) {
	return db.orm.public.Produto.where({ id }).first();
}

export async function criarEstoque(dados: {
	unidadeId: string;
	produtoId: string;
	quantidade: number;
}) {
	return db.orm.public.Estoque.create({
		unidadeId: dados.unidadeId,
		produtoId: dados.produtoId,
		quantidade: dados.quantidade,
	});
}

// impedir que a mesma combinação unidade + produto seja cadastrada duas vezes
export async function buscarEstoque(unidadeId: string, produtoId: string) {
	return db.orm.public.Estoque.where({
		unidadeId,
		produtoId,
	}).first();
}
