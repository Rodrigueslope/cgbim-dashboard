import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GraduationCap, Users, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Capacitacoes() {
  const { data: capacitacoes, isLoading } = trpc.capacitacoes.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando capacitações...</p>
        </div>
      </div>
    );
  }

  // Dados para gráfico de participantes por capacitação
  const participantesData = capacitacoes?.map(cap => ({
    titulo: cap.titulo.length > 30 ? cap.titulo.substring(0, 30) + '...' : cap.titulo,
    esperados: cap.participantesEsperados,
    confirmados: cap.participantesConfirmados,
    presentes: cap.participantesPresentes,
  })) || [];

  // Dados para evolução de pessoas capacitadas
  const capacitacoesRealizadas = capacitacoes?.filter(c => c.status === 'realizada').sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  ) || [];
  
  let acumulado = 0;
  const evolucaoData = capacitacoesRealizadas.map(cap => {
    acumulado += cap.participantesPresentes;
    return {
      data: format(new Date(cap.data), "dd/MM", { locale: ptBR }),
      total: acumulado,
      evento: cap.titulo,
    };
  });

  // Próximas capacitações agendadas
  const proximasCapacitacoes = capacitacoes?.filter(c => c.status === 'agendada').slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, label: string }> = {
      agendada: { className: "bg-blue-100 text-blue-700", label: "Agendada" },
      realizada: { className: "bg-green-100 text-green-700", label: "Realizada" },
      cancelada: { className: "bg-gray-100 text-gray-700", label: "Cancelada" },
    };
    
    const config = variants[status] || variants.agendada;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getModalidadeBadge = (modalidade: string) => {
    const labels: Record<string, string> = {
      presencial: "Presencial",
      virtual: "Virtual",
      hibrida: "Híbrida",
    };
    return (
      <Badge variant="secondary" className="capitalize">
        {labels[modalidade] || modalidade}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Capacitações em BIM
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhamento de treinamentos e formação de multiplicadores da Estratégia BIM-BA
          </p>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8 animate-fadeIn">
          {/* Gráfico de Participantes por Capacitação */}
          <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Participantes por Capacitação</CardTitle>
              <CardDescription>Comparativo entre esperados, confirmados e presentes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={participantesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="titulo" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="esperados" fill="#94a3b8" name="Esperados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="confirmados" fill="#3b82f6" name="Confirmados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="presentes" fill="#22c55e" name="Presentes" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Evolução */}
          <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Evolução de Pessoas Capacitadas</CardTitle>
              <CardDescription>Total acumulado ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">{payload[0].payload.evento}</p>
                            <p className="text-sm text-muted-foreground">
                              Data: {payload[0].payload.data}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total acumulado: <span className="font-medium text-primary">{payload[0].value}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Capacitações Agendadas */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle>Próximas Capacitações Agendadas</CardTitle>
            <CardDescription>Treinamentos programados para os próximos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasCapacitacoes.map((cap) => (
                <div key={cap.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        {cap.titulo}
                      </h3>
                      {cap.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">{cap.descricao}</p>
                      )}
                    </div>
                    {getStatusBadge(cap.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(new Date(cap.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                    {cap.cargaHoraria && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{cap.cargaHoraria}h</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{cap.participantesEsperados} vagas</span>
                    </div>
                    <div>
                      {getModalidadeBadge(cap.modalidade)}
                    </div>
                  </div>

                  {cap.instrutor && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Instrutor:</span> {cap.instrutor}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {proximasCapacitacoes.length === 0 && (
                <div className="py-8 text-center">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma capacitação agendada
                  </h3>
                  <p className="text-muted-foreground">
                    Novos treinamentos serão exibidos aqui quando forem programados.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Todas as Capacitações */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle>Histórico Completo</CardTitle>
            <CardDescription>Todas as capacitações realizadas e agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {capacitacoes?.map((cap) => (
                <div key={cap.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-foreground">{cap.titulo}</h4>
                      {getStatusBadge(cap.status)}
                      {getModalidadeBadge(cap.modalidade)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(cap.data), "dd/MM/yyyy")}
                      </span>
                      {cap.status === 'realizada' && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {cap.participantesPresentes} participantes ({cap.taxaPresenca}% de presença)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
