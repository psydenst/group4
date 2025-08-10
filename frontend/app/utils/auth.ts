// utils/auth.ts - Versão atualizada
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

// Login com Google - USANDO PKCE FLOW (mais seguro)
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Usar PKCE flow - mais seguro que implicit flow
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro no login com Google'
    };
  }
};

// Login com Email/Password
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: data.user || null
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro no login'
    };
  }
};

// Registro com Email/Password
export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: data.user || null
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro no registro'
    };
  }
};

// Logout
export const logout = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro no logout'
    };
  }
};

// Obter usuário atual
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

// Hook para escutar mudanças de auth
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

// Função para limpar dados sensíveis da URL
export const cleanUrlFromTokens = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const hasTokens = url.searchParams.has('access_token') || 
                     url.searchParams.has('refresh_token') || 
                     url.searchParams.has('code') ||
                     url.hash.includes('access_token');

    if (hasTokens) {
      // Limpar query params
      url.search = '';
      // Limpar hash
      url.hash = '';
      // Substituir no histórico sem adicionar nova entrada
      window.history.replaceState({}, '', url.pathname);
    }
  }
};


