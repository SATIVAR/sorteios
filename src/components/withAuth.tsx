"use client";

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // User is logged in, now check their role
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.role === 'Super Admin') {
              setIsAuthorized(true);
            } else {
              // Not a super admin, redirect to login
              router.replace('/login');
            }
          } else {
             // User document doesn't exist, redirect
             router.replace('/login');
          }
        } else {
          // No user logged in
          router.replace('/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Verificando autenticação...</p>
        </div>
      );
    }
    
    if(!isAuthorized) {
        // This will show briefly before redirect or if redirect fails.
        // Or you can return a dedicated "Not Authorized" component.
        return (
            <div className="flex items-center justify-center h-screen">
              <p>Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
