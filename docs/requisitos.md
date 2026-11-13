# Requisitos: Portfólio & Sistema de Gerenciamento

> Documento da **Fase 1 (planejamento)**. Traduz o comportamento esperado do sistema em requisitos formais e verificáveis.
> Veja também: [`escopo.md`](./escopo.md) · [`modelo-conceitual.md`](./modelo-conceitual.md) · [`casos-de-uso.md`](./casos-de-uso.md)

---

## 1. Visão Geral

Este documento é o contrato técnico do projeto: tudo o que o sistema **deve fazer** (requisitos funcionais), **como deve se comportar** (requisitos não funcionais) e **quais regras de negócio** precisa respeitar.

### 1.1 Identificação dos requisitos

| Prefixo | Tipo | Exemplo |
|---|---|---|
| `RF-xx` | Requisito Funcional: uma ação que o sistema precisa suportar. | `RF-05` |
| `RN-xx` | Regra de Negócio: uma regra que os dados e as operações precisam respeitar. | `RN-04` |
| `RNF-xx` | Requisito Não Funcional: uma qualidade ou restrição técnica (segurança, integridade, usabilidade, desempenho). | `RNF-03` |

### 1.2 De onde vêm os requisitos

- Os **RF** nascem dos casos de uso (`UC-xx`) de [`casos-de-uso.md`](./casos-de-uso.md). A coluna **Origem** indica o caso de uso correspondente.
- As **RN** nascem das cardinalidades e entidades de [`modelo-conceitual.md`](./modelo-conceitual.md) e das definições de [`escopo.md`](./escopo.md).
- Os **RNF** garantem que os RF e as RN sejam cumpridos com segurança, integridade e boa experiência de uso.

---

## 2. Requisitos Funcionais (RF)

### 2.1 Central de Projetos (área pública)

| ID | Requisito | Origem |
|---|---|---|
| RF-01 | O sistema deve exibir a vitrine de projetos em cards, cada um com capa, título, resumo e tecnologias utilizadas. | UC-01 |
| RF-02 | O sistema deve fixar no topo da vitrine os projetos marcados como destaque. | UC-01 |
| RF-03 | O sistema deve exibir, para cada projeto, uma página própria identificada por um endereço amigável (*slug*). | UC-02 |
| RF-04 | O sistema deve renderizar a **Visão Geral** do projeto: descrição detalhada, imagem ou GIF da interface, tecnologias utilizadas, link do deploy e link do repositório no GitHub. | UC-02 |
| RF-05 | O sistema deve renderizar a seção **A Engenharia por Trás ("Como Fiz")**, com Arquitetura do Sistema, Desafios Técnicos & Soluções e Decisões de Tecnologia. | UC-03 |
| RF-06 | O sistema deve exibir o histórico de releases do projeto, da mais recente para a mais antiga, com versão, data de lançamento e changelog. | UC-04 |
| RF-07 | O sistema deve exibir em estado vazio, sem mensagem de erro, a vitrine, as seções de engenharia, o histórico de releases e o mural de certificados quando não houver conteúdo. | UC-01, UC-03, UC-04, UC-07 |
| RF-08 | O sistema deve exibir uma página de "projeto não encontrado", com acesso de volta à vitrine, quando o *slug* não corresponder a nenhum projeto. | UC-02 |

### 2.2 Perfil & Currículo Destaque (área pública)

| ID | Requisito | Origem |
|---|---|---|
| RF-09 | O sistema deve exibir o resumo profissional: nome completo, cargo ou título principal, biografia e principais especialidades. | UC-05 |
| RF-10 | O sistema deve exibir os links de contato rápido: LinkedIn, GitHub e e-mail. | UC-05 |
| RF-11 | O sistema deve exibir as habilidades agrupadas por área (Front-end, Back-end, Banco de Dados e Ferramentas / DevOps), a partir do catálogo de tecnologias. | UC-05 |
| RF-12 | O sistema deve disponibilizar, em qualquer tela pública, um botão que baixa o currículo em PDF mais atualizado com 1 clique. | UC-06 |
| RF-13 | O sistema deve informar a indisponibilidade do currículo, sem retirar o visitante da página, quando o arquivo não puder ser entregue. | UC-06 |

### 2.3 Certificados & Formação (área pública)

| ID | Requisito | Origem |
|---|---|---|
| RF-14 | O sistema deve exibir o mural de certificados com título, instituição emissora, categoria e data de emissão. A grade do curso não é exibida no mural: fica nos detalhes do certificado (RF-18). | UC-07 |
| RF-15 | O sistema deve processar o filtro por categoria, exibindo apenas os certificados da categoria escolhida, e permitir limpar o filtro para voltar a ver todos. | UC-08 |
| RF-16 | O sistema deve informar que não há resultados quando a categoria escolhida não tiver certificados. | UC-08 |
| RF-17 | O sistema deve disponibilizar, por certificado, o link de verificação oficial da credencial no site do emissor, acessível a partir do modal de detalhes. | UC-09 |
| RF-18 | O sistema deve exibir, ao selecionar um certificado, um modal de detalhes, sem sair da página, com a grade do curso e a imagem do comprovante ou diploma. | UC-09 |
| RF-19 | O sistema deve exibir, no modal de detalhes de cada certificado, apenas o que estiver disponível: grade do curso, imagem do comprovante e link de verificação. | UC-09 |

### 2.4 Autenticação e acesso ao Painel de Controle

| ID | Requisito | Origem |
|---|---|---|
| RF-20 | O sistema deve autenticar usuários por e-mail e senha. | UC-10 |
| RF-21 | O sistema deve oferecer a opção **Entrar como convidado**, que autentica a conta de papel `GUEST`. | UC-10 |
| RF-22 | O sistema deve recusar credenciais inválidas e manter o usuário na tela de login. | UC-10 |
| RF-23 | O sistema deve redirecionar para a tela de login qualquer tentativa de abrir uma tela do painel sem autenticação. | UC-10 |
| RF-24 | O sistema deve identificar o papel do usuário (`ADMIN` ou `GUEST`) e aplicar as permissões correspondentes durante toda a sessão. | UC-10, UC-11 |
| RF-25 | O sistema deve permitir que o `GUEST` navegue por todas as áreas do painel (perfil, projetos, tecnologias, certificados e releases) em modo leitura. | UC-11 |
| RF-26 | O sistema deve recusar qualquer ação de criação, edição, envio de arquivo ou exclusão feita pelo `GUEST`, informando que o acesso é somente leitura. | UC-11 |
| RF-42 | O sistema deve encerrar a sessão do usuário autenticado (`ADMIN` ou `GUEST`) quando ele escolher **Sair** ou quando a sessão expirar, e levá-lo à tela de login. | UC-10 |

### 2.5 Gestão de conteúdo (somente `ADMIN`)

| ID | Requisito | Origem |
|---|---|---|
| RF-27 | O sistema deve permitir ao `ADMIN` listar, criar, editar e excluir **projetos**. | UC-12 |
| RF-28 | O sistema deve permitir informar, em cada projeto: título, *slug*, resumo, descrição detalhada, notas de arquitetura, decisões de tecnologia, desafios e soluções, link do deploy, link do repositório, nome exato do repositório no GitHub, capa (enviada como arquivo, RF-44) e destaque, além de selecionar as tecnologias utilizadas. | UC-12 |
| RF-29 | O sistema deve vincular cada projeto criado ao perfil e preencher automaticamente as datas de criação e de última alteração. | UC-12 |
| RF-30 | O sistema deve permitir marcar e desmarcar um projeto como destaque. | UC-12 |
| RF-31 | O sistema deve pedir confirmação antes de excluir qualquer registro, informando os registros que serão afetados. | UC-12, UC-13, UC-14, UC-15 |
| RF-32 | O sistema deve permitir ao `ADMIN` listar, criar, editar e excluir **tecnologias**, informando nome, categoria e ícone (enviado como arquivo, RF-44). | UC-13 |
| RF-33 | O sistema deve permitir ao `ADMIN` listar, criar, editar e excluir **certificados**, informando título, instituição, categoria (uma das áreas definidas), data de emissão, grade do curso, link de validação e imagem do comprovante (enviada como arquivo, RF-44). | UC-14 |
| RF-34 | O sistema deve permitir ao `ADMIN` listar, criar, editar e excluir **releases** no contexto de um projeto, informando versão, changelog e data de lançamento. | UC-15 |
| RF-35 | O sistema deve validar os campos obrigatórios de todos os formulários do painel e indicar quais precisam ser preenchidos. | UC-12, UC-13, UC-14, UC-15, UC-17 |
| RF-43 | O sistema deve permitir ao `ADMIN` editar o **perfil**, informando nome completo, cargo ou título, biografia, especialidades, e-mail de contato e links do LinkedIn e do GitHub. O perfil existe desde a configuração inicial e não é criado nem excluído pelo painel. | UC-17 |
| RF-44 | O sistema deve permitir ao `ADMIN` enviar pelo painel os arquivos do conteúdo (capa dos projetos, ícones das tecnologias, imagens de comprovante dos certificados e currículo em PDF), guardá-los em armazenamento externo e registrar o link de cada arquivo no respectivo registro. | UC-12, UC-13, UC-14, UC-17 |
| RF-45 | O sistema deve recusar o arquivo cujo tipo ou tamanho não seja permitido, ou cujo envio falhe, informando o motivo e mantendo o arquivo anterior, quando houver. | UC-12, UC-13, UC-14, UC-17 |

### 2.6 Integração com o GitHub

| ID | Requisito | Origem |
|---|---|---|
| RF-36 | O sistema deve receber os dados de novas releases enviados pelo GitHub, por Webhook. | UC-16 |
| RF-37 | O sistema deve identificar o projeto de uma release pelo nome exato do repositório no GitHub. | UC-16 |
| RF-38 | O sistema deve registrar a release com versão, changelog, data de lançamento e identificador do GitHub. | UC-16 |
| RF-39 | O sistema não deve registrar a mesma release do GitHub mais de uma vez. | UC-16 |
| RF-40 | O sistema deve descartar eventos de repositórios que não correspondam a nenhum projeto cadastrado. | UC-16 |
| RF-41 | O sistema deve rejeitar requisições do GitHub que não sejam legítimas, sem registrar nada. | UC-16 |

---

## 3. Regras de Negócio (RN)

### 3.1 Vínculos e cardinalidades

Decorrem diretamente das cardinalidades `(min, max)` de [`modelo-conceitual.md`](./modelo-conceitual.md).

| ID | Regra | Origem no modelo |
|---|---|---|
| RN-01 | Todo projeto pertence a exatamente 1 perfil e não pode existir sem vínculo. Um perfil pode ter zero ou vários projetos. | Perfil ↔ Projetos `(0,N)` / `(1,1)` |
| RN-02 | Todo certificado pertence a exatamente 1 perfil. Um perfil pode ter zero ou vários certificados. | Perfil ↔ Certificados `(0,N)` / `(1,1)` |
| RN-03 | Toda release pertence a exatamente 1 projeto. Um projeto pode ter zero ou várias releases. | Projetos ↔ Releases `(0,N)` / `(1,1)` |
| RN-04 | Todo projeto utiliza **ao menos 1** tecnologia, podendo utilizar várias. | Projetos ↔ Tecnologias `(1,N)` |
| RN-05 | Uma tecnologia pode existir no catálogo sem estar vinculada a nenhum projeto, ou ser utilizada em vários. | Tecnologias ↔ Projetos `(0,N)` |
| RN-06 | Um usuário se vincula a no máximo 1 perfil. Contas de convidado ou de teste podem não ter perfil. | Usuarios ↔ Perfil `(0,1)` |
| RN-07 | Todo perfil deve ser gerenciado por **ao menos 1** usuário com papel `ADMIN`. Por isso, o último `ADMIN` de um perfil não pode ser excluído nem ter o papel alterado. | Perfil ↔ Usuarios `(1,N)` |
| RN-08 | Um usuário com papel `ADMIN` deve estar vinculado a um perfil. | Consequência de RN-06 e RN-07 |

### 3.2 Unicidade

| ID | Regra |
|---|---|
| RN-09 | O *slug* de cada projeto é único, pois identifica a URL do projeto. |
| RN-10 | O e-mail de acesso de cada usuário é único. |
| RN-11 | Cada release do GitHub é registrada no máximo uma vez, identificada pelo ID gerado pelo GitHub. Releases cadastradas manualmente não possuem esse identificador. |
| RN-12 | Cada repositório do GitHub corresponde a no máximo 1 projeto, para que o projeto de uma release possa ser identificado sem ambiguidade. |
| RN-13 | Um mesmo projeto não pode ter a mesma tecnologia associada mais de uma vez. |

### 3.3 Validação dos dados

| ID | Regra |
|---|---|
| RN-14 | Todo certificado deve ter ao menos um meio de validação: o link da credencial oficial ou a imagem do comprovante. |
| RN-15 | O papel de um usuário só pode ser `ADMIN` ou `GUEST`. |
| RN-16 | Os campos obrigatórios de cada registro devem estar preenchidos para que ele seja salvo. |

### 3.4 Exclusão de registros

| ID | Regra |
|---|---|
| RN-17 | Ao excluir um projeto, suas releases e suas associações com tecnologias são removidas junto. As tecnologias e o perfil permanecem. |
| RN-18 | Uma tecnologia associada a algum projeto não pode ser excluída. Tecnologias sem uso podem ser excluídas livremente. |
| RN-19 | Um perfil que ainda tenha projetos, certificados ou usuários vinculados não pode ser excluído. |
| RN-20 | Releases e certificados podem ser excluídos livremente, pois nenhuma outra informação depende deles. |

### 3.5 Acesso e permissões

| ID | Regra |
|---|---|
| RN-21 | O conteúdo público (projetos, perfil, certificados e currículo) é visível a qualquer visitante, sem login. |
| RN-22 | O Painel de Controle só é acessível a usuários autenticados, com papel `ADMIN` ou `GUEST`. |
| RN-23 | Somente o papel `ADMIN` pode criar, alterar, excluir registros ou enviar arquivos. O papel `GUEST` tem acesso somente leitura. |

---

## 4. Requisitos Não Funcionais (RNF)

### 4.1 Segurança

| ID | Requisito |
|---|---|
| RNF-01 | As senhas devem ser armazenadas somente como hash criptografado. A senha em texto puro nunca é guardada nem registrada em logs. |
| RNF-02 | Todas as rotas e ações do painel de controle devem exigir autenticação. Sem sessão válida, o acesso é negado e o usuário é redirecionado para o login. |
| RNF-03 | A autorização por papel deve ser verificada **no servidor**, em toda requisição de escrita. Ocultar ou desabilitar botões na interface não substitui essa verificação. |
| RNF-04 | Uma requisição recusada por falta de permissão não pode alterar nenhum dado. |
| RNF-05 | A mensagem de falha de login deve ser genérica e não revelar se o e-mail ou a senha está incorreto. |
| RNF-06 | As requisições do Webhook do GitHub devem ser verificadas antes de processadas, por exemplo com um segredo compartilhado. |
| RNF-07 | Em produção, toda a comunicação com o sistema deve ocorrer por conexão criptografada (HTTPS). |
| RNF-08 | Segredos e credenciais (senha do banco, segredo do Webhook, chaves de sessão) não devem ficar no código-fonte do repositório. |

### 4.2 Integridade dos dados

| ID | Requisito |
|---|---|
| RNF-09 | A base de dados deve impor restrições de **integridade referencial** (chaves estrangeiras) para os vínculos obrigatórios: projeto para perfil, certificado para perfil e release para projeto (RN-01, RN-02, RN-03), além das ligações entre projetos e tecnologias. Assim, nenhum registro crítico fica órfão, mesmo que a aplicação falhe. |
| RNF-10 | As regras de campos obrigatórios e de unicidade (RN-09 a RN-13, RN-16) devem ser garantidas por restrições da própria base de dados, e não apenas pela aplicação. |
| RNF-11 | As regras que não podem ser expressas somente por restrições do banco, como o mínimo de 1 tecnologia por projeto (RN-04) e de 1 `ADMIN` por perfil (RN-07), devem ser validadas pela aplicação dentro da mesma operação que altera os dados. Uma operação que viole a regra deve ser recusada. |
| RNF-12 | Operações que alteram vários registros, como criar um projeto com suas tecnologias ou excluir um projeto com suas releases, devem ser atômicas: ou tudo é aplicado, ou nada é. |
| RNF-13 | As datas de criação e de última alteração dos registros devem ser mantidas automaticamente pelo sistema. |

### 4.3 Usabilidade

| ID | Requisito |
|---|---|
| RNF-14 | **Projetos**, **Perfil & Currículo** e **Certificados** devem estar a 1 clique de distância a partir de qualquer tela pública, e o download do currículo também. |
| RNF-15 | A interface deve ser responsiva, funcionando em computadores, tablets e celulares. |
| RNF-16 | A interface deve manter o foco no conteúdo profissional, sem jogos, sem elementos de distração e sem terminologias confusas. |
| RNF-17 | As mensagens de erro e de recusa devem ser claras e indicar o que o usuário precisa corrigir. |

### 4.4 Desempenho e manutenção

| ID | Requisito |
|---|---|
| RNF-18 | As telas públicas devem carregar com rapidez perceptível, mesmo com várias imagens de capa e de comprovantes, o que exige imagens otimizadas. |
| RNF-19 | Todo o conteúdo do portfólio (perfil, projetos, tecnologias, certificados e releases) e os arquivos de imagem e PDF devem poder ser mantidos pelo painel, sem necessidade de alterar o código do site. |
| RNF-20 | Os arquivos enviados pelo painel devem ficar em armazenamento externo ao banco de dados, que guarda apenas a URL de cada arquivo. O sistema deve aceitar somente os tipos de arquivo esperados (imagens e PDF) e respeitar um tamanho máximo, definidos na implementação. |

---

## 5. Rastreabilidade

A tabela relaciona cada caso de uso aos requisitos e regras que o sustentam.

| Caso de uso | Requisitos Funcionais | Regras de Negócio | Requisitos Não Funcionais |
|---|---|---|---|
| UC-01 | RF-01, RF-02, RF-07 | RN-21 | RNF-14, RNF-15, RNF-18 |
| UC-02 | RF-03, RF-04, RF-08 | RN-21 | RNF-14, RNF-15 |
| UC-03 | RF-05, RF-07 | RN-21 | RNF-14, RNF-16 |
| UC-04 | RF-06, RF-07 | RN-03, RN-21 | RNF-14 |
| UC-05 | RF-09, RF-10, RF-11 | RN-21 | RNF-14 |
| UC-06 | RF-12, RF-13 | RN-21 | RNF-14 |
| UC-07 | RF-07, RF-14 | RN-02, RN-21 | RNF-14, RNF-18 |
| UC-08 | RF-15, RF-16 | RN-21 | RNF-14 |
| UC-09 | RF-17, RF-18, RF-19 | RN-14, RN-21 | RNF-07 |
| UC-10 | RF-20 a RF-24, RF-42 | RN-10, RN-15, RN-22 | RNF-01, RNF-02, RNF-05, RNF-07 |
| UC-11 | RF-24, RF-25, RF-26 | RN-23 | RNF-03, RNF-04 |
| UC-12 | RF-27 a RF-31, RF-35, RF-44, RF-45 | RN-01, RN-04, RN-09, RN-13, RN-16, RN-17 | RNF-09 a RNF-13, RNF-19, RNF-20 |
| UC-13 | RF-31, RF-32, RF-35, RF-44, RF-45 | RN-05, RN-16, RN-18 | RNF-09, RNF-11, RNF-19, RNF-20 |
| UC-14 | RF-31, RF-33, RF-35, RF-44, RF-45 | RN-02, RN-14, RN-16, RN-20 | RNF-09, RNF-19, RNF-20 |
| UC-15 | RF-31, RF-34, RF-35 | RN-03, RN-11, RN-16, RN-20 | RNF-09, RNF-19 |
| UC-16 | RF-36 a RF-41 | RN-03, RN-11, RN-12 | RNF-06, RNF-08 |
| UC-17 | RF-35, RF-43, RF-44, RF-45 | RN-16 | RNF-19, RNF-20 |

---

## 6. Premissas e Pontos em Aberto

1. **Regras de exclusão (RN-17 a RN-20).** Consolidam os comportamentos implícitos nos casos de uso (por exemplo, a exclusão de um projeto removendo seu histórico de releases). Foram adotadas como regras do sistema.
2. **Metas numéricas.** Os requisitos de desempenho (RNF-18) e de segurança não definem valores como tempo máximo de carregamento ou tempo de expiração da sessão. Esses números serão definidos na implementação.
3. **Boas práticas acrescentadas.** HTTPS (RNF-07), segredos fora do código (RNF-08) e interface responsiva (RNF-15) não constavam na ideia inicial e foram incluídos como padrão para um portfólio profissional.
4. **Entrada do convidado (RF-21).** Mantém a premissa de [`casos-de-uso.md`](./casos-de-uso.md): um botão **Entrar como convidado** que autentica direto a conta `GUEST`.
5. **Grade do curso.** Foi adotada como opcional: o modal de detalhes a omite quando o certificado não a tem (RF-19).
6. **Limites de upload.** O serviço de armazenamento externo, os tipos de arquivo aceitos e o tamanho máximo (RF-44, RF-45 e RNF-20) serão definidos na implementação.