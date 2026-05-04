import type { Note } from "@/services/noteStorage";

export function scoreMatch(note: Note, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const haystack = `${note.title} ${note.content}`.toLowerCase();
  if (haystack.includes(q)) return 3;
  const trigrams = (s: string) => {
    const set = new Set<string>();
    for (let i = 0; i <= s.length - 3; i++) set.add(s.slice(i, i + 3));
    return set;
  };
  const qTri = trigrams(q);
  const hTri = trigrams(haystack);
  let overlap = 0;
  qTri.forEach(t => {
    if (hTri.has(t)) overlap++;
  });
  return qTri.size > 0 ? overlap / qTri.size : 0;
}
