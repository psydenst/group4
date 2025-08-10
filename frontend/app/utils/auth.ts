// utils/auth.ts
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

// Função para limpar URL de parâmetros sensíveis
export const cleanUrlParams = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const paramsToRemove = [
      'access_token',
      'refresh_token', 
      'expires_in',
      'token_type',
      'type',
      'code',
      'state',
      'error',
      'error_code',
      'error_description'
    ];
    
    let urlChanged = false;
    paramsToRemove.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        urlChanged = true;
      }
    });
    
    // Remove hash fragments que podem conter tokens
    if (url.hash) {
      url.hash = '';
      urlChanged = true;
    }
    
    if (urlChanged) {
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }
};

// Função para processar callback OAuth e limpar URL
export const handleOAuthCallback = async (): Promise<{ user: User | null; needsRedirect: boolean }> => {
  try {
    // Primeiro, tenta obter a sessão do callback
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro no callback OAuth:', error);
      cleanUrlParams();
      return { user: null, needsRedirect: false };
    }

    // Se temos uma sessão válida, limpa a URL e retorna o usuário
    if (session?.user) {
      cleanUrlParams();
      return { user: session.user, needsRedirect: true };
    }

    // Se não temos sessão, apenas limpa a URL
    cleanUrlParams();
    return { user: null, needsRedirect: false };
  } catch (error) {
    console.error('Erro ao processar callback:', error);
    cleanUrlParams();
    return { user: null, needsRedirect: false };
  }
};

// Login com Google (mais seguro)
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
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
      password,
      options: {
        // Não redirecionar automaticamente após signup
        emailRedirectTo: undefined
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
    
    // Limpa a URL após logout
    cleanUrlParams();
    
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

// Hook para escutar mudanças de auth (mais seguro)
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    // Limpar URL imediatamente quando detectar login
    if (event === 'SIGNED_IN' && session?.user) {
      cleanUrlParams();
    }
    
    // Limpar dados sensíveis do localStorage se necessário
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('supabase-auth-token');
      cleanUrlParams();
    }
    
    callback(session?.user || null);
  });
};

// Função para verificar se o usuário está autenticado sem expor dados
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  } catch {
    return false;
  }
};

// Função segura para obter apenas informações básicas do usuário
export const getUserBasicInfo = async (): Promise<{ email?: string; id?: string } | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Retorna apenas informações não sensíveis
    return {
      email: user.email,
      id: user.id
    };
  } catch {
    return null;
  }
};








