#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0265803b8f7d063b972abdc145c7780094f9532fff0a5021f157c461bdc5a622/contract';
import endContract from '../../snapshots/0265803b8f7d063b972abdc145c7780094f9532fff0a5021f157c461bdc5a622/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract';
import startContract from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'Papel',
        members: ['ADMIN', 'GUEST'],
      }),
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropTable({ schema: 'public', table: 'User' }),
      this.createTable({
        schema: 'public',
        table: 'perfil',
        columns: [
          col('biografia', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('cargo_titulo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email_contato', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('especialidades', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', {
            notNull: true,
            default: fn(sql`gen_random_uuid()`),
            codecRef: { codecId: 'pg/uuid@1' },
          }),
          col('nome_completo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url_cv_pdf', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('url_github', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('url_linkedin', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuarios',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', {
            notNull: true,
            default: fn(sql`gen_random_uuid()`),
            codecRef: { codecId: 'pg/uuid@1' },
          }),
          col('papel', '"Papel"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'Papel' } },
          }),
          col('perfil_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('senha_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuarios',
        constraint: 'usuarios_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarios',
        index: 'usuarios_perfil_id_idx_0e75ecf5',
        columns: ['perfil_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarios',
        foreignKey: {
          name: 'usuarios_perfil_id_fkey',
          columns: ['perfil_id'],
          references: { schema: 'public', table: 'perfil', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
