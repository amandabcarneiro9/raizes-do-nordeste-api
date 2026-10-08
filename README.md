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

O PostgreSQL também pode ser executado localmente sem Docker.

## Banco de dados

A forma recomendada para executar o PostgreSQL neste projeto é utilizando Docker.

```bash
docker compose up -d
```
