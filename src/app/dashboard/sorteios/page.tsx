"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import type { Raffle, Company } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddRaffleForm } from "@/components/add-raffle-form";
import { EditRaffleForm } from "@/components/edit-raffle-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function SorteiosPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const rafflesSnapshot = await getDocs(collection(db, "raffles"));
      const rafflesData = rafflesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Raffle));
      setRaffles(rafflesData);

      const companiesSnapshot = await getDocs(collection(db, "companies"));
      const companiesData = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
      setCompanies(companiesData);

    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({ title: "Erro", description: "Falha ao carregar os dados.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRaffleAdded = () => {
    fetchData();
    setIsAddModalOpen(false);
  }

  const handleRaffleEdited = () => {
    fetchData();
    setIsEditModalOpen(false);
    setSelectedRaffle(null);
  }

  const openEditModal = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setIsEditModalOpen(true);
  }
  
  const handleDeleteRaffle = async (raffleId: string) => {
    try {
        await deleteDoc(doc(db, "raffles", raffleId));
        toast({
            title: "Sucesso!",
            description: "Sorteio excluído com sucesso.",
        });
        fetchData();
    } catch (error) {
        console.error("Error deleting raffle: ", error);
        toast({
            title: "Erro",
            description: "Ocorreu um erro ao excluir o sorteio.",
            variant: "destructive",
        });
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando sorteios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Gerenciar Sorteios</h1>
          <p className="text-muted-foreground">Crie, visualize e gerencie seus sorteios.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Sorteio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddRaffleForm onRaffleAdded={handleRaffleAdded} companies={companies} />
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Sorteios Existentes</CardTitle>
          <CardDescription>
            Aqui está uma lista de todos os seus sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participantes</TableHead>
                <TableHead className="text-right">Vencedores</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    Nenhum sorteio encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                raffles.map((raffle, index) => (
                  <TableRow key={raffle.id}>
                    <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{raffle.title}</TableCell>
                    <TableCell>{raffle.companyName || 'Super Admin'}</TableCell>
                    <TableCell>
                       <Badge variant={raffle.status === 'Ativo' ? 'default' : raffle.status === 'Concluído' ? 'secondary' : 'outline'}
                        className={`${
                            raffle.status === 'Ativo' ? 'bg-green-500 text-white' : 
                            raffle.status === 'Concluído' ? 'bg-gray-500 text-white' : 
                            'bg-yellow-500 text-white'
                        } border-transparent`}
                        >
                            {raffle.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{(raffle.participants?.length || 0)} / {raffle.totalParticipants === 0 ? '∞' : raffle.totalParticipants}</TableCell>
                    <TableCell className="text-right">{(raffle.winners?.length || 0)} / {raffle.totalWinners}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/raffle?id=${raffle.id}`}>Executar Sorteio</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(raffle)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Gerenciar Participantes</DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente o sorteio e removerá seus dados de nossos servidores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRaffle(raffle.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                       </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedRaffle && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <EditRaffleForm 
                    raffle={selectedRaffle} 
                    onRaffleEdited={handleRaffleEdited} 
                    companies={companies}
                />
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
