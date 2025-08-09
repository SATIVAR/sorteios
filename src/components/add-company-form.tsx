"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, FileText, Globe, MessageSquare, Instagram, CheckCircle, UploadCloud } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { getCroppedImg } from "@/lib/crop-image";
import Image from "next/image";


const companySchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  cnpj: z.string().refine(value => /^\d{14}$/.test(value), { message: "O CNPJ deve ter 14 dígitos." }),
  status: z.enum(["Ativo", "Inativo"]),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  site: z.string().url({ message: "Por favor, insira uma URL válida." }).optional().or(z.literal('')),
  logoUrl: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface AddCompanyFormProps {
  onCompanyAdded: () => void;
}

export function AddCompanyForm({ onCompanyAdded }: AddCompanyFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);


  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      cnpj: "",
      status: "Ativo",
      whatsapp: "",
      instagram: "",
      site: "",
    },
    mode: "onChange"
  });
  
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };
  
  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
         setCroppedImage(reader.result as string);
      });
      reader.readAsDataURL(croppedImageBlob as Blob);
      
      setImageSrc(null); // Close the cropper dialog
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);


  async function onSubmit(data: CompanyFormValues) {
    setLoading(true);
    let logoUrl = "";
    
    if (croppedImage && imageFile) {
      const formData = new FormData();
      const blob = await (await fetch(croppedImage)).blob();
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
      await addDoc(collection(db, "companies"), {
        ...data,
        logoUrl: logoUrl,
        rafflesCount: 0,
      });
      toast({
        title: "Sucesso!",
        description: "Empresa adicionada com sucesso.",
        variant: 'default',
      });
      onCompanyAdded();
    } catch (error) {
      console.error("Error adding company: ", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a empresa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-grow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <FormLabel>Logo da Empresa</FormLabel>
                     <FormControl>
                        <div className="mt-2 flex justify-center items-center">
                          {croppedImage ? (
                            <div className="relative w-32 h-32">
                              <Image src={croppedImage} alt="Logo preview" layout="fill" objectFit="cover" className="rounded-full"/>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold">Clique para enviar</span>
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG (1:1)</p>
                              </div>
                               <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                          )}
                        </div>
                      </FormControl>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
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
                   <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  </div>
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
                  <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="site"
                        render={({ field }) => (
                          <FormItem>
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
          </ScrollArea>

          <div className="flex-shrink-0 p-6 pt-4 border-t">
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar Empresa"}
              </Button>
          </div>
        </form>
      </Form>
      
      {imageSrc && (
        <Dialog open={!!imageSrc} onOpenChange={() => setImageSrc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cortar Imagem</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-64">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
             <DialogFooter>
              <Button onClick={() => setImageSrc(null)} variant="outline">Cancelar</Button>
              <Button onClick={showCroppedImage}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
