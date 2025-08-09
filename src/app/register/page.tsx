
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
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
      if (querySnapshot.empty) {
        setUserType('Super Admin');
      } else {
        setUserType('Admin');
      }
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Imagem de fundo com elementos gráficos modernos e abstratos em tons de verde"
          width="1080"
          height="1920"
          className="h-full w-full object-cover"
          data-ai-hint="modern abstract background"
        />
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[400px] gap-8">
          <div className="grid gap-4">
            <Logo />
            <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Crie sua Conta Empresarial</h1>
            <p className="text-muted-foreground">
              Comece a criar e gerenciar sorteios para sua empresa.
            </p>
          </div>
          <form onSubmit={handleRegister} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" type="text" placeholder="Seu nome completo" required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {checkingSuperAdmin ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : showUserTypeSelector && (
              <div className="grid gap-2">
                <Label htmlFor="user-type">Tipo de Usuário</Label>
                <Select required onValueChange={(value: 'Admin' | 'Super Admin') => setUserType(value)} defaultValue={userType}>
                    <SelectTrigger id="user-type">
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
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="underline text-primary font-medium">
              Faça Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
