# Análise do Projeto Light_Estudo — Fase 1 (Frontend)

> **Observação:** Este documento é uma análise estática do repositório no seu estado atual. Nenhuma modificação foi feita no código existente.

---

## 1. Estado Atual do Repositório

O repositório encontra-se em estado **embrionário**. A única entrega presente é um arquivo `README.md` gerado automaticamente pelo template padrão do Google AI Studio, sem nenhum conteúdo relacionado ao projeto real.

---

## 2. Bugs e Problemas Identificados

### 2.1 README.md — Conteúdo de Template sem Personalização
**Severidade:** Alta  
**Descrição:** O arquivo `README.md` contém exclusivamente o conteúdo padrão do template "Built with AI Studio" da Google. Isso significa que o repositório não comunica nada sobre o propósito, a stack tecnológica, ou as instruções de uso do projeto.  
**Impacto:** Qualquer colaborador ou revisão de código não terá contexto sobre o que o projeto faz ou como executá-lo.

### 2.2 Ausência de Código-Fonte
**Severidade:** Crítica (considerando que é Fase 1)  
**Descrição:** Não há nenhum arquivo de código-fonte no repositório (HTML, CSS, JavaScript, TypeScript, etc.). Sem código, não é possível avaliar a qualidade técnica do frontend.  
**Impacto:** O repositório não reflete o estado real do desenvolvimento do projeto.

### 2.3 Ausência de `.gitignore`
**Severidade:** Média  
**Descrição:** Não há um arquivo `.gitignore` configurado. Quando o código for adicionado, arquivos de dependências (`node_modules/`), builds (`dist/`, `build/`), variáveis de ambiente (`.env`) e arquivos de sistema (`.DS_Store`, `Thumbs.db`) poderão ser acidentalmente versionados.  
**Impacto:** Poluição do histórico git, exposição de dados sensíveis e repositório muito pesado.

### 2.4 Ausência de Controle de Dependências
**Severidade:** Média  
**Descrição:** Não há `package.json` (ou equivalente para o gerenciador de pacotes escolhido). Sem esse arquivo, não é possível instalar dependências de forma reproduzível.  
**Impacto:** Dificuldade em configurar o ambiente de desenvolvimento e inconsistências entre versões de dependências.

---

## 3. Pontos de Melhoria

### 3.1 Estrutura de Pastas Recomendada (Thin Frontend)
Para um frontend thin (que delega os cálculos ao backend), sugere-se a seguinte organização:

```
Light_Estudo/
├── public/             # Arquivos estáticos (favicon, imagens)
├── src/
│   ├── assets/         # CSS, imagens, fontes
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas/views
│   ├── services/       # Módulos de chamadas à API (backend)
│   └── utils/          # Funções utilitárias puras de UI
├── .gitignore
├── package.json
└── README.md
```

### 3.2 README.md
O README deve ser completamente reescrito e conter, no mínimo:
- **Descrição do projeto**: O que é o Light_Estudo e qual problema resolve.
- **Tecnologias utilizadas**: Stack do frontend (ex.: React, Vue, HTML/CSS puro, etc.).
- **Pré-requisitos**: Versão do Node.js, gerenciador de pacotes, etc.
- **Instruções de instalação e execução**: Passo a passo para rodar localmente.
- **Estrutura do projeto**: Explicação das pastas principais.
- **Roadmap**: Fases planejadas (Fase 1: Frontend, Fase 2: Backend com cálculos).
- **Contribuição**: Guia de como contribuir (branch naming, pull requests).

### 3.3 Definição Clara da Responsabilidade do Frontend (Thin)
Como o projeto é explicitamente um "thin frontend":
- O frontend **não deve conter lógica de cálculo**. Toda validação numérica e computação deve ser postergada para o backend.
- O frontend deve se limitar a: coleta de inputs do usuário, exibição de resultados, validação de campos obrigatórios/tipos básicos (ex.: campo não pode estar vazio, valor deve ser número positivo), e chamadas à API REST do backend.
- É recomendado criar um módulo `src/services/api.js` (ou equivalente) como **única camada de comunicação** com o backend, facilitando a troca de URL base e tratamento centralizado de erros HTTP.

### 3.4 Configuração de Linting e Formatação de Código
**Recomendação:** Configurar desde o início:
- **ESLint** (ou Biome): Para garantir qualidade e consistência de código.
- **Prettier** (ou Biome): Para formatação automática.
- **EditorConfig** (`.editorconfig`): Para padronizar indentação e quebras de linha entre editores.

Isso evita debates de estilo e mantém o histórico git limpo (sem commits de "apenas formatação").

### 3.5 Configuração de CI Básico
**Recomendação:** Adicionar um workflow básico no GitHub Actions (`.github/workflows/ci.yml`) que execute, a cada push/PR:
1. Instalação de dependências
2. Lint
3. Build de verificação

Isso garante que nenhum código quebrado seja integrado à branch principal.

### 3.6 Gestão de Variáveis de Ambiente
**Recomendação:** Desde a Fase 1, preparar o projeto para receber a URL da API do backend via variável de ambiente (ex.: `VITE_API_URL` ou `REACT_APP_API_URL`), e nunca hardcodar URLs no código-fonte.  
Criar um arquivo `.env.example` documentado para facilitar o onboarding de novos desenvolvedores.

### 3.7 Tratamento de Estados de Carregamento e Erro na UI
**Recomendação:** Mesmo que a API ainda não exista, planejar desde o início os estados de UI:
- **Loading**: Spinner ou skeleton enquanto aguarda resposta da API.
- **Erro**: Mensagem amigável quando a API retorna erro ou está indisponível.
- **Vazio**: Estado da tela quando não há dados a exibir.

Isso evita retrabalho significativo ao integrar o backend.

### 3.8 Acessibilidade (a11y)
**Recomendação:** Mesmo em Fase 1, seguir boas práticas básicas de acessibilidade:
- Usar elementos HTML semânticos (`<main>`, `<section>`, `<label>`, `<button>`, etc.).
- Garantir contraste de cores adequado (WCAG AA, mínimo 4.5:1 para texto normal).
- Associar `<label>` a `<input>` com atributos `for`/`id`.
- Garantir navegação por teclado funcional.

### 3.9 Responsividade
**Recomendação:** Desde a Fase 1, adotar abordagem **mobile-first** no CSS, utilizando:
- CSS Flexbox ou Grid para layouts.
- Breakpoints definidos como variáveis CSS ou tokens de design.
- Testes visuais em diferentes resoluções antes de cada merge.

---

## 4. Recomendações para Próximas Fases

### Fase 2 — Integração com Backend (Cálculos)
- Documentar o contrato da API (OpenAPI/Swagger) antes de implementar o backend, para que frontend e backend possam evoluir em paralelo.
- Usar **mocking** (ex.: MSW — Mock Service Worker) no frontend durante o desenvolvimento, simulando as respostas da API antes que o backend esteja pronto.
- Implementar **tratamento de erros global** (interceptors HTTP) para lidar com erros 4xx/5xx de forma centralizada.

### Testes
- **Testes unitários** dos componentes de UI: Jest + Testing Library.
- **Testes de integração** das chamadas de serviço: Verificar que os parâmetros corretos são enviados à API.
- **Testes E2E** (end-to-end): Cypress ou Playwright para fluxos críticos do usuário.

---

## 5. Resumo das Prioridades

| Prioridade | Item                                   | Justificativa                                              |
|------------|----------------------------------------|------------------------------------------------------------|
| 🔴 Alta     | Adicionar código-fonte do frontend     | Sem código, não há projeto                                 |
| 🔴 Alta     | Reescrever o README.md                 | Documentação básica para qualquer colaborador              |
| 🟠 Média    | Adicionar `.gitignore`                 | Previne versionar arquivos desnecessários/sensíveis        |
| 🟠 Média    | Adicionar `package.json`               | Controle de dependências reproduzível                      |
| 🟡 Baixa    | Configurar ESLint + Prettier           | Qualidade de código e consistência de estilo               |
| 🟡 Baixa    | Configurar CI básico (GitHub Actions)  | Previne integração de código quebrado                      |
| 🟡 Baixa    | Gestão de variáveis de ambiente        | Prepara para integração futura com o backend               |
