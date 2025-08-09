"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12.27V14.2H18.15C17.84 15.86 16.94 17.26 15.53 18.23V20.65H18.98C21.1 18.78 22.56 15.79 22.56 12.25Z" fill="#4285F4" />
        <path d="M12.27 23C15.11 23 17.51 22.11 19.22 20.65L15.53 18.23C14.59 18.89 13.51 19.25 12.27 19.25C9.86 19.25 7.82 17.76 7 15.5H3.34V17.9C4.94 20.9 8.28 23 12.27 23Z" fill="#34A853" />
        <path d="M7 15.5C6.77 14.82 6.64 14.07 6.64 13.3C6.64 12.53 6.77 11.78 7 11.1V8.7H3.34C2.26 10.74 2.26 13.26 3.34 15.3L7 11.1V15.5Z" fill="#FBBC05" />
        <path d="M12.27 6.75C13.62 6.75 14.86 7.23 15.79 8.12L19.3 4.61C17.51 2.95 15.11 2 12.27 2C8.28 2 4.94 4.1 3.34 7.1L7 9.5C7.82 7.24 9.86 5.75 12.27 5.75V6.75Z" fill="#EA4335" />
    </svg>
)

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Sucesso!', description: 'Login realizado com sucesso.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro de Login',
        description: 'Credenciais inválidas. Verifique seu e-mail e senha.',
        variant: 'destructive',
      });
      console.error("Error signing in: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'Super Admin'));
        const querySnapshot = await getDocs(q);
        
        const isFirstUser = querySnapshot.empty;
        
        await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: isFirstUser ? 'Super Admin' : 'Admin'
        });
      }
      
      toast({ title: 'Sucesso!', description: 'Login realizado com sucesso.' });
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Error during Google login: ", error);
      toast({
        title: 'Erro de Login',
        description: 'Não foi possível fazer login com o Google.',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
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
          <CardTitle className="text-3xl font-headline">Acesse sua Conta</CardTitle>
          <CardDescription>Use seu e-mail ou conta Google para entrar.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pb-4">
           <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="bg-background" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required className="bg-background" value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold" disabled={loading || googleLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>
           <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
            </div>
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full text-lg py-6 rounded-full font-bold" disabled={loading || googleLoading}>
              {googleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              ) : (
                <>
                    <GoogleIcon className="mr-3 h-6 w-6"/>
                    Entrar com o Google
                </>
              )}
            </Button>
        </CardContent>
         <CardFooter className="p-8 pt-4">
            <div className="text-center text-sm text-muted-foreground w-full">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-primary hover:underline font-medium">
                    Cadastre-se
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
