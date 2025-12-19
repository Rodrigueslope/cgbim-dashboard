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
- [ ] Criar checkpoint final
