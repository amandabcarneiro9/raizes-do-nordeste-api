import 'dotenv/config';
import bcrypt from 'bcrypt';

import { db } from './prisma/db.js';

// cria o adm no caso de não existir um
async function seed() {
	console.log('Iniciando seed...');

	await crearUsuario('Administrador', 'admin@raizes.com', 'Admin123!', 'ADMIN');

	await crearUsuario('Atendente', 'atendente2@raizes.com', 'Atendente123!', 'ATENDENTE');

	await db.close();
}

async function crearUsuario(
	nome: string,
	email: string,
	senha: string,
	perfil: 'ADMIN' | 'ATENDENTE',
) {
	const usuario = await db.orm.public.Usuario.where({
		email,
	}).first();

	if (usuario) {
		console.log(`${nome} já cadastrado.`);
		return;
	}

	const senhaHash = await bcrypt.hash(senha, 10);

	await db.orm.public.Usuario.create({
		nome,
		email,
		senhaHash,
		perfil,
		ativo: true,
	});

	console.log(`${nome} criado com sucesso.`);
}

seed().catch((erro) => {
	console.error('Erro ao executar seed:', erro);
	process.exit(1);
});
