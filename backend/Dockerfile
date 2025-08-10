# Use uma imagem base leve
FROM node:20-alpine

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos de dependência e instale-os para usar o cache
COPY package*.json ./
RUN npm install

# Copie todo o resto do código da aplicação
COPY . .

# Expõe a porta que o Fastify usa
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]


