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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Company } from "@/lib/types";
import { DialogHeader, DialogBody, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { RaffleImageUpload } from "./raffle-image-upload";
import { MarkdownEditor } from "./markdown-editor";
import { Textarea } from "./ui/textarea";

const raffleSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  totalParticipants: z.coerce.number().min(0, { message: "O número de participantes não pode ser negativo." }),
  totalWinners: z.coerce.number().min(1, { message: "Deve haver pelo menos 1 vencedor." }),
  companyId: z.string().optional(),
  rules: z.string().optional(),
  privacyPolicy: z.string().optional(),
});

type RaffleFormValues = z.infer<typeof raffleSchema>;

interface AddRaffleFormProps {
  onRaffleAdded: () => void;
  companies: Company[];
}

export function AddRaffleForm({ onRaffleAdded, companies }: AddRaffleFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | null>(null);
  const { toast } = useToast();
  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      title: "",
      description: "",
      totalParticipants: 0,
      totalWinners: 1,
      companyId: "none",
      rules: "",
      privacyPolicy: "",
    },
  });

  const handleImageChange = (file: File | null, preview: string | null, aspectRatio: '1:1' | '16:9' | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setImageAspectRatio(aspectRatio);
  };

  async function onSubmit(data: RaffleFormValues) {
    setLoading(true);
    let imageUrl = "";

    if (imagePreview && imageFile) {
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
                const error = await response.json();
                console.error('API Error:', error);
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
      const isCompanySelected = data.companyId && data.companyId !== 'none';
      const selectedCompany = isCompanySelected ? companies.find(c => c.id === data.companyId) : null;

      await addDoc(collection(db, "raffles"), {
        title: data.title,
        description: data.description,
        totalParticipants: data.totalParticipants,
        totalWinners: data.totalWinners,
        companyId: isCompanySelected ? data.companyId : null,
        companyName: selectedCompany ? selectedCompany.name : null,
        rules: data.rules,
        privacyPolicy: data.privacyPolicy,
        status: "Rascunho",
        participants: [],
        winners: [],
        imageUrl: imageUrl,
        imageAspectRatio: imageAspectRatio,
      });
      toast({
        title: "Sucesso!",
        description: "Sorteio adicionado com sucesso.",
      });
      onRaffleAdded();
    } catch (error) {
      console.error("Error adding raffle: ", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o sorteio.",
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
          <DialogTitle>Adicionar Novo Sorteio</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo sorteio.
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                 <div className="flex flex-col">
                    <FormLabel>Imagem do Sorteio (Opcional)</FormLabel>
                    <RaffleImageUpload
                        value={imagePreview}
                        aspectRatio={imageAspectRatio}
                        onChange={handleImageChange}
                        className="mt-2"
                    />
                    <FormDescription className="mt-2">
                        Adicione uma imagem para tornar seu sorteio mais atrativo.
                    </FormDescription>
                 </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>Descrição Curta</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva brevemente o seu sorteio..." {...field} className="flex-grow" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                       <MarkdownEditor {...field} />
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
                        <MarkdownEditor {...field} />
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
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando Sorteio...
                </>
            ) : "Salvar Sorteio"}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
