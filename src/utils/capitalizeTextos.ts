export function capitalizeTextos(text: string): string {
  if (!text) return text;
  return text
    .split(' ')
    .map(word => {
      if (word.length === 2 && word !== word.toLowerCase()) {
        // Respeta la capitalización original si la palabra tiene 2 caracteres y no está completamente en minúsculas
        return word;
      } else if (word.length === 2) {
        return word.toLowerCase();
      } else if (word === word.toUpperCase()) {
        return word;
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join(' ');
}

