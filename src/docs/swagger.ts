import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Raízes do Nordeste',
			version: '1.0.0',
			description: 'API REST para gerenciamento da rede Raízes do Nordeste',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Servidor local',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
