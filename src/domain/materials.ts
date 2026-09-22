// Suggestions, not an exhaustive list of materials supported by every recipe.
export const MATERIAL_SUGGESTIONS = [
  'Bismuth', 'Bismuth Bronze', 'Black Bronze', 'Black Steel', 'Blue Steel',
  'Brass', 'Bronze', 'Cast Iron', 'Copper', 'Gold', 'High Carbon Steel',
  'Iron', 'Nickel', 'Red Steel', 'Rose Gold', 'Silver', 'Steel', 'Sterling Silver',
  'Tin', 'Wrought Iron', 'Zinc',
];

export function normalizeMaterial(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  return MATERIAL_SUGGESTIONS.find((material) => material.toLowerCase() === trimmed.toLowerCase()) ?? trimmed;
}

export function materialTextureUrl(value: string): string {
  const material = MATERIAL_SUGGESTIONS.find((name) => name.toLowerCase() === value.trim().toLowerCase());
  if (!material) return `${import.meta.env.BASE_URL}textures/items/ingot.png`;
  const id = material === 'Iron' ? 'wrought_iron' : material.toLowerCase().replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}textures/materials/${id}.png`;
}
