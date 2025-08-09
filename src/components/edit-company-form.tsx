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
import { Loader2, Building, FileText, Globe, MessageSquare, Instagram, CheckCircle } from "lucide-react";
import type { Company } from "@/lib/types";
import { DialogBody, DialogFooter } from "./ui/dialog";
import { ImageUpload } from "@/components/image-upload";

const companySchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  cnpj: z.string().length(14, { message: "O CNPJ deve ter 14 caracteres." }),
  status: z.enum(["Ativo", "Inativo"]),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  site: z.string().url({ message: "Por favor, insira uma URL válida." }).optional().or(z.literal('')),
  logoUrl: z.string().url({ message: "URL do logo inválida." }).optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface EditCompanyFormProps {
  company: Company;
  onCompanyEdited: () => void;
}

export function EditCompanyForm({ company, onCompanyEdited }: EditCompanyFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(company.logoUrl || null);
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name || "",
      cnpj: company.cnpj || "",
      status: company.status || "Ativo",
      whatsapp: company.whatsapp || "",
      instagram: company.instagram || "",
      site: company.site || "",
      logoUrl: company.logoUrl || "",
    },
  });

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  async function onSubmit(data: CompanyFormValues) {
    setLoading(true);
    let logoUrl = company.logoUrl || "";
    
    // Se uma nova imagem foi selecionada, fazer upload
    if (imagePreview && imageFile && imagePreview !== company.logoUrl) {
      const formData = new FormData();
      const blob = await (await fetch(imagePreview)).blob();
      formData.append('file', blob, imageFile.name);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload da imagem falhou');
        }

        const { filePath } = await response.json();
        logoUrl = filePath;
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast({ title: "Erro de Upload", description: "Ocorreu um erro ao enviar o logo.", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    try {
      const companyRef = doc(db, "companies", company.id);
      await updateDoc(companyRef, {
        ...data,
        logoUrl: logoUrl,
      });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
        <DialogBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna Esquerda - Upload de Imagem */}
            <div className="md:col-span-1">
              <FormLabel className="text-base font-medium">Logo da Empresa</FormLabel>
              <div className="mt-3">
                <ImageUpload
                  value={imagePreview}
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Coluna Direita - Campos do Formulário */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Sativar" {...field} className="pl-10" />
                        </div>
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
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="00000000000000" {...field} className="pl-10" />
                        </div>
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
                          <div className="relative">
                            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </div>
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
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="5511999999999" {...field} className="pl-10" />
                        </div>
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
                        <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="@sativar" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="site"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="https://sativar.com" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
