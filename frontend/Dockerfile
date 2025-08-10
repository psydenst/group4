# Use uma imagem base leve
FROM node:20-alpine

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos de dependência e instale-os para usar o cache
COPY package*.json ./
RUN npm install

# Copie o resto do código da aplicação
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "dev"]


