# Arquitetura: Estrutura de Pastas da API

> Documento da **Fase 2 (pós-implementação)**. Explica como a pasta da API (`apps/api`) é organizada e o que cada pasta e subpasta guarda. Não detalha arquivos individuais.
>
> Veja também: [`escopo.md`](./escopo.md) · [`modelo-conceitual.md`](./modelo-conceitual.md) · [`requisitos.md`](./requisitos.md)

---

## 1. Visão Geral

A API fica em `apps/api` e é feita com NestJS e Prisma 8. A organização é **por feature**: cada parte do negócio (autenticação, projetos, certificados...) vive numa pasta própria dentro de `src/modules/`, com tudo o que ela precisa.

A regra que separa as pastas é simples:

- **`modules/`** guarda tudo o que tem rota e regra de negócio.
- **O resto de `src/`** guarda infraestrutura técnica (banco, Redis, cache, filas, upload, configuração) e ferramentas genéricas usadas por várias features.

Dentro de cada módulo não há subpastas por camada: o código fica solto na pasta do módulo, e a única subpasta é `dto/`. Os testes unitários ficam ao lado do código que testam; os testes e2e ficam em `test/`.

```
apps/api/
├── migrations/
├── test/
│   ├── helpers/
│   ├── fixtures/
│   └── mocks/
└── src/
    ├── bootstrap/
    ├── config/
    ├── types/
    ├── common/
    │   ├── constants/
    │   ├── decorators/
    │   ├── dto/
    │   ├── exceptions/
    │   ├── filters/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── interfaces/
    │   ├── middleware/
    │   ├── pipes/
    │   ├── utils/
    │   └── validators/
    ├── shared/
    │   ├── github/
    │   └── slug/
    ├── prisma/
    │   ├── middleware/
    │   └── seeds/
    ├── redis/
    ├── cache/
    ├── queue/
    ├── storage/
    │   ├── providers/
    │   └── dto/
    └── modules/
        ├── auth/
        │   └── dto/
        ├── users/
        │   └── dto/
        ├── profile/
        │   └── dto/
        ├── projects/
        │   └── dto/
        ├── releases/
        │   └── dto/
        ├── technologies/
        │   └── dto/
        ├── certificates/
        │   └── dto/
        ├── dashboard/
        │   └── dto/
        └── health/
```

---

## 2. Raiz de `apps/api/`

| Pasta | O que guarda |
|---|---|
| `src/` | Todo o código da API. |
| `test/` | Testes e2e (de ponta a ponta), um por módulo, e o material de apoio a eles. |
| `migrations/` | Histórico das alterações do banco (migrations do Prisma 8), versionado no Git. É gerado pelo Prisma e não se edita à mão. |

### 2.1 Subpastas de `test/`

| Subpasta | O que guarda |
|---|---|
| `helpers/` | Funções de apoio aos testes, como criar o app de teste e fazer login. |
| `fixtures/` | Dados falsos prontos para uso (usuários, projetos, certificados). |
| `mocks/` | Imitações de coisas externas, como o payload do GitHub, o Redis e o storage. |

---

## 3. `src/`: Infraestrutura

### 3.1 `bootstrap/`

Funções de configuração chamadas na inicialização da API: CORS, segurança, Swagger e validação global. Existe para a entrada da aplicação não ficar grande.

### 3.2 `config/`

Leitura e validação das variáveis de ambiente, dividida por assunto (banco, Redis, autenticação, GitHub, storage, limite de requisições, Swagger). As variáveis são validadas na inicialização.

### 3.3 `types/`

Declarações globais de tipo do TypeScript, como a extensão do `Request` do Express com os dados do usuário logado. Só tipagem: nada nessa pasta é executado.

### 3.4 `common/`

Ferramentas genéricas, **sem regra de negócio** e **sem módulo Nest próprio**: o conteúdo é importado direto por quem precisa.

| Subpasta | O que guarda |
|---|---|
| `constants/` | Valores fixos reaproveitados (códigos de erro, chaves de cache, limites). |
| `decorators/` | Decorators genéricos de uso geral, como o que documenta respostas paginadas no Swagger. |
| `dto/` | DTOs usados por vários módulos: paginação, id e slug vindos da URL, formato padrão de erro. |
| `exceptions/` | Classes de erro de negócio (recurso não encontrado, conflito, regra violada). |
| `filters/` | Capturam os erros lançados na API e padronizam a resposta enviada ao cliente. |
| `guards/` | Guards genéricos que não são de autenticação, como o limite de requisições. |
| `interceptors/` | Lógica que roda antes e depois da rota: log, cache, tempo limite e formato da resposta. |
| `interfaces/` | Tipos TypeScript compartilhados, como os dados guardados na sessão e o resultado paginado. |
| `middleware/` | Código que roda antes da rota, como o identificador da requisição e o log HTTP. |
| `pipes/` | Validam ou transformam parâmetros antes de eles chegarem à rota. |
| `utils/` | Funções puras de apoio: data, hash, slug e paginação. |
| `validators/` | Regras de validação customizadas, usadas nos DTOs. |

### 3.5 `shared/`

Serviços injetáveis usados por mais de uma feature. Diferente de `common/`, aqui o conteúdo são providers do Nest, então a pasta tem um módulo na raiz que reúne todos eles.

| Subpasta | O que guarda |
|---|---|
| `github/` | Comunicação com a API do GitHub. |
| `slug/` | Geração e conferência de slugs únicos. |

### 3.6 `prisma/`

Tudo o que é do Prisma 8: o contrato do banco (tabelas e enums), os arquivos emitidos a partir dele, o cliente compartilhado e a integração com o Nest. Não existe pasta `entities/`: os tipos vêm do próprio contrato.

| Subpasta | O que guarda |
|---|---|
| `middleware/` | Comportamentos aplicados ao cliente do banco, como o log de queries. |
| `seeds/` | Dados iniciais do banco, um por assunto (administrador, perfil, tecnologias). |

### 3.7 `redis/`

Conexão com o Redis. É usada pela sessão de login, pelo cache e pelas filas.

### 3.8 `cache/`

Camada de cache em cima do Redis: guardar, ler e invalidar dados consultados com frequência, como a vitrine de projetos.

### 3.9 `queue/`

Configuração das filas (também sobre o Redis) para tarefas assíncronas, como processar o webhook de releases do GitHub sem atrasar a resposta.

### 3.10 `storage/`

Upload e URLs dos arquivos guardados no armazenamento externo (capas dos projetos, ícones, comprovantes e currículo). O banco guarda apenas a URL.

| Subpasta | O que guarda |
|---|---|
| `providers/` | As implementações do armazenamento (disco local e S3), atrás de uma interface comum. |
| `dto/` | Formato dos dados de upload (entrada e resposta). |

---

## 4. `src/modules/`: Features

Cada módulo cobre uma parte do sistema e tem as rotas, a regra de negócio e os formatos de dados dela.

| Módulo | O que cobre |
|---|---|
| `auth/` | Login, logout, sessão guardada no Redis, e os guards e decorators que controlam o acesso por papel (`ADMIN` e `GUEST`). |
| `users/` | Contas de acesso ao painel: criação, papel e troca de senha. |
| `profile/` | Perfil: resumo profissional, canais de contato e currículo. |
| `projects/` | Projetos do portfólio, incluindo a ligação N:N com tecnologias. Não existe módulo próprio para a tabela associativa. |
| `releases/` | Histórico de versões dos projetos: o CRUD das releases e o recebimento do webhook do GitHub (validação da assinatura e processamento). |
| `technologies/` | Catálogo de linguagens, frameworks e ferramentas. |
| `certificates/` | Mural de cursos e certificações, com filtro por categoria. |
| `dashboard/` | Números e resumo exibidos no Painel de Controle. Só leitura. |
| `health/` | Verificação de saúde da API (banco, Redis e storage), para monitoramento. |

### 4.1 O que fica dentro de cada módulo

A pasta do módulo guarda, solto e conforme a necessidade:

- o módulo Nest, que liga as peças;
- as rotas (controller);
- a regra de negócio (service);
- a conversão do dado do banco para o formato da resposta (mapper);
- os valores fixos do módulo (constants);
- os testes unitários, ao lado do código que testam.

### 4.2 `dto/`

É a **única subpasta** de um módulo. Guarda os formatos de entrada (criar, atualizar, consultar) e de saída (resposta) do módulo. O `health/` é o único módulo sem `dto/`, porque não recebe dados.