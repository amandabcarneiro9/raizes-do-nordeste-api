import 'dotenv/config';
import bcrypt from 'bcrypt';

import { db } from './prisma/db.js';

// cria o adm no caso de não existir um
async function seed() {
	console.log('Iniciando seed...');

	const emailAdmin = 'admin@raizes.com';

	const adminExistente = await db.orm.public.Usuario.where({ email: emailAdmin }).first();

	if (adminExistente) {
		console.log('Administrador já cadastrado.');
		return;
	}

	const senhaHash = await bcrypt.hash('Admin123!', 10);

	await db.orm.public.Usuario.create({
		nome: 'Administrador',
		email: emailAdmin,
		senhaHash,
		perfil: 'ADMIN',
		ativo: true,
	});

	console.log('Administrador criado com sucesso.');
}

seed().catch((erro) => {
	console.error('Erro ao executar seed:', erro);
	process.exit(1);
});
