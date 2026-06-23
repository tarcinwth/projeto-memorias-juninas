export async function uploadMidiaMemoria(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ url: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return reject(new Error('Cloudinary não está configurado no .env.local'));
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            mediaType: response.resource_type,
          });
        } catch (err) {
          reject(new Error('Erro ao processar resposta do Cloudinary'));
        }
      } else {
        try {
          const errResponse = JSON.parse(xhr.responseText);
          reject(new Error(errResponse.error?.message || 'Falha no upload para o Cloudinary'));
        } catch (err) {
          reject(new Error(`Falha no upload: status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Erro de rede durante o upload para o Cloudinary.'));
    xhr.send(formData);
  });
}
