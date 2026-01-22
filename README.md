# Painel de Acompanhamento CG BIM-BA

Sistema de gestão e acompanhamento das atividades do **CGBIM-BAHIA** (Comitê Gestor BIM da Bahia), desenvolvido para monitorar reuniões, ações, capacitações e conformidade regulatória relacionadas à Estratégia BIM-BA.

## 🎯 Funcionalidades

### Dashboard Executivo
- **KPIs em tempo real**: Taxa de presença geral, ações em andamento, capacitações realizadas e status da estratégia
- **Gráficos dinâmicos**: Visualização de frequência por secretaria, evolução temporal e distribuição de presença
- **Indicadores visuais**: Cards interativos com animações e transições elegantes

### Gestão de Reuniões
- Cadastro de reuniões ordinárias e extraordinárias
- Registro de presença (titular/suplente) para as 11 secretarias
- Indicadores de quórum atingido
- Edição e exclusão de reuniões com confirmação
- Modal de edição completo com validação de campos

### Sistema de Ações
- Vinculação de ações aos objetivos do Decreto BIM-BA
- Acompanhamento de status (planejada, em progresso, concluída, atrasada, cancelada)
- Gráficos de distribuição por status
- Gestão de responsáveis e prazos

### Capacitações em BIM
- Registro de eventos de capacitação
- Controle de participantes e carga horária
- Gráficos de evolução de pessoas capacitadas
- Listagem de próximas capacitações agendadas

### Conformidade Regulatória
- Painel de progresso de implementação da Biblioteca BIM
- Painel de progresso de implementação do CDE (Common Data Environment)
- Checklist de requisitos do Decreto
- Indicadores de conformidade por categoria

### Interface Administrativa
- Formulários completos para CRUD de reuniões, ações e capacitações
- Registro de presença com checklist visual das secretarias
- Sistema de autenticação com senha (RBIM2025)
- Notificações toast para feedback de operações

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **TanStack Router** para roteamento
- **Tailwind CSS 4** para estilização
- **Recharts** para gráficos dinâmicos
- **Lucide Icons** para ícones
- **Sonner** para notificações toast
- **shadcn/ui** para componentes de interface

### Backend
- **Express.js** como servidor HTTP
- **tRPC 11** para APIs type-safe
- **Drizzle ORM** para acesso ao banco de dados
- **SQLite** como banco de dados
- **Superjson** para serialização de dados

### Infraestrutura
- **Vite** como bundler e dev server
- **TypeScript** para type safety
- **Vitest** para testes unitários
- **pnpm** como gerenciador de pacotes

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/Rodrigueslope/cgbim-dashboard.git
cd cgbim-dashboard

# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

## 🔐 Autenticação

O sistema é protegido por senha para acesso restrito à equipe RBIM (Rede BIM Bahia).

**Senha de acesso**: `RBIM2025`

A sessão expira após 24 horas de inatividade.

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza 8 tabelas principais:

1. **secretarias**: 11 secretarias do CGBIM-BAHIA
2. **reunioes**: Reuniões ordinárias e extraordinárias
3. **presencas**: Registro de presença (titular/suplente) por reunião
4. **acoes**: Ações vinculadas aos objetivos do Decreto BIM-BA
5. **capacitacoes**: Eventos de capacitação em BIM
6. **participantes_capacitacao**: Participantes de cada capacitação
7. **conformidade**: Itens de conformidade regulatória
8. **progresso_conformidade**: Progresso de implementação por item

## 🎨 Design

Interface institucional elegante com:
- Paleta de cores azul institucional
- Tipografia Inter para legibilidade profissional
- Animações e transições suaves
- Logo oficial do Governo do Estado da Bahia
- Layout responsivo para desktop e mobile
- Efeitos hover e estados visuais refinados

## 🧪 Testes

O projeto inclui 24 testes unitários cobrindo:
- Rotas tRPC (dashboard, KPIs, CRUD)
- Cálculos de frequência e presença
- Operações de banco de dados
- Sistema de autenticação

```bash
# Executar testes
pnpm test
```

## 📊 KPIs Monitorados

- **Taxa de Presença Geral**: Média de todas as reuniões
- **Ações em Andamento**: Total de ações com status "em_progresso"
- **Capacitações Realizadas**: Total de capacitações concluídas
- **Status da Estratégia**: Percentual de implementação geral

## 🚀 Deployment

O sistema está hospedado na plataforma Manus com domínio personalizado.

Para publicar uma nova versão:
1. Fazer as alterações necessárias
2. Criar um checkpoint via interface administrativa
3. Clicar no botão "Publish" no painel de gerenciamento

## 📝 Licença

Este projeto foi desenvolvido para uso exclusivo do **Comitê Gestor BIM da Bahia** (CGBIM-BAHIA) e do Governo do Estado da Bahia.

## 👥 Secretarias Participantes

1. CASA CIVIL (CC)
2. SEINFRA - Secretaria de Infraestrutura
3. SECULT - Secretaria de Cultura
4. SESAB - Secretaria de Saúde
5. SEC - Secretaria de Educação
6. SEDUR - Secretaria de Desenvolvimento Urbano
7. SEMA - Secretaria de Meio Ambiente
8. SEPLAN - Secretaria de Planejamento
9. SEFAZ - Secretaria da Fazenda
10. SJDH - Secretaria de Justiça e Direitos Humanos
11. SAEB - Secretaria de Administração

## 📞 Contato

Para dúvidas ou suporte, entre em contato com a equipe RBIM - Rede BIM Bahia.

---

**Desenvolvido para o Governo do Estado da Bahia**
