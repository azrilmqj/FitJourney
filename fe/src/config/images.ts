const unsplash = (photo: string, width = 1000) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`;

// Online images are centralized here. No photo files are bundled with the app.
export const images = {
  hero: unsplash('photo-1581009146145-b5ef050c2e1e', 1200),
  strength: unsplash('photo-1517836357463-d25dfeac3438'),
  gym: unsplash('photo-1517836357463-d25dfeac3438'),
};
