"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Company } from "@/lib/types";

const companySchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  cnpj: z.string().length(14, { message: "O CNPJ deve ter 14 caracteres." }),
  status: z.enum(["Ativo", "Inativo"]),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  site: z.string().url({ message: "Por favor, insira uma URL válida." }).optional().or(z.literal('')),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface EditCompanyFormProps {
  company: Company;
  onCompanyEdited: () => void;
}

export function EditCompanyForm({ company, onCompanyEdited }: EditCompanyFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name || "",
      cnpj: company.cnpj || "",
      status: company.status || "Ativo",
      whatsapp: company.whatsapp || "",
      instagram: company.instagram || "",
      site: company.site || "",
    },
  });

  async function onSubmit(data: CompanyFormValues) {
    setLoading(true);
    try {
      const companyRef = doc(db, "companies", company.id);
      await updateDoc(companyRef, data);

      toast({
        title: "Sucesso!",
        description: "Empresa atualizada com sucesso.",
      });
      onCompanyEdited();
    } catch (error) {
      console.error("Error updating company: ", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a empresa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Sativar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="00000000000000" {...field} />
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
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="5511999999999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="@sativar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site</FormLabel>
              <FormControl>
                <Input placeholder="https://sativar.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}
