// utils/adminCheck.ts
import { getCurrentUser } from './auth';

// Lista de emails admin
const ADMIN_EMAILS = [
  'psydenst.dev@gmail.com',
	'rapha4.lx@gmail.com',
	'arthurmarcelolima@gmail.com'

];

// Função simples para verificar se o usuário atual é admin
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return false;
    
    return ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}
