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
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Company } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";

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

  async function onSubmit(data: RaffleFormValues) {
    setLoading(true);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[70vh] pr-6">
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
        </ScrollArea>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando Sorteio..." : "Salvar Sorteio"}
        </Button>
      </form>
    </Form>
  );
}
