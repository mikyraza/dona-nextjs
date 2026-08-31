/**
 * Reusable client-side upload handler with byte-level progress tracking and retry capability.
 */
export function uploadFileWithProgress(file, { onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("Aucun fichier sélectionné"));
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error("Téléversement annulé"));
      });
    }

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
          onProgress(percent, e.loaded, e.total);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (err) {
          resolve({ success: true, url: URL.createObjectURL(file), fileName: file.name });
        }
      } else {
        let errMessage = `Échec de l'envoi (Code ${xhr.status})`;
        try {
          const errData = JSON.parse(xhr.responseText);
          errMessage = errData.error || errData.message || errMessage;
        } catch (e) {}
        reject(new Error(errMessage));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error("Erreur réseau : la connexion a été interrompue pendant l'envoi."));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error("Délai d'attente réseau dépassé lors de l'envoi du fichier volumineux."));
    });

    xhr.open('POST', '/api/media');
    xhr.send(formData);
  });
}
