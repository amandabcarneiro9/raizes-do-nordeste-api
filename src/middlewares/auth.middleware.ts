import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
	usuarioId: string;
	perfil: string;
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
	const authorization = req.headers.authorization;

	if (!authorization) {
		return res.status(401).json({
			erro: 'Token não informado',
		});
	}

	const [tipo, token] = authorization.split(' ');

	if (tipo !== 'Bearer' || !token) {
		return res.status(401).json({
			erro: 'Token inválido',
		});
	}

	const jwtSecret = process.env['JWT_SECRET'];

	if (!jwtSecret) {
		throw new Error('JWT_SECRET não configurado');
	}

	try {
		const payload = jwt.verify(token, jwtSecret) as TokenPayload;

		res.locals.usuario = {
			id: payload.usuarioId,
			perfil: payload.perfil,
		};

		next();
	} catch {
		return res.status(401).json({
			erro: 'Token inválido ou expirado',
		});
	}
}

export function autorizar(...perfisPermitidos: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const usuario = res.locals.usuario;

		if (!usuario) {
			return res.status(401).json({
				erro: 'Usuário não autenticado',
			});
		}

		if (!perfisPermitidos.includes(usuario.perfil)) {
			return res.status(403).json({
				erro: 'Acesso não autorizado',
			});
		}

		next();
	};
}
