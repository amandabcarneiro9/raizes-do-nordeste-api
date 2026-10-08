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

## Autenticação e controle de acesso

A API utiliza autenticação baseada em **JWT (JSON Web Token)**.

O login é realizado através do endpoint:

```http
POST /auth/login
```

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
