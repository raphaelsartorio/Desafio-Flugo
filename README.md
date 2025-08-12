# FLUGO — Frontend (Vite + React + TypeScript + MUI)

Guia rápido para rodar o projeto localmente em ambiente de desenvolvimento no Windows.

## Requisitos

- Node.js 18+ (recomendado LTS atual)
- npm 9+ (vem com o Node)

Verifique versões:

```powershell
node -v
npm -v
```

## Instalação

```powershell
npm install
```

## Desenvolvimento (hot-reload)

Inicie o servidor de desenvolvimento do Vite:

```powershell
npm run dev
```

Acesse a aplicação no navegador (o Vite exibirá a URL ao iniciar, geralmente):
- http://localhost:5173/

## Lint (análise estática)

```powershell
npm run lint
```

## Build de produção

Gere os artefatos otimizados:

```powershell
npm run build
```

Pré-visualize localmente o build gerado:

```powershell
npm run preview
```

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — compila TypeScript e gera o build de produção
- `npm run preview` — serve o build gerado para inspeção
- `npm run lint` — roda o ESLint

## Firebase (configuração)

O projeto já está configurado em `src/firebase.ts`. Para usar outras credenciais, você pode:
- criar variáveis de ambiente Vite (`.env`) e ler via `import.meta.env`.

Exemplo de `.env` (opcional):

```env
VITE_FIREBASE_API_KEY=... 
VITE_FIREBASE_AUTH_DOMAIN=... 
VITE_FIREBASE_PROJECT_ID=... 
VITE_FIREBASE_STORAGE_BUCKET=... 
VITE_FIREBASE_MESSAGING_SENDER_ID=... 
VITE_FIREBASE_APP_ID=... 
VITE_FIREBASE_MEASUREMENT_ID=...
```

Observação: chaves do Firebase no front-end são públicas por natureza. Ainda assim, evite versionar `.env` com segredos sensíveis.

## Estrutura principal

- `src/` — código-fonte React/TS
- `src/components/` — componentes de UI (inclui MUI)
- `src/pages/` — páginas/rotas
- `src/firebase.ts` — inicialização do Firebase

## Solução de problemas

- Porta ocupada (5173):
  - Encerre o processo que usa a porta ou rode `npm run dev` e escolha outra porta quando solicitado.
- Versão do Node incompatível:
  - Atualize para Node 18+ e reinstale dependências: `rm -r node_modules; npm install`
- Cache corrompido:
  - `npm cache verify; npm ci` (ou `npm install`)

---

Se precisar de ajuda adicional para configurar variáveis de ambiente ou deploy, abra uma issue ou descreva seu cenário.
