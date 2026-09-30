import { Router } from 'express';
import { postPedido } from '../controllers/pedido.controller.js';

console.log('pedido.routes.ts foi carregado');

const pedidoRouter = Router();

pedidoRouter.post('/', postPedido);

export default pedidoRouter;
