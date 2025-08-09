"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const { user, loading } = useAuth(); // Use the context

    useEffect(() => {
      // Don't do anything while loading
      if (loading) {
        return;
      }
      
      // If not loading and no user, or user is not Super Admin, redirect
      if (!user || user.role !== 'Super Admin') {
        router.replace('/login');
      }
    }, [user, loading, router]);

    // While the context is loading, we can show a loader
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Verificando autenticação...</p>
        </div>
      );
    }
    
    // If the user is authorized, render the component.
    // Otherwise, the useEffect above will have already started the redirect.
    // We can return null or a loader here to prevent the component from flashing.
    if (user && user.role === 'Super Admin') {
        return <WrappedComponent {...props} />;
    }

    // Render a fallback while redirecting
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Redirecionando...</p>
        </div>
    );
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
