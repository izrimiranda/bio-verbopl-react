# ✅ Migração para MySQL - Concluída

## 📊 Resumo das Alterações

### 1. Backend PHP Criado

**Pasta: `/api`**

- ✅ `config.php` - Configuração do banco MySQL + funções auxiliares
- ✅ `events.php` - CRUD completo de eventos (GET, POST, PUT, DELETE)
- ✅ `reorder.php` - Reordenação de eventos
- ✅ `auth.php` - Autenticação de admin com hash bcrypt
- ✅ `test-connection.php` - Script de teste de conexão
- ✅ `.htaccess` - Configurações Apache (CORS, segurança)

### 2. Frontend Atualizado

**Arquivos modificados:**

- ✅ `services/storageService.ts` - Migrado de localStorage para API REST (async/await)
- ✅ `pages/Home.tsx` - Carregamento assíncrono de eventos
- ✅ `pages/Admin.tsx` - CRUD assíncrono + autenticação via API
- ✅ `vite.config.ts` - Proxy configurado para `/api`

### 3. Configurações

- ✅ `.htaccess` (raiz) - Roteamento SPA + cache + segurança
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `README_DATABASE.md` - Documentação completa

### 4. Banco de Dados

**Credenciais configuradas:**
```
Host: srv723.hstgr.io
Database: u959347836_links
Username: u959347836_adminlink
Password: z00[jZ0Z|
```

**Tabelas utilizadas:**
- `DB_LINK` - Eventos/Links
- `DB_ADMIN` - Autenticação

## 🚀 Como Usar

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Rodar servidor:**
```bash
npm run dev
```

O servidor Vite vai rodar na porta 3000 e fazer proxy das requisições `/api` para `https://verbopedroleopoldo.com.br/bio/api`

### Testar API

Acesse no navegador:
```
http://localhost:3000/api/test-connection.php
```

Você deve ver um JSON com o status de todos os testes.

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

## 📝 Endpoints da API

### Eventos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/events.php` | Lista todos os eventos |
| POST | `/api/events.php` | Cria novo evento |
| PUT | `/api/events.php` | Atualiza evento |
| DELETE | `/api/events.php?id=X` | Deleta evento |

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth.php` | Autentica admin |

### Reordenação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/reorder.php` | Reordena eventos |

## 🔐 Senha Admin

A senha está armazenada em hash bcrypt na tabela `DB_ADMIN`.

Hash atual: `$2y$10$cecpgM.p6s5s97ZL0Zh.oOeMx8rrLHRq6QfPNjLtlRSSHWUR70ehm`

Para atualizar a senha:
```php
<?php
// Gerar novo hash
$newHash = password_hash('sua_nova_senha', PASSWORD_DEFAULT);

// Atualizar no banco
UPDATE DB_ADMIN SET SENHA_HASH = '$newHash' WHERE ID = 1;
```

## 🎨 Paleta de Cores Atualizada

As cores foram atualizadas para a identidade visual da Verbo PL:

```css
--primary-dark: #383f51
--secondary-dark: #2c3340
--tertiary-dark: #1e2329
--primary-beige: #bca488
--secondary-beige: #c7a687
--tertiary-beige: #d4b496
```

## ⚠️ Importante

### Desenvolvimento
- O proxy do Vite redireciona `/api` para a URL de produção
- Você pode testar localmente sem precisar configurar PHP

### Produção
1. Fazer upload de todos os arquivos para o servidor
2. Garantir que a pasta `api/` está acessível
3. Verificar permissões de escrita (se houver upload de imagens)
4. Configurar HTTPS (recomendado)

## 📦 Estrutura de Pastas

```
bio-verbopl-react/
├── api/                      # Backend PHP
│   ├── config.php           # ✅ Configuração BD
│   ├── events.php           # ✅ CRUD eventos
│   ├── reorder.php          # ✅ Reordenação
│   ├── auth.php             # ✅ Autenticação
│   ├── test-connection.php  # ✅ Teste
│   └── .htaccess            # ✅ Apache config
├── components/
├── data/
│   └── Dump20251130.sql     # Estrutura BD
├── pages/
├── services/
│   └── storageService.ts    # ✅ Atualizado (API)
├── .htaccess                # ✅ Criado
├── .env.example             # ✅ Criado
├── vite.config.ts           # ✅ Atualizado (proxy)
└── README_DATABASE.md       # ✅ Documentação
```

## ✨ Próximos Passos

- [ ] Testar API no servidor de produção
- [ ] Configurar upload de imagens (opcional)
- [ ] Implementar JWT para tokens de sessão (opcional)
- [ ] Adicionar logs de auditoria (opcional)
- [ ] Configurar backup automático do BD (recomendado)

---

**Migração concluída com sucesso!** 🎉

Desenvolvido para a Igreja Verbo da Vida - Pedro Leopoldo
