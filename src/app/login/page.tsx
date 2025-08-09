
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="mx-auto grid w-[400px] gap-8">
            <div className="grid gap-4">
                <Logo />
                <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Bem-vindo(a) de Volta</h1>
                <p className="text-muted-foreground">
                    Acesse sua conta para continuar gerenciando seus sorteios.
                </p>
            </div>
          
           <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        Esqueceu sua senha?
                    </Link>
                </div>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-full font-bold" disabled={loading || googleLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>
           <div className="relative my-2">
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
       
            <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/register" className="underline text-primary font-medium">
                    Cadastre-se
                </Link>
            </div>
        </div>
       </div>
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
    </div>
  );
}
