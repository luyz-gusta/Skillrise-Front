# SkillRise 2030+ 🚀

Plataforma de aprendizado gamificada focada em preparar profissionais para o futuro do trabalho, desenvolvendo competências essenciais para 2030+.

## 📋 Sobre o Projeto

SkillRise 2030+ é uma plataforma educacional que oferece:

- **Trilhas de Aprendizado Personalizadas**: Caminhos estruturados em áreas como IA & Automação, Ciência de Dados, Soft Skills, Green Skills, Cybersegurança e Carreiras Digitais
- **Sistema de Gamificação**: Badges, níveis, sequências diárias e progresso visual
- **Dashboard Intuitivo**: Acompanhamento de progresso, atividades pendentes e conquistas
- **Interface Moderna**: Design minimalista inspirado em Supabase e Alura

## 🎨 Design System

- **Cor Principal**: Azul único (#3B82F6) como destaque
- **Tipografia**: Figtree com títulos em UPPERCASE
- **Estilo**: Minimalista com bordas reduzidas
- **Temas**: Suporte a modo claro e escuro

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado e cache
- **Axios** para requisições HTTP
- **next-themes** para tema claro/escuro
- **GSAP** para animações profissionais minimalistas

### Backend (API REST)
- **Spring Boot** (Java 17+)
- **Spring Security** com JWT
- **Oracle Database**
- **JPA/Hibernate**
- **Swagger/OpenAPI** para documentação
- **Maven** para build

## 🚀 Como Executar

### Pré-requisitos

- **Node.js 18+** e npm
- **Java 17+** (para backend)
- **Oracle Database** (local ou Docker)
- **Maven** (incluído via wrapper)

### 🔧 Configuração Completa (Frontend + Backend)

#### 1. Backend (API REST)

```bash
# Navegar para pasta da API
cd ../apirest

# Configurar Oracle Database em application.properties
# Editar src/main/resources/application.properties:
# spring.datasource.url=jdbc:oracle:thin:@localhost:1522:FREE
# spring.datasource.username=system
# spring.datasource.password=sua_senha

# Iniciar aplicação Spring Boot
./mvnw spring-boot:run

# API estará em http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

#### 2. Frontend (React)

```sh
# Já na pasta skillrise-2030

# 1. Configure variáveis de ambiente
cat > .env << EOF
VITE_API_URL=http://localhost:8080
EOF

# 2. Instale as dependências
npm install

# 3. Execute em desenvolvimento
npm run dev

# 4. Acesse no navegador
# Frontend: http://localhost:5173
```

### 🔗 Modo Integrado (Recomendado)

Para usar a aplicação completa com backend:

1. **Inicie o backend primeiro** (veja seção Backend acima)
2. **Inicie o frontend**
3. **Acesse** http://localhost:5173
4. **Crie uma conta** ou faça login
5. **Navegue pelas trilhas** - dados virão da API real!

### 📖 Documentação da Integração

Para detalhes completos sobre a integração backend-frontend, endpoints disponíveis, autenticação JWT e troubleshooting, consulte:

**[INTEGRATION.md](./INTEGRATION.md)** - Guia completo de integração

---

## 📦 Scripts Disponíveis

```bash
# 1. Entre no diretório (se necessário)
cd skillrise-2030

# 3. Instale as dependências
npm install

# 4. Execute em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para Produção

```sh
# Build otimizado
npm run build

# Preview da build
npm run preview
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

### 🎨 Sistema de Animações

O projeto utiliza **GSAP** (GreenSock Animation Platform) com uma abordagem minimalista:

- **useStaggerAnimation**: Stagger sutil em listas (0.08s delay, 0.4s duration)
- **useFadeIn**: Fade-in suave para seções (0.5s duration)
- **useScaleIn**: Scale-in discreto para cards (0.4s duration)

Todas as animações usam `power2.out` easing e movimentos mínimos (20px vertical offset, 0.95 scale) para manter a elegância do design.

### 🔄 Warnings Restantes

- Apenas 9 warnings de `react-refresh/only-export-components` (não críticos)
- Todos relacionados a componentes do shadcn/ui que exportam constantes auxiliares

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

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte do Global Solution da FIAP - 2ESPW

## 👥 Equipe

Desenvolvido para o curso de Engenharia de Software da FIAP

---

**SkillRise 2030+** - Preparando você para o futuro do trabalho 🚀
