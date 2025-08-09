"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the registration logic (e.g., call an API)
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-background">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto flex flex-col items-center gap-4">
            <Logo showText={false}/>
             <span className="text-2xl font-bold font-headline tracking-tighter">SATIVAR</span>
          </div>
          <CardTitle className="text-3xl font-headline">Crie sua Conta</CardTitle>
          <CardDescription>Preencha os campos abaixo para se cadastrar</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pb-4">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" type="text" placeholder="Seu nome completo" required className="bg-background" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required className="bg-background" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="user-type">Tipo de Usuário</Label>
                <Select required defaultValue="admin">
                    <SelectTrigger id="user-type" className="bg-background">
                        <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold">
              Cadastrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-8 pt-4">
            <div className="text-center text-sm text-muted-foreground w-full">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Faça Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

    