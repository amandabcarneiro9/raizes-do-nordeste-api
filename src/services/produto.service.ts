import { db } from '../prisma/db.js';

export async function listarProdutos() {
	return db.orm.public.Produto.all();
}

export async function criarProduto(dados: { nome: string; descricao?: string; preco: number }) {
	return db.orm.public.Produto.create({
		nome: dados.nome,
		descricao: dados.descricao ?? null,
		preco: dados.preco.toString(),
		ativo: true,
	});
}
