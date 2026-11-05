/**
 * Cadrage plein écran d'une illustration : taille « cover » et décalage horizontal qui centre
 * le point `focus` (0 = bord gauche de l'image, 1 = bord droit), sans jamais montrer de vide.
 */
export function coverFrame(imageAspect: number, screenWidth: number, screenHeight: number) {
  const height = Math.max(screenHeight, screenWidth / imageAspect);
  return { width: height * imageAspect, height };
}

export function focusOffset(imageWidth: number, screenWidth: number, focus: number): number {
  return Math.min(0, Math.max(screenWidth - imageWidth, screenWidth / 2 - focus * imageWidth));
}
