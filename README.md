# 🚀 SkillRise 2030+ Frontend

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Interface moderna e responsiva para plataforma de upskilling/reskilling gamificada com trilhas personalizadas, sistema de conquistas e tracking de progresso em tempo real.

---

## 📋 Sobre

Frontend da plataforma **SkillRise 2030+** - solução React/TypeScript para preparar profissionais para o futuro do trabalho através de:

- 🎨 **Design System minimalista** com tema light/dark
- 🎮 **Gamificação visual** (XP, níveis, badges animados)
- 📊 **Dashboard interativo** com gráficos de progresso
- 🎓 **15 trilhas de aprendizado** com 50+ módulos
- 🏆 **Sistema de conquistas** com animações GSAP
- 📜 **Certificados digitais** verificáveis
- 📱 **100% responsivo** (mobile-first)

---

## 🎨 Design System

### Paleta de Cores
- **Primária:** `hsl(217, 87%, 55%)` → `#2B7FDB` (Azul tech)
- **Secundária:** `hsl(240, 5%, 26%)` (Cinza escuro)
- **Accent:** Gradientes azul → roxo
- **Background:** Branco / `#0A0A0A` (dark mode)

### Tipografia
- **Fonte:** [Figtree](https://fonts.google.com/specimen/Figtree) (Google Fonts)
- **Pesos:** 400, 500, 600, 700

### Componentes
- **shadcn/ui** - 40+ componentes prontos
- **Animações GSAP** - Microinterações fluidas
- **Ícones:** Lucide React

### Favicon
- **Arquivo:** `public/favicon.svg`
- **Design:** Foguete/seta ascendente + estrela de conquista
- **Cores:** Gradiente azul `#2B7FDB` → `#60A5FA`

---

## 🛠️ Stack Tecnológico

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript 5.6** - Tipagem estática
- **Vite 6.0** - Build tool & dev server
- **React Router 7.1** - Navegação SPA

### UI & Styling
- **TailwindCSS 3.4** - Utility-first CSS
- **shadcn/ui** - Componentes acessíveis
- **Radix UI** - Primitives para acessibilidade
- **GSAP 3.12** - Animações avançadas
- **Lucide React** - Ícones

### HTTP & Data
- **Axios 1.7** - Cliente HTTP
- **React Query** (opcional) - Cache e sync

### Dev Tools
- **ESLint** - Linting
- **TypeScript ESLint** - Regras TS
- **PostCSS** - Transformações CSS
- **Bun** - Package manager rápido

---

## 📦 Estrutura do Projeto

```
skillrise-2030/
├── public/
│   ├── favicon.svg           # Favicon com cores do projeto
│   └── robots.txt
├── src/
│   ├── assets/              # Imagens, ícones, SVGs
│   ├── components/
│   │   ├── ui/             # 40+ componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── Navbar.tsx      # Navegação principal
│   │   └── NavLink.tsx     # Links ativos
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Landing page
│   │   ├── Auth.tsx        # Login/Registro
│   │   ├── Dashboard.tsx   # Painel do usuário
│   │   ├── Trilhas.tsx     # Lista de trilhas
│   │   ├── TrilhaDetalhes.tsx  # Detalhes + módulos
│   │   ├── Perfil.tsx      # Perfil + conquistas
│   │   └── NotFound.tsx    # Página 404
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Detecção mobile
│   │   └── use-toast.ts    # Sistema de toasts
│   ├── lib/
│   │   └── utils.ts        # Helpers (cn, formatters)
│   ├── App.tsx             # Componente raiz + rotas
│   ├── main.tsx            # Entry point
│   └── index.css           # CSS global + variáveis
├── components.json          # Config shadcn/ui
├── tailwind.config.ts       # Config TailwindCSS
├── tsconfig.json            # Config TypeScript
├── vite.config.ts           # Config Vite
└── package.json
```

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Bun** (recomendado) ou npm/yarn
- **Backend rodando** em `http://localhost:8080`

### 1️⃣ Instalar Dependências

```bash
# Com Bun (recomendado - mais rápido)
bun install

# Ou com npm
npm install

# Ou com yarn
yarn install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

### 3️⃣ Executar Backend (API REST)

Certifique-se de que o backend Spring Boot está rodando:

```bash
cd ../apirest
./mvnw spring-boot:run
```

✅ Backend deve estar em: `http://localhost:8080`

### 4️⃣ Executar Frontend

```bash
# Com Bun (dev server rápido)
bun dev

# Ou com npm
npm run dev

# Ou com yarn
yarn dev
```

✅ Frontend disponível em: `http://localhost:5173`

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
bun dev              # Inicia dev server com hot reload
npm run dev          # Alternativa com npm

# Build
bun run build        # Gera build de produção em /dist
npm run build        # TypeScript check + Vite build

# Preview
bun run preview      # Visualiza build localmente
npm run preview      # Testa antes do deploy

# Linting
bun run lint         # ESLint para verificar código
npm run lint         # Encontra erros e bad practices
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes do shadcn/ui
│   ├── Navbar.tsx      # Navegação principal
│   ├── ThemeToggle.tsx # Toggle de tema
│   ├── TrilhaCard.tsx  # Card de trilha
│   ├── ModuloCard.tsx  # Card de módulo
│   ├── BadgeCard.tsx   # Card de badge
│   └── LoadingSkeletons.tsx # Componentes de loading
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Gerenciamento de autenticação
├── hooks/             # Custom hooks
│   └── useGsapAnimations.ts # Hooks de animação GSAP
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Landing page
│   ├── Auth.tsx       # Login/Cadastro
│   ├── Trilhas.tsx    # Lista de trilhas
│   ├── TrilhaDetalhes.tsx # Detalhes da trilha
│   ├── Dashboard.tsx  # Dashboard do usuário
│   ├── Perfil.tsx     # Perfil do usuário
│   └── NotFound.tsx   # Página 404
└── assets/           # Imagens e recursos
```

## ✨ Funcionalidades Implementadas

### ✅ Concluídas

- [x] Design system minimalista completo
- [x] Sistema de roteamento com React Router
- [x] Páginas principais (Index, Auth, Trilhas, Dashboard, Perfil)
- [x] Sistema de temas (dark/light mode) com toggle
- [x] Contexto de autenticação com persistência
- [x] Componentes reutilizáveis (TrilhaCard, ModuloCard, BadgeCard)
- [x] **Busca e filtros em tempo real nas trilhas**
- [x] **Loading states com skeletons em todas as páginas**
- [x] **Ordenação de conteúdo no Dashboard**
- [x] **Animações GSAP minimalistas com staggers sutis**
- [x] Página 404 personalizada
- [x] Navbar responsiva com estado de autenticação
- [x] Build sem erros TypeScript

## 🎯 Próximos Passos Sugeridos

1. **Backend Integration**: Conectar com API real para autenticação e dados
2. **Proteção de Rotas**: Implementar PrivateRoute component para rotas autenticadas
3. **Persistência de Progresso**: Salvar progresso do usuário em banco de dados
4. **Certificados Digitais**: Gerar e baixar certificados ao completar trilhas
5. **Sistema de Avaliações**: Quiz e exercícios práticos em cada módulo
6. **Comunidade**: Adicionar fórum ou chat entre alunos
7. **Notificações Push**: Sistema de notificações para lembrar de estudar
8. **Gamificação Avançada**: Sistema de pontos, rankings e recompensas

## 🎨 Padrões de Design

- **Cores de Status**:
  - Success (Verde): `#10B981` - Para itens concluídos
  - Warning (Amarelo): `#F59E0B` - Para itens em andamento
  - Destructive (Vermelho): `#EF4444` - Para erros e itens avançados
  - Info (Azul): `#3B82F6` - Cor primária

- **Níveis de Dificuldade**:
  - Iniciante: Badge verde
  - Intermediário: Badge amarelo
  - Avançado: Badge vermelho

## 📝 Scripts Disponíveis

```sh
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview da build de produção
npm run lint       # Executa linter
```

## 📄 Licença

Este projeto é parte do Global Solution da FIAP - 2ESPW

---
