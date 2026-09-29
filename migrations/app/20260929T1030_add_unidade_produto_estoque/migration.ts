#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/793893357afd66614b7a818c7959d9a386d1906f50da13f312913641cb8f15c9/contract';
import endContract from '../../snapshots/793893357afd66614b7a818c7959d9a386d1906f50da13f312913641cb8f15c9/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c7c9050d625a740195efe453a8529f629a40c841fa871b188fcbf693325e4cbb/contract';
import startContract from '../../snapshots/c7c9050d625a740195efe453a8529f629a40c841fa871b188fcbf693325e4cbb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Estoque',
        columns: [
          col('atualizadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('produtoId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantidade', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('unidadeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Produto',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('preco', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Unidade',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('endereco', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Estoque',
        constraint: 'Estoque_unidadeId_produtoId_key',
        columns: ['unidadeId', 'produtoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Estoque',
        index: 'Estoque_produtoId_idx_eb62fdb9',
        columns: ['produtoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Estoque',
        index: 'Estoque_unidadeId_idx_af675c1c',
        columns: ['unidadeId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Estoque',
        foreignKey: {
          name: 'Estoque_unidadeId_fkey',
          columns: ['unidadeId'],
          references: { schema: 'public', table: 'Unidade', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Estoque',
        foreignKey: {
          name: 'Estoque_produtoId_fkey',
          columns: ['produtoId'],
          references: { schema: 'public', table: 'Produto', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
