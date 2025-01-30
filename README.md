
# AIT Management API

Este projeto fornece uma API para gerenciar AITs (Autos de Infração de Trânsito) utilizando o NestJS. A API inclui funcionalidades para criar, atualizar, consultar e remover AITs, além de gerar um arquivo CSV com os AITs processados.

## Tecnologias Utilizadas

- **NestJS** - Framework para Node.js
- **Prisma** - ORM para interação com banco de dados
- **RabbitMQ** - Fila de mensageria
- **Yarn** - Gerenciador de pacotes

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Yarn](https://yarnpkg.com/) (Caso não tenha, instale com `npm install --global yarn`)

## Instalação

1. Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <diretorio_do_repositorio>
    ```

2. Instale as dependências utilizando o Yarn:
    ```bash
    yarn install
    ```

## Configuração do Ambiente

Este projeto utiliza variáveis de ambiente para configurar a conexão com o banco de dados e a fila de mensageria. Crie um arquivo `.env` na raiz do projeto com as variáveis a seguir:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco_de_dados
RABBITMQ_URL=amqp://localhost
```

### Como rodar o projeto usando Docker

1. Construa a imagem do Docker:
    ```bash
    docker-compose build
    ```

2. Inicie os containers:
    ```bash
    docker-compose up
    ```

Isso irá subir a aplicação, o banco de dados PostgreSQL e o RabbitMQ dentro de containers Docker.

### Como rodar a aplicação localmente (fora do Docker)

Se você preferir rodar a aplicação localmente sem o Docker, após a instalação das dependências, execute:

```bash
yarn start:dev
```

Isso vai rodar o servidor em modo de desenvolvimento na porta `3000` por padrão.

## Testes

Para rodar os testes da aplicação, utilize o seguinte comando:

```bash
yarn test
```

### Testando a Fila de Mensageria (RabbitMQ)

1. **Verifique se o RabbitMQ está em execução**: Se você estiver usando Docker, o RabbitMQ será acessível em `http://localhost:15672` (usuario: `guest`, senha: `guest`).

2. **Testando a fila de mensageria**: A aplicação utiliza RabbitMQ para processar os AITs. Para testar a fila, você pode realizar uma operação que envolva o envio de uma mensagem, como a criação de um novo AIT. A aplicação irá consumir e processar a mensagem gerando um arquivo CSV.

Por exemplo, crie um AIT utilizando o endpoint POST `/aits` e veja o RabbitMQ processando a mensagem.

### Exemplo de Teste de Criação de AIT:

Requisição POST para `http://localhost:3000/aits`:

```json
{
  "placa_veiculo": "ABC1234",
  "data_infracao": "2025-01-28T12:00:00Z",
  "descricao": "Estacionamento proibido",
  "valor_multa": 150.75
}
```

Isso deve gerar uma nova entrada na fila de RabbitMQ, e você poderá acompanhar o processamento.

## Rotas e Endpoints

- **POST /aits**: Cria um novo AIT
- **GET /aits**: Recupera todos os AITs com paginação
- **GET /aits/:placaVeiculo**: Recupera AITs filtrados por placa de veículo
- **PUT /aits/:id**: Atualiza um AIT
- **DELETE /aits/:id**: Deleta um AIT
- **POST /aits/gerar-csv**: Gera um arquivo CSV com os AITs processados

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
