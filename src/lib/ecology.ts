export type EcologyBlock =
  | { type: 'section'; content: string }
  | { type: 'subsection'; content: string }
  | { type: 'paragraph'; content: string };

export function parseEcologyText(source: string): EcologyBlock[] {
  return source.trim().split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean).map((block) => {
    if (block.startsWith('### ')) return { type: 'subsection', content: block.slice(4) };
    if (block.startsWith('## ')) return { type: 'section', content: block.slice(3) };
    return { type: 'paragraph', content: block };
  });
}
