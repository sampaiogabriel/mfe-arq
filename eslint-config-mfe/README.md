# MFE - ESLINT

Exportação das configurações do EsLint

## Configurações incluídas

- Standard config base;
- React plugin;
- React Hooks plugin;
- JSX a11y plugin;
- Prettier;
- Import parse;

## Instalação

Rode o seguinte comando no terminal
```
npm i -D eslint @sampaiogabriel/eslint-config-mfe
```
Ou
```
yarn add eslint @sampaiogabriel/eslint-config-mfe --save-dev
```

## Scripts 

```json
  scripts: {
    "lint": "eslint src --ext js,ts,tsx",
    "lint:create-config": "yarn lint:update && yarn lint:create-eslintrc",
    "lint:update": "yarn add @sampaiogabriel/eslint-config-mfe@latest --dev",
    "lint:create-eslintrc": "echo { \"extends\": \"@sampaiogabriel/eslint-config-mfe\" } > temp_eslintrc.json && move /Y temp_eslintrc.json .eslintrc.json"
  }
```

Após a primeira instalação, rode o script:

```bash
lint:create-config
```

O projeto criará o arquivo para realizar a importação das configurações do EsLint.

Para manter atualizado, basta rodar o script:
```bash
lint:update
```