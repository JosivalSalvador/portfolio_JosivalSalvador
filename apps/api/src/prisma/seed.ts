import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { createDb } from './db.js';
import { perfilSeed } from './seeds/perfil.data.js';

// O login deve usar o mesmo valor.
const BCRYPT_ROUNDS = 12;

const VARIAVEIS = [
  'DATABASE_URL',
  'SEED_ADMIN_EMAIL',
  'SEED_ADMIN_PASSWORD',
  'SEED_GUEST_EMAIL',
] as const;

type Db = ReturnType<typeof createDb>;

function lerEnv() {
  const faltando = VARIAVEIS.filter((nome) => !process.env[nome]);
  if (faltando.length > 0) {
    throw new Error(`Variáveis de ambiente faltando: ${faltando.join(', ')}`);
  }
  return {
    databaseUrl: process.env['DATABASE_URL'] as string,
    adminEmail: process.env['SEED_ADMIN_EMAIL'] as string,
    adminSenha: process.env['SEED_ADMIN_PASSWORD'] as string,
    guestEmail: process.env['SEED_GUEST_EMAIL'] as string,
  };
}

async function garantirUsuario(
  db: Db,
  dados: {
    email: string;
    papel: 'ADMIN' | 'GUEST';
    perfilId: string | null;
    gerarSenha: () => string;
  },
) {
  const existente = await db.orm.public.Usuario.where({ email: dados.email }).first();
  if (existente) {
    console.log(`${dados.papel} já existe, mantido.`);
    return;
  }

  const senhaHash = await bcrypt.hash(dados.gerarSenha(), BCRYPT_ROUNDS);
  await db.orm.public.Usuario.create({
    email: dados.email,
    senhaHash,
    papel: dados.papel,
    perfilId: dados.perfilId,
  });
  console.log(`${dados.papel} criado.`);
}

async function main() {
  const env = lerEnv();
  const db = createDb(env.databaseUrl);

  try {
    const existente = await db.orm.public.Perfil.first();
    const perfil =
      existente ??
      (await db.orm.public.Perfil.create({ ...perfilSeed, urlCvPdf: null }));
    console.log(existente ? 'Perfil já existe, reaproveitado.' : 'Perfil criado.');

    await garantirUsuario(db, {
      email: env.adminEmail,
      papel: 'ADMIN',
      perfilId: perfil.id,
      gerarSenha: () => env.adminSenha,
    });

    // A senha do GUEST é aleatória e nunca exibida: ele entra pelo botão "Entrar como convidado".
    await garantirUsuario(db, {
      email: env.guestEmail,
      papel: 'GUEST',
      perfilId: null,
      gerarSenha: () => randomBytes(32).toString('hex'),
    });
  } finally {
    await db.close();
  }
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : 'Falha no seed.');
  process.exit(1);
});