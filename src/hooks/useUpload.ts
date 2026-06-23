'use client';

import { useState, useCallback } from 'react';
import { uploadMidiaMemoria } from '@/lib/cloudinary';

export interface UseUploadReturn {
  upload: (file: File) => Promise<string>;
  progresso: number;
  uploading: boolean;
  erro: string | null;
  resetar: () => void;
}

export function useUpload(): UseUploadReturn {
  const [progresso, setProgresso] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    setProgresso(0);
    setErro(null);

    try {
      const result = await uploadMidiaMemoria(file, (percent) => {
        setProgresso(percent);
      });
      setUploading(false);
      return result.url;
    } catch (err: any) {
      let mensagem = 'Ocorreu um erro ao fazer o upload. Tente novamente.';
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.message?.includes('network')) {
        mensagem = 'Falha na conexão. Verifique sua internet e tente novamente.';
      } else if (err?.message?.includes('large') || err?.message?.includes('size')) {
        mensagem = 'O arquivo é muito grande. O limite máximo é 50MB.';
      } else if (err?.message) {
        mensagem = `Erro no upload: ${err.message}`;
      }
      
      setErro(mensagem);
      setUploading(false);
      throw err;
    }
  }, []);

  const resetar = useCallback(() => {
    setProgresso(0);
    setUploading(false);
    setErro(null);
  }, []);

  return {
    upload,
    progresso,
    uploading,
    erro,
    resetar,
  };
}
