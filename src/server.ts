import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import produtoRouter from './routes/produto.routes.js';
import unidadeRouter from './routes/unidade.routes.js';
import estoqueRouter from './routes/estoque.routes.js';
import pedidoRouter from './routes/pedido.routes.js';
import pagamentoRouter from './routes/pagamento.routes.js';
import usuarioRouter from './routes/usuario.routes.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/produtos', produtoRouter);

app.use('/unidades', unidadeRouter);

app.use('/estoque', estoqueRouter);

app.use('/pagamentos', pagamentoRouter);

app.use('/usuarios', usuarioRouter);

console.log('Registrando /pedidos');
app.use('/pedidos', pedidoRouter);

app.get('/health', (req, res) => {
	return res.status(200).json({
		status: 'ok',
		message: 'API Raízes do Nordeste funcionando',
	});
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
	console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
