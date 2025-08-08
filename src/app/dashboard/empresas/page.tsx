"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Loader2, Globe, Instagram, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Company } from "@/lib/types";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddCompanyForm } from "@/components/add-company-form";
import { EditCompanyForm } from "@/components/edit-company-form";

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);


  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "companies"));
      const companiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
      setEmpresas(companiesData);
    } catch (error) {
      console.error("Error fetching companies: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleCompanyAdded = () => {
    fetchEmpresas();
    setIsAddModalOpen(false);
  }
  
  const handleCompanyEdited = () => {
    fetchEmpresas();
    setIsEditModalOpen(false);
    setSelectedCompany(null);
  }

  const openEditModal = (empresa: Company) => {
    setSelectedCompany(empresa);
    setIsEditModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando empresas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Empresas (Clientes)</h1>
          <p className="text-muted-foreground">Gerencie suas empresas clientes aqui.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para cadastrar uma nova empresa.
              </DialogDescription>
            </DialogHeader>
            <AddCompanyForm onCompanyAdded={handleCompanyAdded} />
          </DialogContent>
        </Dialog>
      </header>
       <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Visualize e gerencie as empresas que utilizam o sistema de sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contatos</TableHead>
                <TableHead className="text-right">Sorteios</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas.map((empresa, index) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{empresa.name}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant={empresa.status === 'Ativo' ? 'default' : 'secondary'}
                      className={empresa.status === 'Ativo' ? 'bg-green-500 text-white border-transparent' : 'bg-gray-500 text-white border-transparent'}
                    >
                      {empresa.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {empresa.whatsapp && <Link href={`https://wa.me/${empresa.whatsapp}`} target="_blank"><MessageSquare className="h-5 w-5 text-green-500"/></Link>}
                      {empresa.instagram && <Link href={`https://instagram.com/${empresa.instagram}`} target="_blank"><Instagram className="h-5 w-5 text-pink-500"/></Link>}
                      {empresa.site && <Link href={empresa.site} target="_blank"><Globe className="h-5 w-5 text-blue-500"/></Link>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{empresa.rafflesCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(empresa)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Ver Sorteios</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedCompany && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-background">
                <DialogHeader>
                    <DialogTitle>Editar Empresa</DialogTitle>
                    <DialogDescription>
                        Atualize os dados da empresa.
                    </DialogDescription>
                </DialogHeader>
                <EditCompanyForm company={selectedCompany} onCompanyEdited={handleCompanyEdited} />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
