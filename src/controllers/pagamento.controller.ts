import type { Request, Response } from 'express';
import { buscarPedidoPorId, processarPagamento } from '../services/pagamento.service.js';

export async function postPagamento(req: Request, res: Response) {
	try {
		const { pedidoId, metodo, resultadoSimulado } = req.body;

		if (!pedidoId || !metodo) {
			return res.status(400).json({
				erro: 'Campos obrigatórios não informados',
				detalhes: ['pedidoId e metodo são obrigatórios'],
			});
		}

		if (resultadoSimulado !== 'APROVADO' && resultadoSimulado !== 'NEGADO') {
			return res.status(400).json({
				erro: 'Resultado de pagamento inválido',
				detalhes: ['resultadoSimulado deve ser APROVADO ou NEGADO'],
			});
		}

		const pedido = await buscarPedidoPorId(pedidoId);

		if (!pedido) {
			return res.status(404).json({
				erro: 'Pedido não encontrado',
			});
		}

		const pagamento = await processarPagamento({
			pedidoId: pedido.id,
			metodo,
			resultado: resultadoSimulado,
			valor: pedido.valorTotal,
		});

		return res.status(201).json({
			mensagem: resultadoSimulado === 'APROVADO' ? 'Pagamento aprovado' : 'Pagamento negado',
			pagamento,
		});

		// return res.status(200).json({
		// 	mensagem: 'Pedido encontrado para pagamento',
		// 	pedidoId: pedido.id,
		// 	valor: pedido.valorTotal,
		// });
	} catch (error) {
		console.error('Erro ao processar pagamento:', error);

		return res.status(500).json({
			erro: 'Erro interno do servidor',
		});
	}
}
