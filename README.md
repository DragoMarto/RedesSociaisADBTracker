# Tracker de Seguidores (Agência do Bem)

Este projeto registra mês a mês os seguidores do Facebook e Instagram e permite atualizar os números automaticamente via API da Meta.

## ✅ Como rodar localmente

### 1) Pré-requisitos
- Node.js 18+ (necessário para o `fetch` nativo).

### 2) Configure as variáveis de ambiente
Você precisará dos IDs e do token gerado no Graph API Explorer:

- **PAGE_ID**: ID da Página do Facebook
- **IG_ID**: ID da conta Instagram Business
- **ACCESS_TOKEN**: Page Access Token

Exemplo (macOS/Linux):

```bash
export PAGE_ID="218566328214438"
export IG_ID="17841400000000000"
export ACCESS_TOKEN="SEU_TOKEN_AQUI"
```

Exemplo (Windows PowerShell):

```powershell
$env:PAGE_ID="218566328214438"
$env:IG_ID="17841400000000000"
$env:ACCESS_TOKEN="SEU_TOKEN_AQUI"
```

> ⚠️ **Nunca publique seu token em repositórios públicos.**

### 3) Inicie o servidor

```bash
npm start
```

Acesse: `http://localhost:3000`

## ✅ Atualizar seguidores automaticamente

Clique em **“Atualizar automaticamente”** para preencher os campos com os seguidores atuais.

## ✅ Fluxo manual (sem API)

Se preferir, você ainda pode preencher manualmente os números e salvar mês a mês.
