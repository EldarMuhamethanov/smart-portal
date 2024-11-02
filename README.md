Smart-portal - an application for interacting with smart contracts on the ethereum network. To work with the application, you need a metamask wallet for network interactions. Alternatively, you can use a locally running hardhat or foundry network.

## Application Launch Preparation

You need to create a copy of the `.env.local.example` file named `.env.dev.local` for local launch
or `.env.production.local` for production build. In the created file, you need to insert
the key from [etherscan](https://etherscan.io) into `ETHERSCAN_API_KEY`

## Local Application Launch

For development, it's sufficient to run the command

```bash
npm run dev
# or
yarn dev
```

To run the built application, you first need to build it using the command

```bash
npm run build
# or
yarn build
```

## Running using docker

You can run the application having only docker and docker-compose installed on your device.

First, you need to run the image build script:

```bash
docker-compose -f docker-compose.dev.yml build # для dev сборки приложения
# or
docker-compose -f docker-compose.prod.yml build # для prod сборки приложения
```

Second, you need to run the image launch script:

```bash
docker-compose -f docker-compose.dev.yml up -d # для dev
# or
docker-compose -f docker-compose.prod.yml up -d # для prod
```

Чтобы отключить запущенный контейнер необходимо запустить скрипт:

```bash
docker-compose -f docker-compose.dev.yml down # для dev
# or
docker-compose -f docker-compose.prod.yml down # для prod
```
