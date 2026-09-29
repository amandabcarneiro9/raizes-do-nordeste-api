#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1ab9cfe52a1b68fa58ffc1418c732782e9482504299977753047f75f864f60bd/contract';
import endContract from '../../snapshots/1ab9cfe52a1b68fa58ffc1418c732782e9482504299977753047f75f864f60bd/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ee1af0dba6271fff6e7a44dc23293510289f55b58f3783e8c0f6f8ee68dd2743/contract';
import startContract from '../../snapshots/ee1af0dba6271fff6e7a44dc23293510289f55b58f3783e8c0f6f8ee68dd2743/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'Pedido', column: 'atualizadoEm' }),
      this.createTable({
        schema: 'public',
        table: 'HistoricoStatusPedido',
        columns: [
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observacao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pedidoId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'HistoricoStatusPedido_status_check_e61dac9d',
            "\"status\" IN ('CRIADO', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_PREPARACAO', 'PRONTO', 'ENTREGUE', 'CANCELADO')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Pagamento',
        columns: [
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mensagem', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('metodo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pedidoId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDENTE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('transacaoId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('valor', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Pagamento_status_check_005793e5',
            "\"status\" IN ('PENDENTE', 'APROVADO', 'NEGADO')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoStatusPedido',
        index: 'HistoricoStatusPedido_pedidoId_idx_4742647d',
        columns: ['pedidoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Pagamento',
        index: 'Pagamento_pedidoId_idx_4742647d',
        columns: ['pedidoId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'HistoricoStatusPedido',
        foreignKey: {
          name: 'HistoricoStatusPedido_pedidoId_fkey',
          columns: ['pedidoId'],
          references: { schema: 'public', table: 'Pedido', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Pagamento',
        foreignKey: {
          name: 'Pagamento_pedidoId_fkey',
          columns: ['pedidoId'],
          references: { schema: 'public', table: 'Pedido', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
