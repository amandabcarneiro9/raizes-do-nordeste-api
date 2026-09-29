#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/793893357afd66614b7a818c7959d9a386d1906f50da13f312913641cb8f15c9/contract';
import startContract from '../../snapshots/793893357afd66614b7a818c7959d9a386d1906f50da13f312913641cb8f15c9/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ee1af0dba6271fff6e7a44dc23293510289f55b58f3783e8c0f6f8ee68dd2743/contract';
import endContract from '../../snapshots/ee1af0dba6271fff6e7a44dc23293510289f55b58f3783e8c0f6f8ee68dd2743/contract.json' with { type: 'json' };
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
      this.createTable({
        schema: 'public',
        table: 'ItemPedido',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pedidoId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('precoUnitario', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('produtoId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantidade', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('subtotal', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Pedido',
        columns: [
          col('atualizadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('canalPedido', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('clienteId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('CRIADO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('unidadeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('valorTotal', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Pedido_canalPedido_check_96be225e',
            "\"canalPedido\" IN ('APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB')",
          ),
          checkExpression(
            'Pedido_status_check_e61dac9d',
            "\"status\" IN ('CRIADO', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_PREPARACAO', 'PRONTO', 'ENTREGUE', 'CANCELADO')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ItemPedido',
        index: 'ItemPedido_pedidoId_idx_4742647d',
        columns: ['pedidoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ItemPedido',
        index: 'ItemPedido_produtoId_idx_eb62fdb9',
        columns: ['produtoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Pedido',
        index: 'Pedido_clienteId_idx_7ae16308',
        columns: ['clienteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Pedido',
        index: 'Pedido_unidadeId_idx_af675c1c',
        columns: ['unidadeId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ItemPedido',
        foreignKey: {
          name: 'ItemPedido_pedidoId_fkey',
          columns: ['pedidoId'],
          references: { schema: 'public', table: 'Pedido', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ItemPedido',
        foreignKey: {
          name: 'ItemPedido_produtoId_fkey',
          columns: ['produtoId'],
          references: { schema: 'public', table: 'Produto', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Pedido',
        foreignKey: {
          name: 'Pedido_clienteId_fkey',
          columns: ['clienteId'],
          references: { schema: 'public', table: 'Cliente', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Pedido',
        foreignKey: {
          name: 'Pedido_unidadeId_fkey',
          columns: ['unidadeId'],
          references: { schema: 'public', table: 'Unidade', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
