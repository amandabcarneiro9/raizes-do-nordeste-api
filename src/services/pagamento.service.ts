import { db } from '../prisma/db.js';

export async function buscarPedidoPorId(id: string) {
	return db.orm.public.Pedido.where({ id }).first();
}

export async function processarPagamento(dados: {
	pedidoId: string;
	metodo: string;
	resultado: 'APROVADO' | 'NEGADO';
	valor: string;
}) {
	return db.transaction(async (tx) => {
		const pagamento = await tx.orm.public.Pagamento.create({
			pedidoId: dados.pedidoId,
			metodo: dados.metodo,
			status: dados.resultado,
			valor: dados.valor,
			transacaoId: crypto.randomUUID(),
			mensagem: dados.resultado === 'APROVADO' ? 'Pagamento aprovado' : 'Pagamento negado',
		});

		if (dados.resultado === 'APROVADO') {
			await tx.orm.public.Pedido.where({ id: dados.pedidoId }).update({
				status: 'PAGO',
			});

			await tx.orm.public.HistoricoStatusPedido.create({
				pedidoId: dados.pedidoId,
				status: 'PAGO',
				observacao: 'Pagamento aprovado',
			});
		}
		return pagamento;
	});
}
