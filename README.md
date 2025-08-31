# CDC Bank - Aplicativo Mobile Bancário

Uma aplicação mobile React Native para parceiros financeiros gerenciarem clientes e realizarem transações bancárias.

## Começando

### Pré-requisitos

- Node.js >= 20
- React Native CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS)
- Git

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ericksoncst/cdc-test
cd cdcTest
```

2. Instale as dependências:
```bash
npm install
```

3. Para iOS, instale as dependências do CocoaPods:
```bash
cd ios && pod install && cd ..
```

### Executando o JSON Server

A aplicação requer um servidor JSON local para persistência de dados. Inicie-o antes de executar o app:

```bash
# Instale o json-server globalmente (se ainda não instalado)
npm install -g json-server

# Inicie o servidor (executa na porta 3000 por padrão)
json-server --watch db.json --host 0.0.0.0
```

O servidor JSON estará disponível em `http://localhost:3000` e fornece os seguintes endpoints:
- `GET/POST /partners` - Autenticação de parceiros
- `GET/POST/PUT/DELETE /clients` - Gerenciamento de clientes

### Executando a Aplicação

Inicie o Metro bundler:
```bash
npm start
```

Em terminais separados, execute o app na sua plataforma preferida:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

### Testes

Execute a suíte de testes:
```bash
npm test
```

Execute testes com cobertura:
```bash
npm run test:coverage
```

## O Que Foi Implementado

Baseado nos requisitos do teste técnico, as seguintes funcionalidades foram implementadas com sucesso:

### Requisitos Funcionais Concluídos

1. **Tela de Login**
   - Validação de email e senha
   - Requisito de senha mínima de 6 caracteres
   - Validação de formato de email válido
   - Persistência de sessão com AsyncStorage
   - Navegação automática para o painel principal para usuários logados

2. **Painel de Clientes (Tela Principal)**
   - Listagem completa de clientes com nome, documento (CPF/CNPJ) e saldo
   - Funcionalidade de busca por nome ou documento
   - Operações de criar, editar e excluir clientes
   - Sincronização de dados em tempo real

3. **Tela de Criação de Cliente**
   - Formulário com todos os campos obrigatórios: nome, documento, idade/data de fundação, renda mensal
   - Validação adequada para todas as entradas
   - Inicialização automática de saldo

4. **Tela de Atualização de Cliente**
   - Edição de informações de clientes existentes
   - Mantém integridade dos dados durante atualizações

5. **Transferências Financeiras**
   - Transferências entre clientes do mesmo parceiro
   - Validação de saldo para prevenir saques a descoberto
   - Atualizações de saldo em tempo real após transferências
   - Fluxo de confirmação

### Requisitos Técnicos Concluídos

- **React Native com TypeScript**: Implementação completa em TypeScript
- **React Navigation**: Navegação em stack com fluxo de autenticação adequado
- **Context API**: Gerenciamento de estado global para autenticação e dados de clientes
- **Axios**: Cliente HTTP para comunicação com API
- **StyleSheet**: Estilização customizada em toda a aplicação
- **AsyncStorage**: Persistência de sessão e armazenamento local de dados
- **Componentes Funcionais**: Padrões modernos do React com hooks
- **Jest + React Native Testing Library**: Cobertura abrangente de testes

## Arquitetura e Decisões Técnicas

### Padrão de Arquitetura
A aplicação segue uma arquitetura em camadas com clara separação de responsabilidades:

- **Camada de Apresentação**: Telas e componentes React Native
- **Camada de Lógica de Negócio**: ViewModels usando hooks customizados
- **Camada de Dados**: Context API para gerenciamento de estado e serviço de API para requisições HTTP

### Principais Decisões Arquiteturais

1. **Padrão ViewModel**: Implementação de hooks customizados como ViewModels para separar lógica de negócio dos componentes de UI, melhorando testabilidade e manutenibilidade.

2. **Context API ao invés de Redux**: Escolha da Context API pela sua simplicidade e performance adequada para o escopo da aplicação. O padrão hierárquico de providers (AuthProvider > ClientProvider) previne dependências circulares.

3. **Fluxo de Dados Unidirecional**: Fluxo claro de dados dos componentes de UI através dos ViewModels para os providers de Context, garantindo atualizações previsíveis de estado.

4. **Validação de Formulários com Zod**: Validação baseada em schema fornece type safety e tratamento consistente de erros em todos os formulários.

5. **Abstração da Camada de Serviço**: A camada de serviço da API abstrai operações HTTP e fornece uma interface limpa para operações de dados.

### Estrutura do Projeto
```
src/
├── components/          # Componentes UI reutilizáveis
├── contexts/           # Gerenciamento de estado global
├── navigation/         # Configuração de navegação
├── screens/           # Telas da aplicação
├── services/          # API e serviços externos
├── types/             # Definições de tipos TypeScript
├── utils/             # Funções utilitárias
├── viewModels/        # Hooks de lógica de negócio
└── __tests__/         # Arquivos de teste
```

## O Que Poderia Ser Melhorado

### Para Ambiente de Produção

1. **Melhorias de Segurança**
   - Implementar autenticação adequada com JWT tokens
   - Adicionar mecanismo de refresh token
   - Criptografar dados sensíveis no AsyncStorage
   - Implementar autenticação biométrica
   - Adicionar criptografia de requisições/respostas

2. **Tratamento de Erros e Experiência do Usuário**
   - Implementar boundary global de erros
   - Adicionar capacidades de modo offline com sincronização de dados
   - Melhorar estados de carregamento e skeleton screens
   - Adicionar notificações push para confirmações de transações
   - Implementar logging e monitoramento adequado de erros (Ex: Sentry)

3. **Otimizações de Performance**
   - Adicionar React.memo para componentes custosos
   - Implementar scroll virtual para listas grandes de clientes
   - Adicionar otimização e cache
   - Implementar code splitting e lazy loading

4. **Gerenciamento de Dados**
   - Substituir Context API por Redux Toolkit para estado complexo (Em um projeto grande não usaria Context API)
   - Implementar estratégia adequada de cache (React Query/SWR)
   - Adicionar persistência de dados com SQLite ou Realm
   - Implementar atualizações otimistas para melhor UX

5. **Testes e Qualidade**
   - Aumentar cobertura de testes para 90%+
   - Adicionar testes E2E com Detox
   - Implementar integração/entrega contínua
   - Adicionar escaneamento automatizado de segurança

6. **DevOps e Monitoramento**
   - Implementar logging adequado com logs estruturados
   - Adicionar monitoramento de performance (Flipper, Reactotron)
   - Configurar relatórios de crash (Crashlytics)
   - Implementar feature flags

## Credenciais de Teste

Use as seguintes credenciais para testar a aplicação:

**Parceiro 1:**
- Email: joao@bank.com
- Senha: 123456

**Parceiro 2:**
- Email: maria@bank.com
- Senha: 123456

Cada parceiro possui clientes pré-configurados para testar a funcionalidade de transferências.