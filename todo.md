# TODO - Sistema de Gestão CG BIM-BA

## Backend - Schema e Rotas
- [x] Criar tabela de secretarias com dados das 11 secretarias do CGBIM-BAHIA
- [x] Criar tabela de reuniões (ordinárias/extraordinárias)
- [x] Criar tabela de presença vinculada a reuniões e secretarias
- [x] Criar tabela de ações vinculadas aos objetivos do Decreto
- [x] Criar tabela de capacitações em BIM
- [x] Criar tabela de participantes de capacitações
- [x] Criar tabela de conformidade regulatória (Biblioteca BIM, CDE, requisitos)
- [x] Implementar rotas tRPC para listar secretarias
- [x] Implementar rotas tRPC para CRUD de reuniões
- [x] Implementar rotas tRPC para registro de presença
- [x] Implementar rotas tRPC para CRUD de ações
- [x] Implementar rotas tRPC para CRUD de capacitações
- [x] Implementar rotas tRPC para dashboard (KPIs agregados)
- [x] Implementar rotas tRPC para dados de conformidade regulatória
- [x] Popular banco com dados iniciais das secretarias
- [x] Popular banco com dados da primeira reunião

## Frontend - Dashboard Executivo
- [x] Criar layout principal com DashboardLayout
- [x] Implementar página Dashboard com cards de KPI
- [x] Card: Taxa de presença geral
- [x] Card: Total de ações em andamento
- [x] Card: Capacitações realizadas
- [x] Card: Status geral da estratégia BIM

## Frontend - Gráficos de Frequência
- [x] Gráfico de barras: Presença por secretaria
- [x] Gráfico de linha: Evolução temporal da taxa de presença
- [x] Gráfico de pizza: Presentes vs Ausentes

## Frontend - Heatmap de Assiduidade
- [x] Implementar ranking de assiduidade por secretaria (integrado no gráfico de barras)

## Frontend - Sistema de Ações
- [x] Criar página de listagem de ações
- [x] Gráfico de barras: Status das ações
- [x] Tabela de ações com filtros por status e responsável
- [x] Vinculação de ações aos artigos do Decreto

## Frontend - Conformidade Regulatória
- [x] Painel de progresso: Implementação de Biblioteca BIM
- [x] Painel de progresso: Implementação de CDE
- [x] Checklist: Requisitos do Decreto
- [x] Indicadores de conformidade por requisito

## Frontend - Sistema de Capacitações
- [x] Criar página de listagem de capacitações
- [x] Gráfico de barras: Participantes por capacitação
- [x] Gráfico de linha: Evolução de pessoas capacitadas
- [x] Tabela de próximas capacitações agendadas

## Frontend - Sistema de Reuniões
- [x] Criar página de listagem de reuniões
- [x] Visualização de detalhes de reunião individual
- [x] Indicador de quórum atingido

## Design e Estilo
- [x] Definir paleta de cores institucional elegante
- [x] Configurar tema no index.css
- [x] Implementar tipografia profissional
- [x] Adicionar ícones e elementos visuais refinados
- [x] Garantir responsividade em todos os componentes

## Testes
- [x] Criar testes para rotas de dashboard e KPIs
- [x] Criar testes para rotas de secretarias
- [x] Criar testes para cálculos de frequência
- [x] Validar todos os testes (8 testes passando)

## Finalização
- [x] Revisar todas as funcionalidades
- [x] Verificar integração completa
- [x] Criar checkpoint final

## Melhorias Visuais e Acesso Público
- [x] Buscar e adicionar logo do Governo da Bahia
- [x] Adicionar logo no header/sidebar do sistema
- [x] Melhorar efeitos visuais no Dashboard (animações, transições)
- [x] Melhorar efeitos visuais na página de Reuniões
- [x] Melhorar efeitos visuais na página de Ações
- [x] Melhorar efeitos visuais na página de Capacitações
- [x] Melhorar efeitos visuais na página de Conformidade
- [x] Remover autenticação obrigatória do DashboardLayout
- [x] Tornar sistema acessível publicamente sem login
- [x] Criar checkpoint final com melhorias

## Atualização de Dados
- [ ] Atualizar status das ações no banco (1 ação em andamento)
- [ ] Atualizar capacitações no banco (0 capacitações realizadas)
- [ ] Criar checkpoint com dados atualizados

## Interface Administrativa
- [x] Criar rotas tRPC para criar/editar/excluir reuniões
- [x] Criar rotas tRPC para criar/editar/excluir ações
- [x] Criar rotas tRPC para criar/editar/excluir capacitações
- [x] Criar rotas tRPC para registrar/editar presenças
- [x] Criar página de Administração no menu
- [x] Implementar formulário de cadastro de reuniões
- [x] Implementar formulário de cadastro de ações
- [x] Implementar formulário de cadastro de capacitações
- [x] Adicionar botões de edição e exclusão nas listagens
- [x] Mudar todas as rotas para públicas (sem autenticação)
- [x] Testar todas as funcionalidades CRUD (15 testes passando)
- [x] Criar checkpoint final com interface administrativa

## Ajuste de Dados das Reuniões
- [x] Revisar ata de presença da reunião de novembro (100% de presença - 11/11 secretárias)
- [x] Limpar dados antigos de reuniões do banco
- [x] Criar 1ª reunião (novembro/2024) com dados da ata
- [x] Registrar presenças da 1ª reunião conforme ata (11/11 titulares presentes)
- [x] Criar 2ª reunião (19/12/2024 - hoje)
- [x] Criar 3ª reunião (janeiro/2025 - agendada)
- [x] Verificar atualização dos KPIs (33.3% taxa geral, gráficos atualizados)
- [x] Criar checkpoint com dados corretos

## Interface de Edição de Presença
- [x] Adicionar aba "Registro de Presença" na página de Administração
- [x] Criar seletor de reunião para escolher qual reunião editar
- [x] Criar checklist visual das 11 secretarias com checkboxes
- [x] Adicionar seletor titular/suplente para cada secretaria
- [x] Implementar botão "Salvar Presenças" que atualiza o banco
- [x] Recalcular automaticamente taxa de presença após salvar (na função registerPresencas)
- [x] Adicionar feedback visual de sucesso/erro (toast notifications)
- [x] Criar rota tRPC presencas.register
- [x] Criar função registerPresencas no db.ts
- [x] Testar edição de presença e verificar atualização dos KPIs (19 testes passando)
- [x] Criar checkpoint com interface de edição funcional

## Edição e Exclusão de Reuniões
- [x] Adicionar listagem de reuniões existentes na aba de Reuniões
- [x] Adicionar botão de edição para cada reunião
- [x] Criar formulário de edição de reunião (preencher com dados existentes)
- [x] Adicionar botão de exclusão para cada reunião
- [x] Implementar confirmação antes de excluir
- [x] Atualizar KPIs após edição/exclusão
- [x] Criar rota tRPC reunioes.delete
- [x] Criar rota tRPC reunioes.update expandida
- [x] Criar função deleteReuniao no db.ts

## Sistema de Autenticação com Senha
- [x] Criar página de Login com campo de senha
- [x] Criar sistema de sessão simples (localStorage com expiração de 24h)
- [x] Proteger todas as rotas do sistema com verificação de autenticação (ProtectedRoute)
- [x] Adicionar botão de logout no header do sidebar
- [x] Definir senha de acesso para a RBIM (RBIM2025)
- [x] Redirecionar para login se não autenticado
- [x] Criar hook useAuthSimple para gerenciar autenticação
- [x] Testar fluxo completo de login/logout (tela de login funcional, senha RBIM2025)

## Correção de Dados
- [x] Limpar reuniões incorretas do banco
- [x] Manter apenas as 3 reuniões corretas (Nov/2024, 19 Dez/2024, Jan/2025)
- [x] Verificar e corrigir pautas das reuniões
- [x] Registrar presenças da 1ª reunião (11/11 presentes)
- [x] Criar testes para CRUD de reuniões (24 testes passando)
- [x] Criar checkpoint final

## Melhorias Finais
- [x] Adicionar senha específica para acessar Administração (RBIM007)
- [x] Botão de edição funcional (já existente, salva alterações)
- [x] Corrigir logo do Governo da Bahia na tela de login (caminho corrigido para /logo-governo-bahia.png)
- [ ] Testar fluxo completo de edição de reuniões
- [ ] Criar checkpoint final

## Correção de Erro na Administração
- [x] Remover verificação de senha administrativa (AdminPassword) que causa erro de hooks
- [x] Manter apenas senha principal de login (RBIM2025)
- [x] Testar acesso à página de Administração sem erros (servidor reiniciado, sem erros TypeScript)
- [x] Criar checkpoint final com correção
