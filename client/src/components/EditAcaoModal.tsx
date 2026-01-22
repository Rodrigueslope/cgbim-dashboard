import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface EditAcaoModalProps {
  acao: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditAcaoModal({ acao, open, onOpenChange, onSuccess }: EditAcaoModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    responsavelSecretariaId: 0,
    dataInicio: "",
    dataPrevista: "",
    dataConclusao: "",
    status: "planejada" as "planejada" | "em_progresso" | "concluida" | "atrasada" | "cancelada",
    percentualConclusao: 0,
    prioridade: "media" as "baixa" | "media" | "alta" | "critica",
    objetivoDecreto: "",
    observacoes: "",
  });

  const atualizarAcao = trpc.acoes.update.useMutation({
    onSuccess: () => {
      toast.success("Ação atualizada com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar ação: ${error.message}`);
    },
  });

  // Preencher formulário quando a ação mudar
  useEffect(() => {
    if (acao) {
      setFormData({
        titulo: acao.titulo || "",
        descricao: acao.descricao || "",
        responsavelSecretariaId: acao.responsavelSecretariaId || 0,
        dataInicio: acao.dataInicio ? new Date(acao.dataInicio).toISOString().split('T')[0] : "",
        dataPrevista: acao.dataPrevista ? new Date(acao.dataPrevista).toISOString().split('T')[0] : "",
        dataConclusao: acao.dataConclusao ? new Date(acao.dataConclusao).toISOString().split('T')[0] : "",
        status: acao.status || "planejada",
        percentualConclusao: acao.percentualConclusao || 0,
        prioridade: acao.prioridade || "media",
        objetivoDecreto: acao.objetivoDecreto || "",
        observacoes: acao.observacoes || "",
      });
    }
  }, [acao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acao?.id) return;

    atualizarAcao.mutate({
      id: acao.id,
      titulo: formData.titulo,
      descricao: formData.descricao,
      responsavelSecretariaId: formData.responsavelSecretariaId,
      dataInicio: formData.dataInicio,
      dataPrevista: formData.dataPrevista,
      dataConclusao: formData.dataConclusao || undefined,
      status: formData.status,
      percentualConclusao: formData.percentualConclusao,
      prioridade: formData.prioridade,
      objetivoDecreto: formData.objetivoDecreto,
      observacoes: formData.observacoes,
    });
  };

  if (!acao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ação</DialogTitle>
          <DialogDescription>
            Atualize as informações da ação cadastrada
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-titulo">Título da Ação *</Label>
            <Input
              id="edit-titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Criar Biblioteca Estadual BIM"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-descricao">Descrição</Label>
            <Textarea
              id="edit-descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva os detalhes da ação..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-percentual">Percentual de Conclusão (%)</Label>
              <Input
                id="edit-percentual"
                type="number"
                min="0"
                max="100"
                value={formData.percentualConclusao}
                onChange={(e) => setFormData({ ...formData, percentualConclusao: parseInt(e.target.value) || 0 })}
                placeholder="0-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) => setFormData({ ...formData, prioridade: value as any })}
              >
                <SelectTrigger id="edit-prioridade">
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
              <Label htmlFor="edit-dataInicio">Data de Início</Label>
              <Input
                id="edit-dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dataPrevista">Data Prevista</Label>
              <Input
                id="edit-dataPrevista"
                type="date"
                value={formData.dataPrevista}
                onChange={(e) => setFormData({ ...formData, dataPrevista: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dataConclusao">Data de Conclusão</Label>
              <Input
                id="edit-dataConclusao"
                type="date"
                value={formData.dataConclusao}
                onChange={(e) => setFormData({ ...formData, dataConclusao: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger id="edit-status">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-objetivoDecreto">Objetivo do Decreto (Art. 5º)</Label>
            <Input
              id="edit-objetivoDecreto"
              value={formData.objetivoDecreto}
              onChange={(e) => setFormData({ ...formData, objetivoDecreto: e.target.value })}
              placeholder="Ex: Inciso I - Difundir o BIM"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={atualizarAcao.isPending}>
              {atualizarAcao.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
