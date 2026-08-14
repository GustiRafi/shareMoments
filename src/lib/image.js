const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

export async function compressImage(blob) {
  if (blob.size > MAX_SIZE) {
    throw new Error(`File too large. Maximum ${MAX_SIZE / 1024 / 1024}MB.`);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > MAX_WIDTH) {
        width = MAX_WIDTH;
        height = width / aspectRatio;
      }
      if (height > MAX_HEIGHT) {
        height = MAX_HEIGHT;
        width = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (compressed) => {
          if (!compressed) reject(new Error('Failed to compress image'));
          else resolve(compressed);
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
}

export function generateFileName() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
}
