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

- Node.js
- npm
- Docker e Docker Compose

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd raizes-do-nordeste-api
```

Instale as dependências:

```bash
npm install
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

Para verificar se a aplicação está funcionando:

```text
http://localhost:3000/health
```

A documentação Swagger está disponível em:

```text
http://localhost:3000/api-docs
```
