"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <div className="mx-auto flex flex-col items-center gap-4">
            <Logo showText={false}/>
             <span className="text-2xl font-bold font-headline tracking-tighter">SATIVAR</span>
          </div>
          <CardTitle className="text-3xl font-headline">Bem-vindo de Volta</CardTitle>
          <CardDescription>Insira suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pb-4">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="admin@sativar.com" required defaultValue="admin@sativar.com" className="bg-background" />
            </div>
            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" className="bg-background" />
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-8 pt-4">
            <div className="text-center text-sm text-muted-foreground w-full">
                Não tem uma conta?{' '}
                <Link href="#" className="text-primary hover:underline font-medium">
                    Cadastre-se
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
