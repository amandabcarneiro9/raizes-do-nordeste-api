import { db } from '../prisma/db.js';

export async function buscarUsuarioPorEmail(email: string) {
	return db.orm.public.Usuario.where({ email }).first();
}

export async function criarUsuario(dados: {
	nome: string;
	email: string;
	senhaHash: string;
	perfil: string;
}) {
	return db.orm.public.Usuario.create({
		nome: dados.nome,
		email: dados.email,
		senhaHash: dados.senhaHash,
		perfil: dados.perfil,
		ativo: true,
	});
}
