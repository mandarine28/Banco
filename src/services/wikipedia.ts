export type WikiResult = {
  title: string;
  /** Début de l'article, en texte brut. */
  extract: string;
};

const TIMEOUT_MS = 6000;

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cherche une saisie sur Wikipédia (français) et renvoie l'article le plus pertinent.
 * Aide les joueurs à trancher : l'app ne décide pas seule si la réponse est valable.
 * Renvoie `null` si aucun article ; lève une erreur si le réseau est indisponible.
 */
export async function searchWikipedia(query: string, context: string): Promise<WikiResult | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: `${query} ${context}`.trim(),
      srlimit: '1',
      format: 'json',
      origin: '*',
    });
    const response = await fetch(`https://fr.wikipedia.org/w/api.php?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Wikipédia a répondu ${response.status}`);
    const data = (await response.json()) as { query?: { search?: { title: string; snippet: string }[] } };
    const hit = data.query?.search?.[0];
    return hit ? { title: hit.title, extract: stripHtml(hit.snippet) } : null;
  } finally {
    clearTimeout(timer);
  }
}
