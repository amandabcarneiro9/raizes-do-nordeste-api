import express from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
	return res.status(200).json({
		status: 'ok',
		message: 'API Raízes do Nordeste funcionando',
	});
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
