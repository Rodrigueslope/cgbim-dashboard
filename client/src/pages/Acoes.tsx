import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Acoes() {
  const { data: acoes, isLoading } = trpc.acoes.list.useQuery();
  const { data: secretarias } = trpc.secretarias.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando ações...</p>
        </div>
      </div>
    );
  }

  // Dados para gráfico de status
  const statusCounts = {
    planejada: acoes?.filter(a => a.status === 'planejada').length || 0,
    em_progresso: acoes?.filter(a => a.status === 'em_progresso').length || 0,
    concluida: acoes?.filter(a => a.status === 'concluida').length || 0,
    atrasada: acoes?.filter(a => a.status === 'atrasada').length || 0,
    cancelada: acoes?.filter(a => a.status === 'cancelada').length || 0,
  };

  const statusData = [
    { status: 'Planejada', count: statusCounts.planejada, color: '#94a3b8' },
    { status: 'Em Progresso', count: statusCounts.em_progresso, color: '#3b82f6' },
    { status: 'Concluída', count: statusCounts.concluida, color: '#22c55e' },
    { status: 'Atrasada', count: statusCounts.atrasada, color: '#ef4444' },
    { status: 'Cancelada', count: statusCounts.cancelada, color: '#64748b' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      planejada: { variant: "secondary", className: "bg-slate-100 text-slate-700" },
      em_progresso: { variant: "default", className: "bg-blue-100 text-blue-700" },
      concluida: { variant: "outline", className: "bg-green-100 text-green-700 border-green-200" },
      atrasada: { variant: "destructive", className: "bg-red-100 text-red-700" },
      cancelada: { variant: "secondary", className: "bg-gray-100 text-gray-700" },
    };
    
    const config = variants[status] || variants.planejada;
    const labels: Record<string, string> = {
      planejada: "Planejada",
      em_progresso: "Em Progresso",
      concluida: "Concluída",
      atrasada: "Atrasada",
      cancelada: "Cancelada",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants: Record<string, { className: string }> = {
      baixa: { className: "bg-gray-100 text-gray-700" },
      media: { className: "bg-yellow-100 text-yellow-700" },
      alta: { className: "bg-orange-100 text-orange-700" },
      critica: { className: "bg-red-100 text-red-700" },
    };
    
    const config = variants[prioridade] || variants.media;
    const labels: Record<string, string> = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      critica: "Crítica",
    };

    return (
      <Badge variant="outline" className={config.className}>
        {labels[prioridade] || prioridade}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Acompanhamento de Ações
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestão e monitoramento das ações vinculadas aos objetivos do Decreto BIM-BA
          </p>
        </div>

        {/* Gráfico de Status */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 mb-8 animate-fadeIn">
          <CardHeader>
            <CardTitle>Status das Ações</CardTitle>
            <CardDescription>Distribuição das ações por status atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-foreground">{payload[0].payload.status}</p>
                          <p className="text-sm text-muted-foreground">
                            Total: <span className="font-medium">{payload[0].value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de Ações */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle>Todas as Ações</CardTitle>
            <CardDescription>Lista completa de ações com detalhes e responsáveis</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead>Decreto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acoes?.map((acao) => {
                  const secretaria = secretarias?.find(s => s.id === acao.responsavelSecretariaId);
                  return (
                    <TableRow key={acao.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{acao.titulo}</p>
                            {acao.descricao && (
                              <p className="text-sm text-muted-foreground mt-1">{acao.descricao}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{secretaria?.sigla || 'N/A'}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(acao.status)}</TableCell>
                      <TableCell>{getPrioridadeBadge(acao.prioridade)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all"
                              style={{ width: `${acao.percentualConclusao}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{acao.percentualConclusao}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(acao.dataPrevista), "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {acao.objetivoDecreto && (
                          <Badge variant="outline" className="text-xs">
                            {acao.objetivoDecreto}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {!acoes || acoes.length === 0 && (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma ação cadastrada
                </h3>
                <p className="text-muted-foreground">
                  As ações vinculadas aos objetivos do Decreto aparecerão aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
