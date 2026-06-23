import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export async function entrarComGoogle(): Promise<UserCredential | void> {
  // Se for celular (que costuma bloquear popup em navegadores in-app como Instagram/WhatsApp), usar signInWithRedirect
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    const { signInWithRedirect } = await import('firebase/auth');
    return signInWithRedirect(auth, googleProvider);
  } else {
    return signInWithPopup(auth, googleProvider);
  }
}

// Mantendo o alias antigo caso seja usado em outro lugar
export const loginComGoogle = entrarComGoogle;

export async function loginComEmail(email: string, senha: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, senha);
}

export async function cadastrarComEmail(email: string, senha: string, nome: string): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  await updateProfile(userCredential.user, {
    displayName: nome,
  });
  return userCredential;
}

export async function logout(): Promise<void> {
  return signOut(auth);
}

export async function recuperarSenha(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function atualizarPerfilAuth(nome: string, photoURL?: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Usuário não autenticado');
  
  await updateProfile(auth.currentUser, {
    displayName: nome,
    ...(photoURL && { photoURL }),
  });
}
