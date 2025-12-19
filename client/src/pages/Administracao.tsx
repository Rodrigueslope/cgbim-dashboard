import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Save, Trash2, Edit } from "lucide-react";

export default function Administracao() {
  const utils = trpc.useUtils();
  
  // Estados para formulários
  const [novaReuniao, setNovaReuniao] = useState({
    numero: 0,
    data: "",
    tipo: "ordinaria" as "ordinaria" | "extraordinaria",
    local: "",
    modalidade: "presencial" as "presencial" | "virtual" | "hibrida",
    pauta: "",
  });

  const [novaAcao, setNovaAcao] = useState({
    titulo: "",
    descricao: "",
    responsavelSecretariaId: 1,
    dataInicio: "",
    dataPrevista: "",
    status: "planejada" as "planejada" | "em_progresso" | "concluida" | "atrasada" | "cancelada",
    percentualConclusao: 0,
    prioridade: "media" as "baixa" | "media" | "alta" | "critica",
    objetivoDecreto: "",
    observacoes: "",
  });

  const [novaCapacitacao, setNovaCapacitacao] = useState({
    titulo: "",
    descricao: "",
    data: "",
    local: "",
    modalidade: "presencial" as "presencial" | "virtual" | "hibrida",
    instrutor: "",
    cargaHoraria: 0,
    participantesEsperados: 0,
    status: "agendada" as "agendada" | "realizada" | "cancelada",
    observacoes: "",
  });

  // Queries
  const { data: secretarias } = trpc.secretarias.list.useQuery();
  const { data: acoes } = trpc.acoes.list.useQuery();
  const { data: capacitacoes } = trpc.capacitacoes.list.useQuery();

  // Mutations
  const criarReuniao = trpc.reunioes.create.useMutation({
    onSuccess: () => {
      toast.success("Reunião criada com sucesso!");
      utils.reunioes.list.invalidate();
      utils.dashboard.kpis.invalidate();
      setNovaReuniao({
        numero: 0,
        data: "",
        tipo: "ordinaria",
        local: "",
        modalidade: "presencial",
        pauta: "",
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar reunião: ${error.message}`);
    },
  });

  const criarAcao = trpc.acoes.create.useMutation({
    onSuccess: () => {
      toast.success("Ação criada com sucesso!");
      utils.acoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
      setNovaAcao({
        titulo: "",
        descricao: "",
        responsavelSecretariaId: 1,
        dataInicio: "",
        dataPrevista: "",
        status: "planejada",
        percentualConclusao: 0,
        prioridade: "media",
        objetivoDecreto: "",
        observacoes: "",
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar ação: ${error.message}`);
    },
  });

  const atualizarAcao = trpc.acoes.update.useMutation({
    onSuccess: () => {
      toast.success("Ação atualizada com sucesso!");
      utils.acoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar ação: ${error.message}`);
    },
  });

  const excluirAcao = trpc.acoes.delete.useMutation({
    onSuccess: () => {
      toast.success("Ação excluída com sucesso!");
      utils.acoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir ação: ${error.message}`);
    },
  });

  const criarCapacitacao = trpc.capacitacoes.create.useMutation({
    onSuccess: () => {
      toast.success("Capacitação criada com sucesso!");
      utils.capacitacoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
      setNovaCapacitacao({
        titulo: "",
        descricao: "",
        data: "",
        local: "",
        modalidade: "presencial",
        instrutor: "",
        cargaHoraria: 0,
        participantesEsperados: 0,
        status: "agendada",
        observacoes: "",
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar capacitação: ${error.message}`);
    },
  });

  const atualizarCapacitacao = trpc.capacitacoes.update.useMutation({
    onSuccess: () => {
      toast.success("Capacitação atualizada com sucesso!");
      utils.capacitacoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar capacitação: ${error.message}`);
    },
  });

  const excluirCapacitacao = trpc.capacitacoes.delete.useMutation({
    onSuccess: () => {
      toast.success("Capacitação excluída com sucesso!");
      utils.capacitacoes.list.invalidate();
      utils.dashboard.kpis.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir capacitação: ${error.message}`);
    },
  });

  const handleSubmitReuniao = (e: React.FormEvent) => {
    e.preventDefault();
    criarReuniao.mutate(novaReuniao);
  };

  const handleSubmitAcao = (e: React.FormEvent) => {
    e.preventDefault();
    criarAcao.mutate(novaAcao);
  };

  const handleSubmitCapacitacao = (e: React.FormEvent) => {
    e.preventDefault();
    criarCapacitacao.mutate(novaCapacitacao);
  };

  const handleAtualizarStatusAcao = (id: number, status: string) => {
    atualizarAcao.mutate({ 
      id, 
      status: status as "planejada" | "em_progresso" | "concluida" | "atrasada" | "cancelada" 
    });
  };

  const handleAtualizarStatusCapacitacao = (id: number, status: string) => {
    atualizarCapacitacao.mutate({ 
      id, 
      status: status as "agendada" | "realizada" | "cancelada" 
    });
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie reuniões, ações, capacitações e dados do sistema
        </p>
      </div>

      <Tabs defaultValue="reunioes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
          <TabsTrigger value="acoes">Ações</TabsTrigger>
          <TabsTrigger value="capacitacoes">Capacitações</TabsTrigger>
        </TabsList>

        {/* Tab de Reuniões */}
        <TabsContent value="reunioes" className="space-y-6">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Reunião
              </CardTitle>
              <CardDescription>
                Cadastre uma nova reunião do CGBIM-BAHIA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReuniao} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número da Reunião</Label>
                    <Input
                      id="numero"
                      type="number"
                      value={novaReuniao.numero}
                      onChange={(e) => setNovaReuniao({ ...novaReuniao, numero: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novaReuniao.data}
                      onChange={(e) => setNovaReuniao({ ...novaReuniao, data: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={novaReuniao.tipo}
                      onValueChange={(value) => setNovaReuniao({ ...novaReuniao, tipo: value as "ordinaria" | "extraordinaria" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordinaria">Ordinária</SelectItem>
                        <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modalidade">Modalidade</Label>
                    <Select
                      value={novaReuniao.modalidade}
                      onValueChange={(value) => setNovaReuniao({ ...novaReuniao, modalidade: value as "presencial" | "virtual" | "hibrida" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="hibrida">Híbrida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    value={novaReuniao.local}
                    onChange={(e) => setNovaReuniao({ ...novaReuniao, local: e.target.value })}
                    placeholder="Ex: Sala de Reuniões - SEINFRA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pauta">Pauta</Label>
                  <Textarea
                    id="pauta"
                    value={novaReuniao.pauta}
                    onChange={(e) => setNovaReuniao({ ...novaReuniao, pauta: e.target.value })}
                    placeholder="Descreva os tópicos da reunião..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={criarReuniao.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {criarReuniao.isPending ? "Salvando..." : "Criar Reunião"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Ações */}
        <TabsContent value="acoes" className="space-y-6">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Ação
              </CardTitle>
              <CardDescription>
                Cadastre uma nova ação vinculada ao Decreto BIM-BA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAcao} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo-acao">Título da Ação</Label>
                  <Input
                    id="titulo-acao"
                    value={novaAcao.titulo}
                    onChange={(e) => setNovaAcao({ ...novaAcao, titulo: e.target.value })}
                    placeholder="Ex: Implementação da Biblioteca BIM"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-acao">Descrição</Label>
                  <Textarea
                    id="descricao-acao"
                    value={novaAcao.descricao}
                    onChange={(e) => setNovaAcao({ ...novaAcao, descricao: e.target.value })}
                    placeholder="Descreva os detalhes da ação..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Secretaria Responsável</Label>
                    <Select
                      value={novaAcao.responsavelSecretariaId.toString()}
                      onValueChange={(value) => setNovaAcao({ ...novaAcao, responsavelSecretariaId: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {secretarias?.map((sec) => (
                          <SelectItem key={sec.id} value={sec.id.toString()}>
                            {sec.sigla}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select
                      value={novaAcao.prioridade}
                      onValueChange={(value) => setNovaAcao({ ...novaAcao, prioridade: value as "baixa" | "media" | "alta" | "critica" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-inicio">Data Início</Label>
                    <Input
                      id="data-inicio"
                      type="date"
                      value={novaAcao.dataInicio}
                      onChange={(e) => setNovaAcao({ ...novaAcao, dataInicio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-prevista">Data Prevista</Label>
                    <Input
                      id="data-prevista"
                      type="date"
                      value={novaAcao.dataPrevista}
                      onChange={(e) => setNovaAcao({ ...novaAcao, dataPrevista: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentual">Percentual (%)</Label>
                    <Input
                      id="percentual"
                      type="number"
                      min="0"
                      max="100"
                      value={novaAcao.percentualConclusao}
                      onChange={(e) => setNovaAcao({ ...novaAcao, percentualConclusao: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo do Decreto (Art. 5º)</Label>
                  <Input
                    id="objetivo"
                    value={novaAcao.objetivoDecreto}
                    onChange={(e) => setNovaAcao({ ...novaAcao, objetivoDecreto: e.target.value })}
                    placeholder="Ex: Inciso I - Difundir o BIM"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={criarAcao.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {criarAcao.isPending ? "Salvando..." : "Criar Ação"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Ações Existentes */}
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle>Ações Cadastradas</CardTitle>
              <CardDescription>Gerencie as ações existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {acoes?.map((acao) => (
                  <div key={acao.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{acao.titulo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {acao.descricao}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Status: <strong>{acao.status}</strong></span>
                        <span>Conclusão: <strong>{acao.percentualConclusao}%</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={acao.status}
                        onValueChange={(value) => handleAtualizarStatusAcao(acao.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejada">Planejada</SelectItem>
                          <SelectItem value="em_progresso">Em Progresso</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="atrasada">Atrasada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (confirm("Deseja realmente excluir esta ação?")) {
                            excluirAcao.mutate({ id: acao.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!acoes || acoes.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma ação cadastrada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Capacitações */}
        <TabsContent value="capacitacoes" className="space-y-6">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Capacitação
              </CardTitle>
              <CardDescription>
                Cadastre um novo treinamento em BIM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCapacitacao} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo-cap">Título da Capacitação</Label>
                  <Input
                    id="titulo-cap"
                    value={novaCapacitacao.titulo}
                    onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, titulo: e.target.value })}
                    placeholder="Ex: Treinamento BIM Básico"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-cap">Descrição</Label>
                  <Textarea
                    id="descricao-cap"
                    value={novaCapacitacao.descricao}
                    onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, descricao: e.target.value })}
                    placeholder="Descreva o conteúdo da capacitação..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-cap">Data</Label>
                    <Input
                      id="data-cap"
                      type="date"
                      value={novaCapacitacao.data}
                      onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, data: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modalidade-cap">Modalidade</Label>
                    <Select
                      value={novaCapacitacao.modalidade}
                      onValueChange={(value) => setNovaCapacitacao({ ...novaCapacitacao, modalidade: value as "presencial" | "virtual" | "hibrida" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="hibrida">Híbrida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="local-cap">Local</Label>
                    <Input
                      id="local-cap"
                      value={novaCapacitacao.local}
                      onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, local: e.target.value })}
                      placeholder="Ex: Auditório SEINFRA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instrutor">Instrutor</Label>
                    <Input
                      id="instrutor"
                      value={novaCapacitacao.instrutor}
                      onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, instrutor: e.target.value })}
                      placeholder="Nome do instrutor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carga">Carga Horária (h)</Label>
                    <Input
                      id="carga"
                      type="number"
                      min="0"
                      value={novaCapacitacao.cargaHoraria}
                      onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, cargaHoraria: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participantes">Participantes Esperados</Label>
                    <Input
                      id="participantes"
                      type="number"
                      min="0"
                      value={novaCapacitacao.participantesEsperados}
                      onChange={(e) => setNovaCapacitacao({ ...novaCapacitacao, participantesEsperados: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={criarCapacitacao.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {criarCapacitacao.isPending ? "Salvando..." : "Criar Capacitação"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Capacitações Existentes */}
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle>Capacitações Cadastradas</CardTitle>
              <CardDescription>Gerencie as capacitações existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {capacitacoes?.map((cap) => (
                  <div key={cap.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{cap.titulo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cap.descricao}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Data: <strong>{new Date(cap.data).toLocaleDateString('pt-BR')}</strong></span>
                        <span>Modalidade: <strong>{cap.modalidade}</strong></span>
                        <span>Status: <strong>{cap.status}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={cap.status}
                        onValueChange={(value) => handleAtualizarStatusCapacitacao(cap.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agendada">Agendada</SelectItem>
                          <SelectItem value="realizada">Realizada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (confirm("Deseja realmente excluir esta capacitação?")) {
                            excluirCapacitacao.mutate({ id: cap.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!capacitacoes || capacitacoes.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma capacitação cadastrada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
