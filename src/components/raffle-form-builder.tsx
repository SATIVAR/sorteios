
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash, GripVertical, PlusCircle, Loader2 } from "lucide-react";
import { Raffle, FormField as FormFieldType } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const formFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    label: z.string().min(1, "O rótulo é obrigatório"),
    type: z.enum(['text', 'email', 'select', 'radio', 'checkbox']),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.object({
        label: z.string().min(1, "O rótulo da opção é obrigatório"),
        value: z.string().min(1, "O valor da opção é obrigatório"),
    })).optional()
});

const formBuilderSchema = z.object({
  fields: z.array(formFieldSchema)
});

type FormBuilderValues = z.infer<typeof formBuilderSchema>;

interface RaffleFormBuilderProps {
    raffle: Raffle;
    onFormSaved: () => void;
}

const defaultFields: FormFieldType[] = [
    { id: uuidv4(), name: "name", label: "Nome Completo", type: "text", required: true },
    { id: uuidv4(), name: "email", label: "Email", type: "email", required: true },
];

export function RaffleFormBuilder({ raffle, onFormSaved }: RaffleFormBuilderProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormBuilderValues>({
        resolver: zodResolver(formBuilderSchema),
        defaultValues: {
            fields: raffle.formFields && raffle.formFields.length > 0 ? raffle.formFields : defaultFields,
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "fields",
    });

    useEffect(() => {
        form.reset({
            fields: raffle.formFields && raffle.formFields.length > 0 ? raffle.formFields : defaultFields,
        });
    }, [raffle, form]);

    const addField = (type: FormFieldType['type']) => {
        const newId = uuidv4();
        let field_name = `custom_field_${fields.length}`;
        let label = 'Novo Campo';

        switch(type){
            case 'text':
                label = 'Campo de Texto';
                break;
            case 'select':
                label = 'Campo de Seleção';
                break;
            case 'radio':
                label = 'Campo de Rádio';
                break;
            case 'checkbox':
                label = 'Caixa de Seleção';
                break;
        }

        append({
            id: newId,
            name: field_name,
            label,
            type,
            required: false,
            options: type === 'select' || type === 'radio' ? [{ label: "Opção 1", value: "opcao1" }] : [],
        });
    };
    
    const onSubmit = async (data: FormBuilderValues) => {
        setIsLoading(true);
        try {
            const raffleRef = doc(db, 'raffles', raffle.id);
            await updateDoc(raffleRef, {
                formFields: data.fields
            });
            toast({
                title: "Sucesso!",
                description: "Formulário de inscrição salvo com sucesso.",
                variant: "success",
            });
            onFormSaved();
        } catch (error) {
            console.error("Error saving form fields: ", error);
            toast({
                title: "Erro",
                description: "Não foi possível salvar o formulário.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className="shadow-lg bg-background">
            <CardHeader>
                <CardTitle>Construtor de Formulário de Inscrição</CardTitle>
                <CardDescription>Personalize os campos que os participantes preencherão para entrar no sorteio.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4 bg-muted/50">
                                    <div className="flex items-start gap-4">
                                        <GripVertical className="h-5 w-5 mt-2 text-muted-foreground cursor-grab" />
                                        <div className="flex-grow space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormItem>
                                                    <FormLabel>Rótulo do Campo</FormLabel>
                                                    <FormControl>
                                                        <Input {...form.register(`fields.${index}.label`)} placeholder="Ex: Nome Completo" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Tipo</FormLabel>
                                                    <Input value={field.type} disabled className="bg-background"/>
                                                </FormItem>
                                                <FormField
                                                  control={form.control}
                                                  name={`fields.${index}.required`}
                                                  render={({ field }) => (
                                                    <FormItem className="flex flex-col pt-2">
                                                      <FormLabel>Obrigatório</FormLabel>
                                                      <FormControl>
                                                         <Switch checked={field.value} onCheckedChange={field.onChange} disabled={index < 2} />
                                                      </FormControl>
                                                    </FormItem>
                                                  )}
                                                />
                                            </div>
                                             {['select', 'radio'].includes(field.type) && (
                                                <div>
                                                    <Label>Opções</Label>
                                                    <Controller
                                                        control={form.control}
                                                        name={`fields.${index}.options`}
                                                        render={({ field: { onChange, value = [] } }) => (
                                                          <div className="space-y-2 mt-2">
                                                            {(value).map((opt, optIndex) => (
                                                              <div key={optIndex} className="flex items-center gap-2">
                                                                <Input 
                                                                    placeholder="Rótulo da Opção"
                                                                    value={opt.label}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...value];
                                                                        newOptions[optIndex].label = e.target.value;
                                                                        onChange(newOptions);
                                                                    }}
                                                                />
                                                                 <Input 
                                                                    placeholder="Valor da Opção"
                                                                    value={opt.value}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...value];
                                                                        newOptions[optIndex].value = e.target.value;
                                                                        onChange(newOptions);
                                                                    }}
                                                                />
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => {
                                                                    const newOptions = value.filter((_, i) => i !== optIndex);
                                                                    onChange(newOptions);
                                                                }}>
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                              </div>
                                                            ))}
                                                             <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                const newOptions = [...value, {label: '', value: ''}];
                                                                onChange(newOptions);
                                                             }}>
                                                                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Opção
                                                            </Button>
                                                          </div>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => remove(index)}
                                            disabled={index < 2}
                                        >
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('text')}><PlusCircle className="mr-2 h-4 w-4" /> Campo de Texto</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('select')}><PlusCircle className="mr-2 h-4 w-4" /> Seleção</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('radio')}><PlusCircle className="mr-2 h-4 w-4" /> Rádio</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('checkbox')}><PlusCircle className="mr-2 h-4 w-4" /> Checkbox</Button>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Salvar Formulário
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
