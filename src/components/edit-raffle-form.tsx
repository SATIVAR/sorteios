"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Raffle, Company } from "@/lib/types";
import { DialogFooter, DialogHeader, DialogBody, DialogTitle, DialogDescription } from "./ui/dialog";
import { RaffleImageUpload } from "./raffle-image-upload";

const raffleSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  totalParticipants: z.coerce.number().min(0, { message: "O número de participantes não pode ser negativo." }),
  totalWinners: z.coerce.number().min(1, { message: "Deve haver pelo menos 1 vencedor." }),
  status: z.enum(["Rascunho", "Ativo", "Concluído"]),
  companyId: z.string().optional(),
  rules: z.string().optional(),
  privacyPolicy: z.string().optional(),
});

type RaffleFormValues = z.infer<typeof raffleSchema>;

interface EditRaffleFormProps {
  raffle: Raffle;
  onRaffleEdited: () => void;
  companies: Company[];
}

export function EditRaffleForm({ raffle, onRaffleEdited, companies }: EditRaffleFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(raffle.imageUrl || null);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | null>(raffle.imageAspectRatio || null);
  const { toast } = useToast();
  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      title: raffle.title || "",
      description: raffle.description || "",
      totalParticipants: raffle.totalParticipants,
      totalWinners: raffle.totalWinners || 0,
      status: raffle.status || "Rascunho",
      companyId: raffle.companyId || "none",
      rules: raffle.rules || "",
      privacyPolicy: raffle.privacyPolicy || "",
    },
  });

  const handleImageChange = (file: File | null, preview: string | null, aspectRatio: '1:1' | '16:9' | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setImageAspectRatio(aspectRatio);
  };

  async function onSubmit(data: RaffleFormValues) {
    setLoading(true);
    let imageUrl = raffle.imageUrl || "";

    if (imagePreview && imageFile && imagePreview !== raffle.imageUrl) {
        const formData = new FormData();
        const blob = await (await fetch(imagePreview)).blob();
        formData.append('file', blob, imageFile.name);
        formData.append('folder', 'raffles');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload da imagem falhou');
            }

            const { filePath } = await response.json();
            imageUrl = filePath;
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast({ title: "Erro de Upload", description: "Ocorreu um erro ao enviar a imagem do sorteio.", variant: "destructive" });
            setLoading(false);
            return;
        }
    }


    try {
      const raffleRef = doc(db, "raffles", raffle.id);
      const isCompanySelected = data.companyId && data.companyId !== 'none';
      const selectedCompany = isCompanySelected ? companies.find(c => c.id === data.companyId) : null;
      
      await updateDoc(raffleRef, {
        ...data,
        companyId: isCompanySelected ? data.companyId : null,
        companyName: selectedCompany ? selectedCompany.name : null,
        imageUrl: imageUrl, 
        imageAspectRatio: imageAspectRatio,
      });

      toast({
        title: "Sucesso!",
        description: "Sorteio atualizado com sucesso.",
      });
      onRaffleEdited();
    } catch (error) {
      console.error("Error updating raffle: ", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o sorteio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <DialogHeader>
              <DialogTitle>Editar Sorteio</DialogTitle>
              <DialogDescription>
                  Atualize os dados do sorteio.
              </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Sorteio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sorteio de Aniversário da Loja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Curta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva brevemente o sorteio, os prêmios e as regras principais." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Imagem do Sorteio (Opcional)
                </label>
                <RaffleImageUpload
                  value={imagePreview}
                  aspectRatio={imageAspectRatio}
                  onChange={handleImageChange}
                />
                <p className="text-sm text-muted-foreground">
                  Adicione uma imagem para tornar seu sorteio mais atrativo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Participantes</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use 0 para ilimitado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalWinners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Vencedores</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Quantos ganharão.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Rascunho">Rascunho</SelectItem>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Concluído">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa Associada (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma (Sorteio do Super Admin)</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regulamento</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cole aqui o regulamento completo do sorteio." {...field} rows={8}/>
                    </FormControl>
                    <FormDescription>
                      Este campo suporta Markdown para formatação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Política de Privacidade</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cole aqui a política de privacidade relacionada ao uso dos dados dos participantes." {...field} rows={8}/>
                    </FormControl>
                    <FormDescription>
                      Este campo suporta Markdown para formatação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </DialogBody>
        <DialogFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando Alterações..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
