const FAVORITES_KEY = 'dmlab_favorites_v1';
const RECENTS_KEY = 'dmlab_recents_v1';
const THEME_KEY = 'dmlab_theme_v1';

export function getStoredFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : ['case-converter', 'json-formatter', 'qr-generator', 'box-shadow', 'color-palette'];
  } catch {
    return ['case-converter', 'json-formatter', 'qr-generator', 'box-shadow', 'color-palette'];
  }
}

export function saveStoredFavorites(favs: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error(e);
  }
}

export function getFavorites(): string[] {
  return getStoredFavorites();
}

export function toggleFavorite(toolId: string): string[] {
  const current = getStoredFavorites();
  const exists = current.includes(toolId);
  const updated = exists ? current.filter(id => id !== toolId) : [...current, toolId];
  saveStoredFavorites(updated);
  return updated;
}

export function getStoredRecents(): string[] {
  try {
    const data = localStorage.getItem(RECENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addStoredRecent(toolId: string) {
  try {
    const current = getStoredRecents().filter(id => id !== toolId);
    const updated = [toolId, ...current].slice(0, 10);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

export function getRecents(): string[] {
  return getStoredRecents();
}

export function addRecent(toolId: string) {
  addStoredRecent(toolId);
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error(e);
  }
}

export function getTheme(): 'light' | 'dark' {
  return getStoredTheme();
}

export function setTheme(theme: 'light' | 'dark') {
  saveStoredTheme(theme);
}
