# Bio Verbo Pedro Leopoldo - Sistema de Eventos

Sistema de gerenciamento de eventos/links da Igreja Verbo da Vida Pedro Leopoldo.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: PHP + MySQL
- **Banco de Dados**: MySQL (MariaDB)

## 📁 Estrutura do Projeto

```
bio-verbopl-react/
├── api/                    # Backend PHP
│   ├── config.php         # Configuração do banco
│   ├── events.php         # CRUD de eventos
│   ├── reorder.php        # Reordenação
│   └── auth.php           # Autenticação
├── components/            # Componentes React
├── pages/                 # Páginas
│   ├── Home.tsx          # Página pública
│   ├── Admin.tsx         # Painel admin
│   └── Groups.tsx        # Grupos de crescimento
├── services/             # Serviços
│   └── storageService.ts # Comunicação com API
└── data/                 # Banco de dados
    └── Dump20251130.sql  # Estrutura do BD
```

## 🔧 Configuração

### 1. Banco de Dados

Credenciais configuradas em `api/config.php`:
- **Host**: srv723.hstgr.io
- **Database**: u959347836_links
- **Username**: u959347836_adminlink
- **Password**: z00[jZ0Z|

### 2. Tabelas Principais

**DB_LINK** - Eventos/Links
- ID (bigint)
- NOME_EVENTO (varchar 255)
- LINK (varchar 500)
- CAMINHO_CAPA (varchar 255)
- ORDEM (int)
- ATIVO (tinyint)
- DATA_INICIO (date)
- DATA_FIM (date)

**DB_ADMIN** - Autenticação
- ID (bigint)
- SENHA_HASH (varchar 255)
- ULTIMO_ACESSO (date)

### 3. Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎨 Paleta de Cores

Cores oficiais da Verbo Pedro Leopoldo:

```css
--primary-dark: #383f51
--secondary-dark: #2c3340
--tertiary-dark: #1e2329
--primary-beige: #bca488
--secondary-beige: #c7a687
--tertiary-beige: #d4b496
```

## 🔐 Autenticação

A senha de admin está armazenada com hash bcrypt na tabela `DB_ADMIN`.

Senha atual hash: `$2y$10$cecpgM.p6s5s97ZL0Zh.oOeMx8rrLHRq6QfPNjLtlRSSHWUR70ehm`

Para gerar novo hash:
```php
<?php
echo password_hash('sua_senha', PASSWORD_DEFAULT);
?>
```

## 📡 API Endpoints

### GET /api/events.php
Lista todos os eventos

### POST /api/events.php
Cria novo evento
```json
{
  "name": "Nome do Evento",
  "link": "https://...",
  "coverImage": "https://...",
  "active": true,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

### PUT /api/events.php
Atualiza evento existente
```json
{
  "id": "1",
  "name": "Nome Atualizado",
  ...
}
```

### DELETE /api/events.php?id=1
Deleta evento

### POST /api/reorder.php
Reordena eventos
```json
{
  "fromIndex": 0,
  "toIndex": 2
}
```

### POST /api/auth.php
Autenticação admin
```json
{
  "password": "senha"
}
```

## 🌐 Deploy

### Servidor Web (Apache/nginx)

1. Fazer upload de todos os arquivos para o servidor
2. Garantir que o diretório `api/` está acessível
3. Configurar CORS se necessário
4. Apontar domínio para o `index.html` do build

### Build

```bash
npm run build
```

Os arquivos gerados na pasta `dist/` devem ser enviados para o servidor.

## 📝 Observações

- As imagens dos eventos podem ser URLs completas ou caminhos relativos
- O sistema filtra eventos automaticamente por:
  - Status ativo/inativo
  - Data de início (se definida)
  - Data de fim (se definida)
- A ordenação é feita pelo campo `ORDEM` no banco

## 🆘 Suporte

Para dúvidas ou problemas, contate o departamento de tecnologia.

---

**Igreja Verbo da Vida - Pedro Leopoldo**  
© 2025 - Todos os direitos reservados
