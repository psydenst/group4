// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../utils/auth';

// Lista de emails admin
const ADMIN_EMAILS = [
  'psydenst.dev@gmail.com',

];

export default function AdminPage() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await getCurrentUser();
        
        // Se não está logado OU não é admin, redireciona
        if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
          router.push('/');
          return;
        }
        
        // Se chegou aqui, é admin
        setIsChecking(false);
      } catch (error) {
        // Em caso de erro, redireciona
        router.push('/');
      }
    }

    checkAdmin();
  }, [router]);

  // Enquanto verifica, mostra loading
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verificando acesso...</div>
      </div>
    );
  }

  // Se chegou aqui, é admin - renderiza sua página
  return (
    <div>
      <h1>Painel Administrativo</h1>
      {/* Seu conteúdo admin aqui */}
    </div>
  );
}
