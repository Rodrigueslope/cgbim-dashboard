import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Reuniao {
  id: number;
  data: Date;
  tipo: string;
  local: string | null;
  modalidade: string | null;
  pauta: string | null;
}

interface EditReuniaoModalProps {
  reuniao: Reuniao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditReuniaoModal({ reuniao, open, onOpenChange, onSuccess }: EditReuniaoModalProps) {
  const [formData, setFormData] = useState({
    data: "",
    tipo: "ordinaria" as "ordinaria" | "extraordinaria",
    local: "",
    modalidade: "presencial" as "presencial" | "virtual" | "hibrida",
    pauta: "",
  });

  const updateMutation = trpc.reunioes.update.useMutation({
    onSuccess: () => {
      toast.success("Reunião atualizada com sucesso!");
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar reunião: ${error.message}`);
    },
  });

  useEffect(() => {
    if (reuniao) {
      setFormData({
        data: reuniao.data instanceof Date 
          ? reuniao.data.toISOString().split("T")[0]
          : new Date(reuniao.data).toISOString().split("T")[0],
        tipo: reuniao.tipo as "ordinaria" | "extraordinaria",
        local: reuniao.local || "",
        modalidade: (reuniao.modalidade || "presencial") as "presencial" | "virtual" | "hibrida",
        pauta: reuniao.pauta || "",
      });
    }
  }, [reuniao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reuniao) return;

    updateMutation.mutate({
      id: reuniao.id,
      data: formData.data,
      tipo: formData.tipo,
      local: formData.local || undefined,
      modalidade: formData.modalidade,
      pauta: formData.pauta || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Reunião</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-data">Data</Label>
              <Input
                id="edit-data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value as "ordinaria" | "extraordinaria" })}>
                <SelectTrigger id="edit-tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinaria">Ordinária</SelectItem>
                  <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-local">Local</Label>
            <Input
              id="edit-local"
              placeholder="Ex: Sala de Reuniões - SEINFRA"
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-modalidade">Modalidade</Label>
            <Select value={formData.modalidade} onValueChange={(value) => setFormData({ ...formData, modalidade: value as "presencial" | "virtual" | "hibrida" })}>
              <SelectTrigger id="edit-modalidade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="híbrida">Híbrida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-pauta">Pauta</Label>
            <Textarea
              id="edit-pauta"
              placeholder="Descreva os tópicos da reunião..."
              value={formData.pauta}
              onChange={(e) => setFormData({ ...formData, pauta: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
