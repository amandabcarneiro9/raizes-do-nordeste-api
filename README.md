# Raízes do Nordeste API

API REST desenvolvida para o estudo de caso da rede de restaurantes Raízes do Nordeste.

O projeto foi desenvolvido em Node.js com TypeScript e tem como objetivo gerenciar usuários, unidades, produtos, estoque, pedidos e pagamentos.

O fluxo principal implementado é:

**Pedido → Pagamento → Atualização de status**

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL 17
- Prisma ORM
- Docker e Docker Compose
- JWT para autenticação
- bcrypt para hash de senhas
- Swagger / OpenAPI
- Postman

## Pré-requisitos

Para executar o projeto é necessário ter instalado:

- Node.js 24
- npm
- PostgreSQL 17 ou Docker com Docker Compose

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd raizes-do-nordeste-api
```

Instale as dependências:

```bash
npm ci
```

Crie o arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

O projeto utiliza as seguintes variáveis de ambiente:

```env
DATABASE_URL="postgresql://raizes:raizes123@localhost:5432/raizes_do_nordeste"
JWT_SECRET="substitua-por-uma-chave-secreta"
```

O arquivo `.env` não deve ser versionado no repositório.

## Configuração do PostgreSQL

O projeto utiliza PostgreSQL 17. É possível executar o banco com Docker ou utilizar uma instalação local do PostgreSQL.

### Opção A — Utilizando Docker

Com Docker e Docker Compose instalados, execute:

```bash
docker compose up -d
```

O Docker Compose inicia o PostgreSQL e cria o banco `raizes_do_nordeste` com as configurações utilizadas pelo projeto.

Para verificar se o container está em execução:

```bash
docker ps
```

Depois disso, continue na seção **Preparando a estrutura do banco de dados**.

### Opção B — Sem Docker

Caso não utilize Docker, é necessário ter o PostgreSQL 17 instalado e em execução no computador.

Crie manualmente um banco chamado:

```text
raizes_do_nordeste
```

Configure no arquivo `.env` um usuário e senha válidos da sua instalação do PostgreSQL:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/raizes_do_nordeste"
```

Por exemplo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizes_do_nordeste"
```

A porta padrão do PostgreSQL é `5432`. Caso sua instalação utilize outra porta, ajuste a `DATABASE_URL`.

Depois disso, continue com os mesmos passos abaixo.

## Preparando a estrutura do banco de dados

> Esta etapa deve ser realizada tanto utilizando Docker quanto utilizando PostgreSQL local.

Com o PostgreSQL em execução, aplique as migrations existentes:

```bash
npx prisma db migrate
```

As migrations criam as tabelas e demais estruturas necessárias para a aplicação.

Em seguida, gere os arquivos utilizados pelo Prisma:

```bash
npx prisma contract emit
```

Execute o seed:

```bash
npm run seed
```

O seed cria o usuário administrador inicial para os testes da API:

```text
E-mail: admin@raizes.com
Senha: Admin123!
Perfil: ADMIN
```

Essas credenciais são destinadas exclusivamente ao ambiente local de desenvolvimento e testes.

## Executando a API

Após configurar o PostgreSQL, aplicar as migrations e executar o seed, inicie a aplicação:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

Para verificar se a aplicação está funcionando, execute:

```bash
curl http://localhost:3000/health
```

A documentação Swagger está disponível em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

````

## Autenticação e controle de acesso

A API utiliza autenticação baseada em **JWT (JSON Web Token)**.

O login é realizado através do endpoint:

```http
POST /auth/login
````

Exemplo de requisição:

```json
{
	"email": "admin@raizes.com",
	"senha": "Admin123!"
}
```

Quando as credenciais são válidas, a API retorna um token JWT que deve ser enviado nas requisições para rotas protegidas:

```text
Authorization: Bearer <token>
```

As senhas não são armazenadas diretamente no banco de dados. Antes do armazenamento, é gerado um hash utilizando `bcrypt`.

### Perfis de acesso

A aplicação possui controle de acesso baseado no perfil do usuário.

Os perfis utilizados são:

- `ADMIN` — possui acesso às operações administrativas da API.
- `ATENDENTE` — usuário autenticado com acesso limitado às operações permitidas para esse perfil.

Algumas operações de cadastro e gerenciamento, como criação de produtos, unidades, estoque e usuários, são restritas ao perfil `ADMIN`.

A API utiliza os seguintes códigos HTTP para controle de acesso:

- `401 Unauthorized` — token ausente, inválido ou expirado.
- `403 Forbidden` — usuário autenticado, mas sem permissão para executar a operação.

## Fluxo principal

O MVP implementado neste projeto corresponde ao fluxo:

**Pedido → Pagamento → Atualização de status**

### 1. Criação do pedido

Ao criar um pedido, a API:

1. verifica se a unidade existe;
2. verifica se os produtos informados existem;
3. verifica a disponibilidade dos produtos no estoque da unidade;
4. calcula o valor total;
5. cria o pedido e seus itens;
6. atualiza o estoque;
7. registra o status inicial do pedido no histórico.

Um pedido recém-criado inicia com o status:

```text
CRIADO
```

O pedido também registra o canal em que foi realizado:

```text
APP
TOTEM
BALCAO
PICKUP
WEB
```

### 2. Pagamento

O pagamento é uma simulação de integração com um serviço externo.

Para fins acadêmicos e de testes, a API permite simular dois resultados:

```text
APROVADO
NEGADO
```

Quando o pagamento é aprovado, o pagamento é registrado com status `APROVADO` e o pedido é atualizado para:

```text
PAGO
```

A mudança também é registrada no histórico de status do pedido.

Quando o pagamento é negado, o pagamento é registrado como `NEGADO` e o pedido permanece com status `CRIADO`, permitindo uma nova tentativa de pagamento.

## Documentação da API com Swagger

A API possui documentação interativa desenvolvida com Swagger/OpenAPI.

O Swagger apresenta os endpoints disponíveis, métodos HTTP, parâmetros, corpos das requisições, respostas esperadas e códigos de status.

### Como testar os endpoints

Para testar um endpoint pelo Swagger:

1. Abra o endpoint desejado.
2. Clique em **Try it out**.
3. Preencha os parâmetros ou o corpo da requisição, quando necessário.
4. Clique em **Execute**.
5. A resposta da API será exibida na própria página, incluindo o código HTTP e o JSON retornado.

Alguns endpoints podem ser utilizados sem autenticação. As operações protegidas exigem um token JWT.

### Autenticação no Swagger

As rotas protegidas são identificadas pelo ícone de cadeado 🔒.

Para utilizá-las, primeiro obtenha um token através do endpoint:

```http
POST /auth/login
```

Clique em **Try it out** e informe as credenciais do administrador:

```json
{
	"email": "admin@raizes.com",
	"senha": "Admin123!"
}
```

Clique em **Execute**.

A resposta da API conterá um token JWT.

Copie somente o valor do token retornado, sem aspas.

Em seguida:

1. Clique no botão **Authorize**, localizado na parte superior da página do Swagger.
2. Cole o token JWT no campo de autenticação.
3. Clique em **Authorize**.
4. Feche a janela de autenticação.

Após a autenticação, o Swagger enviará automaticamente o token nas requisições realizadas para as rotas protegidas.

Caso o token expire, realize novamente o login e informe o novo token no botão **Authorize**.

## Testes da API com Postman

O projeto possui uma Collection do Postman com os principais cenários utilizados para validar o funcionamento da API.

O arquivo está disponível em:

```text
postman/Raizes-do-nordeste.postman_collection.json
```

A Collection utiliza a variável:

```text
baseUrl = http://localhost:3000
```

### Executando os testes

1. Abra o Postman.
2. Importe o arquivo `Raizes-do-nordeste.postman_collection.json`.
3. Abra a Collection importada.
4. Execute a Collection utilizando o Collection Runner.

Os próprios requests armazenam e reutilizam automaticamente os tokens de autenticação e os IDs criados durante a execução. Dessa forma, não é necessário preencher manualmente os IDs de produtos, unidades ou pedidos.

### Cenários testados

A Collection cobre cenários positivos e negativos, incluindo:

- login válido como administrador;
- tentativa de login com senha inválida;
- login como atendente;
- criação de produto como administrador;
- tentativa de criação de produto sem autenticação;
- tentativa de criação de produto com perfil sem permissão;
- criação de unidade;
- criação de estoque;
- criação de pedido válido;
- tentativa de pedido com produto inexistente;
- tentativa de pedido com estoque insuficiente;
- pagamento aprovado;
- atualização do pedido para `PAGO`;
- pagamento negado;
- manutenção de um estado coerente do pedido após pagamento negado.

A execução completa da Collection foi validada com todos os testes passando.

## Estrutura do projeto

A aplicação foi organizada em camadas, separando as responsabilidades de rotas, controllers, services, persistência e documentação.

```text

raizes-do-nordeste-api/
├── migrations/
│   ├── app/
│   │   ├── 20260929T1022_init/
│   │   ├── 20260929T1030_add_unidade_produto_estoque/
│   │   ├── 20260929T1037_add_pedido_item_pedido/
│   │   └── 20260929T1144_add_pagamento_historico_status/
│   └── snapshots/
│
├── postman/
│   └── Raizes-do-nordeste.postman_collection.json
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── estoque.controller.ts
│   │   ├── pagamento.controller.ts
│   │   ├── pedido.controller.ts
│   │   ├── produto.controller.ts
│   │   ├── unidade.controller.ts
│   │   └── usuario.controller.ts
│   │
│   ├── docs/
│   │   └── swagger.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   │
│   ├── prisma/
│   │   ├── contract.prisma
│   │   ├── contract.d.ts
│   │   ├── contract.json
│   │   └── db.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── estoque.routes.ts
│   │   ├── pagamento.routes.ts
│   │   ├── pedido.routes.ts
│   │   ├── produto.routes.ts
│   │   ├── unidade.routes.ts
│   │   └── usuario.routes.ts
│   │
│   ├── services/
│   │   ├── estoque.service.ts
│   │   ├── pagamento.service.ts
│   │   ├── pedido.service.ts
│   │   ├── produto.service.ts
│   │   ├── unidade.service.ts
│   │   └── usuario.service.ts
│   │
│   ├── seed.ts
│   └── server.ts
│
├── .env.example
├── docker-compose.yml
├── package.json
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

### Organização das camadas

- **routes** — define as rotas HTTP e direciona as requisições para os controllers.
- **controllers** — recebe e valida os dados das requisições e retorna as respostas HTTP.
- **services** — concentra as regras de negócio e operações relacionadas aos dados.
- **middlewares** — contém a autenticação JWT e o controle de acesso por perfil.
- **prisma** — contém o contrato do banco de dados e a configuração de acesso ao PostgreSQL.
- **docs** — contém a configuração da documentação Swagger/OpenAPI.
- **seed.ts** — realiza a criação dos dados iniciais necessários para execução e testes.
- **server.ts** — configura e inicializa a aplicação Express.
- **migrations** — mantém o histórico versionado das alterações realizadas na estrutura do banco de dados.
- **postman** — contém a Collection utilizada para executar e reproduzir os testes da API.

## Segurança e LGPD

O projeto adota medidas básicas de segurança e proteção de dados compatíveis com o escopo acadêmico da aplicação.

### Autenticação e autorização

A autenticação é realizada utilizando JWT (JSON Web Token).

As rotas protegidas verificam o token enviado pelo usuário e aplicam controle de acesso de acordo com o perfil (`ADMIN` ou `ATENDENTE`).

A API retorna:

- `401 Unauthorized` quando a autenticação não é fornecida ou o token é inválido ou expirado;
- `403 Forbidden` quando o usuário está autenticado, mas não possui permissão para realizar determinada operação.

### Proteção de senhas

As senhas dos usuários não são armazenadas em texto puro.

Antes de serem persistidas no banco de dados, são transformadas em hash utilizando `bcrypt`.

### Variáveis de ambiente

Informações de configuração e dados sensíveis, como a conexão com o banco e o segredo utilizado para assinatura dos tokens JWT, são armazenados em variáveis de ambiente.

O arquivo `.env` não é versionado no repositório.

O projeto disponibiliza apenas o arquivo `.env.example`, contendo a estrutura necessária para configuração do ambiente sem expor os valores utilizados localmente.

### Proteção de dados

A aplicação armazena apenas os dados necessários para as funcionalidades implementadas, como identificação do usuário, informações de cliente, pedidos e pagamentos simulados.

Dentro do escopo deste projeto acadêmico, foram consideradas práticas relacionadas à LGPD, como:

- limitação dos dados armazenados;
- controle de acesso às operações protegidas;
- proteção das credenciais dos usuários;
- uso de identificadores internos para os registros;
- não exposição de segredos de configuração no repositório.

O fluxo de pagamento implementado é uma simulação e não armazena dados reais de cartão ou outras informações financeiras sensíveis.
