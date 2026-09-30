import { db } from '../prisma/db.js';

export async function listarUnidades() {
	return db.orm.public.Unidade.all();
}

export async function criarUnidade(dados: { nome: string; endereco?: string }) {
	return db.orm.public.Unidade.create({
		nome: dados.nome,
		endereco: dados.endereco ?? null,
		ativo: true,
	});
}
