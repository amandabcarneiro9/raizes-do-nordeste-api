import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
