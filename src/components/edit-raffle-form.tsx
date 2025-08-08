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
import { ScrollArea } from "./ui/scroll-area";

const raffleSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  totalParticipants: z.coerce.number().min(0, { message: "O número de participantes não pode ser negativo." }),
  totalWinners: z.coerce.number().min(1, { message: "Deve haver pelo menos 1 vencedor." }),
  status: z.enum(["Rascunho", "Ativo", "Concluído"]),
  companyId: z.string().optional(),
});

type RaffleFormValues = z.infer<typeof raffleSchema>;

interface EditRaffleFormProps {
  raffle: Raffle;
  onRaffleEdited: () => void;
  companies: Company[];
}

export function EditRaffleForm({ raffle, onRaffleEdited, companies }: EditRaffleFormProps) {
  const [loading, setLoading] = useState(false);
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
    },
  });

  async function onSubmit(data: RaffleFormValues) {
    setLoading(true);
    try {
      const raffleRef = doc(db, "raffles", raffle.id);
      const isCompanySelected = data.companyId && data.companyId !== 'none';
      const selectedCompany = isCompanySelected ? companies.find(c => c.id === data.companyId) : null;
      
      await updateDoc(raffleRef, {
        ...data,
        companyId: isCompanySelected ? data.companyId : null,
        companyName: selectedCompany ? selectedCompany.name : null,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[70vh] pr-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Sorteio</FormLabel>
                  <FormControl>
                    <Input placeholder="Sorteio de Aniversário" {...field} />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva os prêmios e as regras do sorteio." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    Insira 0 para participantes ilimitados.
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
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <SelectItem value="none">Nenhuma (Super Admin)</SelectItem>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Se nenhuma empresa for selecionada, o sorteio será associado ao Super Admin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}
