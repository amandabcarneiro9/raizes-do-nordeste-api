import { Router } from 'express';

import { postUsuario } from '../controllers/usuario.controller.js';

const usuarioRouter = Router();

usuarioRouter.post('/', postUsuario);

export default usuarioRouter;
