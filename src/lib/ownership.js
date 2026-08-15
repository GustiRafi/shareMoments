const STORAGE_KEY = 'sharemoments_my_photos';

export function getMyPhotoIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read photo ownership from localStorage:', err);
    return [];
  }
}

export function addMyPhotoId(id) {
  if (!id) return;
  try {
    const current = getMyPhotoIds();
    if (!current.includes(id)) {
      const updated = [id, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to save photo ownership to localStorage:', err);
  }
}

export function isMyPhoto(id) {
  if (!id) return false;
  const current = getMyPhotoIds();
  return current.includes(id);
}

export function removeMyPhotoId(id) {
  if (!id) return;
  try {
    const current = getMyPhotoIds();
    const updated = current.filter((myId) => myId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove photo ownership from localStorage:', err);
  }
}
