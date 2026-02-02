## 1. Instalação e Ambiente Back-end

Primeiro, entre na pasta do projeto e instale as dependências:

```
cd vistoria-api
npm install
```

## 2. Variáveis de Ambiente

Agora, crie um arquivo chamado `.env` na raiz da pasta `vistoria-api` e siga as seguintes configurações
(altere **USUARIO** e **SENHA** pelos dados do seu PostgreSQL):

```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/vistoria_db"
JWT_SECRET="supersecret"
```

## 3. Preparação do Banco de Dados

Cria as tabelas no banco de dados:

```
npx prisma migrate dev --name init
```

Popula o banco com Admin, Vendedor e motivos de reprovação:

```
npx prisma db seed
```
## 4. Execução

```
npm run start:dev
```

---

# Front-end

## 1. Instalação

Instale as dependências necessárias:

```
cd vistoria-web
npm install
```

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do front-end para apontar para a API:

```
VITE_API_URL="http://localhost:3000"
```

## 3. Execução

```
npm run dev
```

No front-end, honestamente, até o momento implementei apenas o consumo da API de login.
Portanto, para facilitar os testes e a avaliação das APIs, exportei toda a coleção do Postman relacionada ao projeto, compactei em um arquivo `.zip` e disponibilizei no Drive. Dessa forma, quem for avaliar pode importar a coleção no Postman e testar todas as rotas diretamente.

Obrigado 😃

Link:
[https://drive.google.com/file/d/1JBALLSVMZNQOEYU5hh8NhdRZP_SbNv71/view?usp=sharing](https://drive.google.com/file/d/1JBALLSVMZNQOEYU5hh8NhdRZP_SbNv71/view?usp=sharing)

---

