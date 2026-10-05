import { Router } from 'express';
import { postPagamento } from '../controllers/pagamento.controller.js';

const pagamentoRouter = Router();

pagamentoRouter.post('/', postPagamento);

export default pagamentoRouter;
