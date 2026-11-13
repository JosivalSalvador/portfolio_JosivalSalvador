import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Users (e2e)', () => {
  let app: INestApplication;

  const dto = { nome: 'Marcos', email: 'marcos@example.com' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /users cria usuário', async () => {
    const res = await request(app.getHttpServer()).post('/users').send(dto).expect(201);
    expect(res.body).toEqual({ id: 1, ...dto });
  });

  it('GET /users lista usuários', async () => {
    await request(app.getHttpServer()).post('/users').send(dto);
    const res = await request(app.getHttpServer()).get('/users').expect(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /users/:id retorna o usuário', async () => {
    await request(app.getHttpServer()).post('/users').send(dto);
    const res = await request(app.getHttpServer()).get('/users/1').expect(200);
    expect(res.body).toEqual({ id: 1, ...dto });
  });

  it('GET /users/:id retorna 404 se não existe', () => {
    return request(app.getHttpServer()).get('/users/999').expect(404);
  });

  it('GET /users/:id retorna 400 com id inválido (ParseIdPipe)', () => {
    return request(app.getHttpServer()).get('/users/abc').expect(400);
  });

  it('PATCH /users/:id atualiza parcialmente', async () => {
    await request(app.getHttpServer()).post('/users').send(dto);
    const res = await request(app.getHttpServer())
      .patch('/users/1')
      .send({ nome: 'Novo Nome' })
      .expect(200);
    expect(res.body).toEqual({ id: 1, nome: 'Novo Nome', email: dto.email });
  });

  it('PATCH /users/:id retorna 404 se não existe', () => {
    return request(app.getHttpServer()).patch('/users/999').send({ nome: 'X' }).expect(404);
  });

  it('DELETE /users/:id remove', async () => {
    await request(app.getHttpServer()).post('/users').send(dto);
    await request(app.getHttpServer()).delete('/users/1').expect(200);
    await request(app.getHttpServer()).get('/users/1').expect(404);
  });
});