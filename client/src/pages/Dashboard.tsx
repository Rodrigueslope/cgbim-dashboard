import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, CheckCircle2, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = trpc.dashboard.kpis.useQuery();
  const { data: frequenciaData, isLoading: frequenciaLoading } = trpc.dashboard.frequencia.useQuery();
  const { data: secretarias } = trpc.secretarias.list.useQuery();

  if (kpisLoading || frequenciaLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Preparar dados para gráfico de presença por secretaria
  const presencaPorSecretariaData = frequenciaData?.presencaPorSecretaria.map((item) => {
    const secretaria = secretarias?.find(s => s.id === item.secretariaId);
    const taxa = item.totalReunioes > 0 
      ? ((item.totalPresencas / item.totalReunioes) * 100).toFixed(1)
      : 0;
    return {
      sigla: secretaria?.sigla || `Secretaria ${item.secretariaId}`,
      taxa: parseFloat(taxa as string),
      presencas: item.totalPresencas,
      total: item.totalReunioes,
    };
  }).sort((a, b) => b.taxa - a.taxa) || [];

  // Preparar dados para evolução temporal
  const evolucaoData = frequenciaData?.evolucaoPresenca.map((item) => ({
    data: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    taxa: parseFloat(item.taxaPresenca),
  })) || [];

  // Dados para gráfico de pizza (presentes vs ausentes na última reunião)
  const ultimaReuniao = frequenciaData?.evolucaoPresenca[frequenciaData.evolucaoPresenca.length - 1];
  const presentes = ultimaReuniao ? Math.round((parseFloat(ultimaReuniao.taxaPresenca) / 100) * 11) : 0;
  const ausentes = 11 - presentes;
  
  const pieData = [
    { name: 'Presentes', value: presentes, color: '#3b82f6' },
    { name: 'Ausentes', value: ausentes, color: '#e5e7eb' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Painel de Acompanhamento
          </h1>
          <p className="text-lg text-muted-foreground">
            Dashboard Executivo para Visualização de Progresso do CG BIM-BA
          </p>
        </div>

        {/* Cards de KPI */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-l-4 border-l-blue-600 shadow-elegant-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Presença Geral</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {kpis?.taxaPresencaGeral.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média de todas as reuniões
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600 shadow-elegant-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações em Andamento</CardTitle>
              <Activity className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                {kpis?.acoesEmAndamento}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ações em progresso
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600 shadow-elegant-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacitações Realizadas</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {kpis?.capacitacoesRealizadas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Treinamentos concluídos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 shadow-elegant-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status da Estratégia</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {kpis?.statusGeralEstrategia.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Implementação geral
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Frequência */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Gráfico de Barras - Presença por Secretaria */}
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle>Presença por Secretaria</CardTitle>
              <CardDescription>Taxa de presença em reuniões por órgão</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={presencaPorSecretariaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="sigla" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">{data.sigla}</p>
                            <p className="text-sm text-muted-foreground">
                              Taxa: <span className="font-medium text-blue-600">{data.taxa}%</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Presenças: {data.presencas}/{data.total}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="taxa" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Linha - Evolução Temporal */}
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle>Evolução da Taxa de Presença</CardTitle>
              <CardDescription>Tendência ao longo das reuniões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={evolucaoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="data" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">{payload[0].payload.data}</p>
                            <p className="text-sm text-muted-foreground">
                              Taxa: <span className="font-medium text-indigo-600">{payload[0].value}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="taxa" 
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

        {/* Gráfico de Pizza - Presentes vs Ausentes */}
        <Card className="shadow-elegant-md">
          <CardHeader>
            <CardTitle>Distribuição de Presença - Última Reunião</CardTitle>
            <CardDescription>Comparativo entre presentes e ausentes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
