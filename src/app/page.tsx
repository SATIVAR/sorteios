"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-background">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-headline">Bem-vindo de Volta</CardTitle>
          <CardDescription>Insira suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="admin@sativar.com" required defaultValue="admin@sativar.com" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required defaultValue="password" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select defaultValue="admin">
                <SelectTrigger id="role" className="bg-background">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
