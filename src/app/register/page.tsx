"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'Admin' | 'Super Admin'>('Super Admin');
  const [loading, setLoading] = useState(false);
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [checkingSuperAdmin, setCheckingSuperAdmin] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      setCheckingSuperAdmin(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'Super Admin'));
      const querySnapshot = await getDocs(q);
      setShowUserTypeSelector(querySnapshot.empty);
      setCheckingSuperAdmin(false);
    };
    checkSuperAdmin();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const finalUserType = showUserTypeSelector ? userType : 'Admin';

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: finalUserType,
      });

      toast({ title: 'Sucesso!', description: 'Cadastro realizado com sucesso.' });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao se cadastrar.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      toast({
        title: 'Erro de Cadastro',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error("Error registering: ", error);
    } finally {
      setLoading(false);
    }
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
              <Input id="name" type="text" placeholder="Seu nome completo" required className="bg-background" value={name} onChange={e => setName(e.target.value)}/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="bg-background" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required className="bg-background" value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            {checkingSuperAdmin ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : showUserTypeSelector && (
              <div className="space-y-2">
                <Label htmlFor="user-type">Tipo de Usuário</Label>
                <Select required onValueChange={(value: 'Admin' | 'Super Admin') => setUserType(value)} defaultValue={userType}>
                    <SelectTrigger id="user-type" className="bg-background">
                        <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground pt-1">O primeiro usuário cadastrado será o Super Admin.</p>
              </div>
            )}
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold" disabled={loading || checkingSuperAdmin}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cadastrar"}
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
