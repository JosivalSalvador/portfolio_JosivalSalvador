import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import session from 'express-session';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // o secret assina os cookies, então o navegador não consegue adulterar o valor.
  // fica aqui no create() porque é opção de criação do app.
  // se COOKIE_SECRET vier undefined o app sobe normal e só quebra quando alguém usar cookie assinado.
  const app = await NestFactory.create(AppModule, {
    cookies: { secret: process.env.COOKIE_SECRET },
  });
  const config = app.get(ConfigService);

  // origens do seu front (trocar pelas reais). CORS e CSRF usam a mesma lista.
  const origins = ['http://localhost:4200', 'https://meusite.com'];

  // ORDEM: os dois de baixo (headers e CSRF) têm que vir logo depois do create(), antes de qualquer app.use().
  // o que for registrado com app.use() antes deles roda primeiro, e se esse middleware responder
  // a requisição sozinho, a resposta sai sem os headers e sem passar pela checagem de CSRF.

  // coloca os headers de segurança em toda resposta (CSP, HSTS, X-Frame-Options...)
  // e remove o X-Powered-By. faz o papel do helmet.
  app.useSecurityHeaders();

  // CSRF: rejeita com 403 tudo que muda estado (qualquer método menos GET, HEAD e OPTIONS)
  // quando o navegador diz que a requisição veio de outra origem.
  // trustedOrigins = origens que podem fazer isso, senão o seu próprio front seria barrado.
  // a ordem entre este e o de cima não importa, os headers sempre saem antes da checagem.
  app.enableCsrfProtection({ trustedOrigins: origins });

  // CORS: deixa o navegador aceitar a resposta da API quando o front está em outra origem.
  // credentials: true permite o front mandar cookie junto com a requisição.
  app.enableCors({ origin: origins, credentials: true });

  // daqui pra baixo é tudo app.use(), por isso vem depois dos headers e do CSRF.

  // comprime as respostas (gzip/brotli). se tiver nginx na frente, tira isso e deixa o nginx comprimir.
  app.use(compression());

  // sessão: os dados ficam no servidor e o cookie só carrega o id da sessão.
  app.use(
    session({
      // assina o cookie do id da sessão
      secret: process.env.SESSION_SECRET!,
      // não regrava a sessão no store se nada mudou nela
      resave: false,
      // só cria a sessão (e manda o cookie) quando alguém guardar algo nela, ex: no login
      saveUninitialized: false,
      cookie: {
        // o javascript do navegador não consegue ler o cookie
        httpOnly: true,
        // só envia por https. só em produção porque em http local o cookie nem é gravado
        secure: process.env.NODE_ENV === 'production',
      },
      // sem "store" ele usa memória: serve só pra dev (vaza memória e não escala).
      // em produção precisa de store externo, tipo redis.
    }),
  );

  // o rate limit não fica aqui, está no app.module (ThrottlerModule + APP_GUARD),
  // porque é um guard e não um middleware.

  await app.listen(config.get<number>('PORT', 3001));
}

await bootstrap();