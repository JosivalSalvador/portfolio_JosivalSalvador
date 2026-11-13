# Escopo do Projeto - Portfólio & Sistema de Gerenciamento

> Documento da **Fase 1 (planejamento)**. A documentação completa do projeto tem 9 arquivos, descritos na [seção 8](#8-documentação-do-projeto).
>
> **Fase 1 - Planejamento:** [`modelo-conceitual.md`](./modelo-conceitual.md) · [`casos-de-uso.md`](./casos-de-uso.md) · [`requisitos.md`](./requisitos.md) · [`plano-de-trabalho.md`](./plano-de-trabalho.md)
> **Fase 2 - Pós-implementação:** [`arquitetura.md`](./arquitetura.md) · [`api.md`](./api.md) · [`infraestrutura-e-deploy.md`](./infraestrutura-e-deploy.md) · [`README.md`](../README.md)

---

## 1. Visão Geral do Produto

### 1.1 O que é

Um portfólio profissional com **painel administrativo próprio**, construído para apresentar não só *o que* foi desenvolvido, mas *como* foi desenvolvido. Além da vitrine de projetos, o sistema expõe as decisões de engenharia por trás de cada aplicação e o histórico de versões, e permite que o dono do portfólio mantenha todo o conteúdo sem mexer no código.

### 1.2 Público-alvo

| Público | O que procura |
|---|---|
| **Recrutadores e gestores técnicos** | Encontrar rapidamente currículo, projetos e certificados; avaliar maturidade técnica. |
| **Outros desenvolvedores / visitantes** | Entender a arquitetura, as decisões e a evolução dos projetos. |
| **O próprio autor (administrador)** | Manter o conteúdo atualizado de forma simples e segura. |

### 1.3 Princípios do produto

1. **Navegação direta:** currículo, certificados e projetos acessíveis em **1 clique** a partir de qualquer tela.
2. **Maturidade profissional:** arquitetura, decisões técnicas e versionamento de releases são mostrados como parte do portfólio, evidenciando domínio do ciclo de vida de software.
3. **Foco no trabalho:** sem jogos, sem terminologias confusas e sem elementos que distraiam do conteúdo profissional.

### 1.4 Entregáveis

O projeto entrega duas coisas:

1. **O sistema** - portfólio público + painel administrativo (módulos descritos na seção 2).
2. **A documentação** - 9 arquivos que cobrem desde o planejamento até a operação do sistema (seção 8).

---

## 2. Estrutura do Sistema

O sistema é dividido em **4 módulos principais**, acessíveis pelo menu lateral ou superior.

| # | Módulo | Acesso | Objetivo |
|---|---|---|---|
| 1 | Central de Projetos | Público | Mostrar projetos, a engenharia por trás deles e o histórico de versões. |
| 2 | Perfil & Currículo Destaque | Público | Apresentar o profissional, suas habilidades e o currículo para download. |
| 3 | Certificados & Formação | Público | Comprovar conhecimento por meio de cursos e certificações verificáveis. |
| 4 | Painel de Controle | Restrito (`ADMIN` / `GUEST`) | Gerenciar todo o conteúdo dos módulos anteriores. |

---

## 3. Módulo 1 - Central de Projetos

Não é apenas uma galeria de cards com foto: cada projeto tem uma página própria que conta a história técnica da aplicação.

### 3.1 Vitrine

- Lista os projetos em **cards** com capa (imagem ou GIF da interface), título, resumo e as tecnologias utilizadas.
- Projetos marcados como **destaque** são fixados no topo da vitrine.
- Ao clicar em um card, o visitante é levado à página de detalhe do projeto (endereçada por um *slug* amigável, ex.: `/projetos/gerenciador-de-projetos-web`).

### 3.2 Página de detalhe do projeto

A página é organizada em três seções.

#### a) Visão Geral

- O que o projeto resolve e qual é a proposta da aplicação (descrição detalhada).
- Link do **deploy** (aplicação rodando ao vivo).
- Link do **repositório no GitHub**.
- Imagem/GIF demonstrativo e lista de tecnologias utilizadas.

#### b) A Engenharia por Trás - "Como Fiz"

| Subseção | Conteúdo esperado |
|---|---|
| **Arquitetura do Sistema** | Breve explicação de como o front-end se comunica com o back-end e o banco de dados: organização de pastas, fluxo de dados e padrões de projeto adotados. |
| **Desafios Técnicos & Soluções** | O maior problema enfrentado (ex.: performance, segurança, rotas complexas) e como foi resolvido. |
| **Decisões de Tecnologia** | Por que a tecnologia X foi escolhida em vez da Y. |

> Esta seção é **conteúdo exibido ao visitante sobre cada projeto do portfólio**. Não deve ser confundida com o [`docs/arquitetura.md`](./arquitetura.md), que documenta a arquitetura do próprio sistema de portfólio.

#### c) Gerenciamento de Controle - Versões / Histórico de Releases

- Aba que exibe a **linha do tempo de versões** do projeto, por exemplo:
  - `v0.1.0` - MVP lançado
  - `v0.2.0` - autenticação JWT adicionada
  - `v1.0.0` - refatoração de queries no banco
- Cada release mostra: **versão**, **changelog** (o que mudou, correções e novas funcionalidades) e **data de lançamento**.
- As releases são geradas a partir das **tags de release do GitHub** (versionamento iniciando em `v0.1.0`) e podem entrar no sistema de duas formas:
  1. automaticamente, via **Webhook do GitHub**;
  2. manualmente, via **formulário interno** do Painel de Controle.
- O identificador original da release no GitHub é armazenado para **evitar duplicidade** entre as duas formas de entrada.
- Um projeto recém-cadastrado, sem nenhuma release sincronizada, exibe a aba de histórico em estado vazio (sem erro).

---

## 4. Módulo 2 - Perfil & Currículo Destaque

### 4.1 Resumo profissional

- Nome completo, **cargo/título principal** (ex.: *Desenvolvedor Full Stack Web*) e **biografia** com a trajetória e o foco profissional.
- Principais especialidades.

### 4.2 Contato rápido

Links diretos e sempre visíveis para:

- **LinkedIn**
- **GitHub**
- **E-mail profissional**

### 4.3 Download do currículo

- **Botão de download** do currículo em **PDF**, sempre apontando para a versão mais atualizada.
- Acessível em 1 clique, a partir de qualquer tela do portfólio.
- O `ADMIN` atualiza o arquivo pelo painel (ver 6.2).

### 4.4 Habilidades agrupadas

As tecnologias dominadas são exibidas com ícone e separadas por área:

- **Front-end**
- **Back-end**
- **Banco de Dados**
- **Ferramentas / DevOps**

---

## 5. Módulo 3 - Certificados & Formação

Funciona como a **prova de conhecimento** do portfólio.

### 5.1 Mural de certificados

- Lista com todos os cursos e certificações concluídos.
- Cada item exibe: **título**, **instituição emissora** e **data de emissão**.
- A **grade do curso** (o que foi ensinado) não aparece nos itens do mural, para mantê-lo compacto. Ela é exibida ao abrir o certificado (ver 5.3).

### 5.2 Filtro por categoria temática

- O visitante filtra o mural por área (ex.: apenas *Back-end*, apenas *Cloud/DevOps*, *Arquitetura*).
- Sem filtro aplicado, todos os certificados são exibidos.

### 5.3 Detalhes e validação

Ao selecionar um certificado, o visitante abre um **modal de detalhes**, sem sair da página, com:

- **Grade do curso:** o que foi ensinado.
- **Imagem do comprovante ou diploma** (quando houver).
- **Link de verificação oficial** da instituição/plataforma emissora (quando houver), que leva à credencial externa.

Cada certificado oferece pelo menos um meio de comprovação: o link de verificação oficial ou a imagem do comprovante.

---

## 6. Módulo 4 - Painel de Controle (Área Administrativa)

Área **restrita**, protegida por autenticação (e-mail e senha), onde o conteúdo do portfólio é mantido **sem necessidade de alterar o código** do site.

### 6.1 Perfis de acesso

| Papel | Descrição | Permissões |
|---|---|---|
| `ADMIN` | Dono do portfólio. | Leitura e escrita completas. |
| `GUEST` | Modo Convidado / Leitura. | Somente leitura. |

### 6.2 Funcionalidades do administrador (`ADMIN`)

- Cadastrar, editar e excluir **projetos** (incluindo notas de arquitetura, decisões de tecnologia, desafios e soluções, links e capa).
- Gerenciar **tecnologias** e associá-las aos projetos.
- Cadastrar, editar e excluir **certificados** (incluindo a grade do curso).
- Registrar e atualizar o **histórico de releases** (formulário interno, complementando a sincronização automática com o GitHub).
- Editar o **perfil** (nome, cargo, biografia, especialidades, e-mail e links de contato) e enviar o **currículo em PDF**. O perfil já existe desde a configuração inicial: o painel apenas o edita.
- Enviar **arquivos** pelo painel (capa dos projetos, ícones das tecnologias, imagens de comprovante dos certificados e o currículo). Os arquivos ficam em armazenamento externo, e o banco guarda apenas o link.

### 6.3 Modo Convidado / Leitura (`GUEST`)

- Permite que qualquer pessoa **veja o painel por dentro** e conheça a interface administrativa, **sem risco para os dados** do autor.
- O convidado navega por todas as telas do painel, inclusive a do perfil, mas **não consegue criar, alterar, enviar arquivos nem apagar** nenhum registro.
- A restrição é garantida **no servidor** (e não apenas escondendo botões na interface), de modo que nenhuma ação de escrita seja aceita para esse papel.

---

## 7. Fora do Escopo

- Jogos, animações lúdicas ou qualquer elemento que desvie o foco do conteúdo profissional.
- Cadastro público de usuários: o acesso ao painel é restrito a contas criadas para administração e para o modo convidado.
- **Nesta fase (planejamento):** a documentação técnica pós-implementação — `arquitetura.md`, `api.md`, `infraestrutura-e-deploy.md` e `README.md`. Ela faz parte do projeto, mas só será escrita depois que o sistema estiver pronto (ver seção 8).

---

## 8. Documentação do Projeto

A documentação é dividida em duas fases, de acordo com o que cada documento descreve.

### 8.1 Fase 1 - Planejamento (guia a construção do sistema)

Escrita **antes** de codar, define *o que* será construído.

| Documento | Finalidade |
|---|---|
| [`escopo.md`](./escopo.md) | Visão geral do produto, os 4 módulos e a estrutura da documentação (este arquivo). |
| [`modelo-conceitual.md`](./modelo-conceitual.md) | As 7 entidades, atributos, tipos de dados e cardinalidades `(min, max)` dos relacionamentos. |
| [`casos-de-uso.md`](./casos-de-uso.md) | Fluxos e cenários de uso de Visitante/Recrutador, `GUEST` e `ADMIN`. |
| [`requisitos.md`](./requisitos.md) | Requisitos Funcionais, Requisitos Não-Funcionais e Regras de Negócio. |
| [`plano-de-trabalho.md`](./plano-de-trabalho.md) | Fluxo de trabalho, quadro e convenções no GitHub, e a ordem e a divisão por semana das issues. |

### 8.2 Fase 2 - Pós-implementação (descreve o sistema construído)

Escrita **depois** que o sistema estiver pronto, registra *o que de fato foi feito*. Assim, os documentos refletem a implementação real, e não uma previsão que pode ter mudado durante o desenvolvimento.

| Documento | Finalidade |
|---|---|
| [`arquitetura.md`](./arquitetura.md) | Arquitetura real do sistema: camadas, comunicação entre front-end, back-end e banco de dados, estrutura de pastas e padrões adotados. |
| [`api.md`](./api.md) | Contrato da API: endpoints, autenticação, rotas protegidas por papel (`ADMIN`/`GUEST`), formatos de requisição e resposta, códigos de erro e o endpoint que recebe o Webhook de releases do GitHub. |
| [`infraestrutura-e-deploy.md`](./infraestrutura-e-deploy.md) | Ambientes, variáveis de configuração, banco de dados, pipeline de build e publicação (incluindo a configuração do Webhook de sincronização de releases) e o passo a passo de deploy. |
| [`README.md`](../README.md) | Porta de entrada do repositório: o que é o projeto, tecnologias, como rodar localmente e links para toda a documentação. |

### 8.3 Regra de manutenção

- Os documentos da Fase 1 são a **referência para a construção**. Se a implementação divergir deles, o documento correspondente deve ser atualizado.
- Os documentos da Fase 2 devem ser escritos a partir do sistema pronto e revisados a cada mudança relevante (nova rota, mudança de arquitetura ou de infraestrutura).

---

## 9. Premissas e Pontos em Aberto

Itens assumidos neste documento que podem ser ajustados e serão refletidos nos demais arquivos:

1. **Armazenamento de arquivos.** O serviço de armazenamento externo e os limites de upload (tipos permitidos e tamanho máximo) serão definidos na implementação.