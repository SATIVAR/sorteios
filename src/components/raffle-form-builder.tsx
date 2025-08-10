
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash, GripVertical, PlusCircle, Loader2 } from "lucide-react";
import { Raffle, FormField as FormFieldType } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

const formFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    label: z.string().min(1, "O rótulo é obrigatório"),
    type: z.enum(['text', 'email', 'select', 'radio', 'checkbox', 'textarea']),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.object({
        label: z.string().min(1, "O rótulo da opção é obrigatório"),
        value: z.string().min(1, "O valor da opção é obrigatório"),
    })).optional()
});

const formBuilderSchema = z.object({
  fields: z.array(formFieldSchema).superRefine((fields, ctx) => {
    const hasContactField = fields.some(field => 
        field.label === 'Email' || 
        field.label === 'Telefone' || 
        field.label === 'CPF'
    );
    if (!hasContactField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O formulário deve conter pelo menos um dos seguintes campos: Email, Telefone ou CPF.",
        path: [] // Points to the fields array itself
      });
    }
  })
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

const contactFieldLabels = ['Email', 'Telefone', 'CPF'];

export function RaffleFormBuilder({ raffle, onFormSaved }: RaffleFormBuilderProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
    
    const { errors } = form.formState;
    const currentFields = form.watch('fields');

    const contactFieldsCount = useMemo(() => {
        return currentFields.filter(field => contactFieldLabels.includes(field.label)).length;
    }, [currentFields]);

    useEffect(() => {
        const initialFields = raffle.formFields && raffle.formFields.length > 0 ? raffle.formFields : defaultFields;
        form.reset({
            fields: initialFields,
        });
    }, [raffle, form]);

    const addField = (type: FormFieldType['type'], label?: string, name?: string) => {
        const newId = uuidv4();
        let field_name = name || `custom_field_${fields.length}`;
        let field_label = label || 'Novo Campo';

        if (!label) {
            switch(type){
                case 'text': field_label = 'Campo de Texto'; break;
                case 'textarea': field_label = 'Área de Texto'; break;
                case 'select': field_label = 'Campo de Seleção'; break;
                case 'radio': field_label = 'Campo de Rádio'; break;
                case 'checkbox': field_label = 'Caixa de Seleção'; break;
            }
        }

        append({
            id: newId,
            name: field_name,
            label: field_label,
            type,
            required: false,
            options: type === 'select' || type === 'radio' ? [{ label: "Opção 1", value: "opcao1" }] : [],
        });
    };
    
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
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
                        {isClient && (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="fields">
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn("space-y-4", snapshot.isDraggingOver ? "bg-muted/50 rounded-lg p-2" : "")}
                                        >
                                            {fields.map((field, index) => {
                                                const isContactField = contactFieldLabels.includes(field.label);
                                                const isLastContactField = isContactField && contactFieldsCount <= 1;

                                                return (
                                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <Card className={`p-4 bg-muted/50 ${snapshot.isDragging ? 'shadow-lg' : ''}`}>
                                                                    <div className="flex items-start gap-4">
                                                                        <div {...provided.dragHandleProps}>
                                                                            <GripVertical className="h-5 w-5 mt-2 text-muted-foreground cursor-grab" />
                                                                        </div>
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
                                                                                render={({ field: switchField }) => (
                                                                                    <FormItem className="flex flex-col pt-2">
                                                                                    <FormLabel>Obrigatório</FormLabel>
                                                                                    <FormControl>
                                                                                        <Switch 
                                                                                            checked={switchField.value} 
                                                                                            onCheckedChange={switchField.onChange} 
                                                                                        />
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
                                                                            disabled={isLastContactField}
                                                                            title={isLastContactField ? "Não é possível remover o último campo de contato." : "Remover campo"}
                                                                        >
                                                                            <Trash className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}

                        {errors.fields && (
                            <p className="text-sm font-medium text-destructive mt-2">
                                {errors.fields.message || errors.fields.root?.message}
                            </p>
                        )}


                        <div className="flex items-center gap-2 flex-wrap pt-4 border-t">
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('text', 'Telefone', 'phone')}><PlusCircle className="mr-2 h-4 w-4" /> Telefone</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('text', 'CPF', 'cpf')}><PlusCircle className="mr-2 h-4 w-4" /> CPF</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('text')}><PlusCircle className="mr-2 h-4 w-4" /> Campo de Texto</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField('textarea')}><PlusCircle className="mr-2 h-4 w-4" /> Área de Texto</Button>
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
