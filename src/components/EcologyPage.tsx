import { Fragment, useEffect, useState, type ReactNode } from 'react';
import type { Lang } from '../lib/i18n';

type EcologyBlock =
  | { type: 'section'; content: string }
  | { type: 'subsection'; content: string }
  | { type: 'paragraph'; content: string };

const ECOLOGY_SOURCE_URLS: Record<Lang, string> = {
  tr: '/sedefada%20ekoloji%2001',
  en: '/sedefada%20ecology%2001',
};

function parseEcologyText(source: string): EcologyBlock[] {
  return source
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('### ')) {
        return { type: 'subsection', content: block.slice(4) };
      }

      if (block.startsWith('## ')) {
        return { type: 'section', content: block.slice(3) };
      }

      return { type: 'paragraph', content: block };
    });
}

function renderInlineText(text: string): ReactNode {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function EcologyPage({ lang }: { lang: Lang }) {
  const [blocks, setBlocks] = useState<EcologyBlock[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setBlocks([]);
    setHasError(false);

    async function loadEcologyContent() {
      try {
        const response = await fetch(ECOLOGY_SOURCE_URLS[lang], { signal: controller.signal });
        if (!response.ok) throw new Error(`Ecology content request failed: ${response.status}`);

        setBlocks(parseEcologyText(await response.text()));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setHasError(true);
      }
    }

    loadEcologyContent();
    return () => controller.abort();
  }, [lang]);

  if (hasError) {
    return (
      <div className="blog-card p-6 text-sm text-sedef-secondary">
        {lang === 'tr' ? 'Ekoloji içeriği yüklenemedi.' : 'Ecology content could not be loaded.'}
      </div>
    );
  }

  if (blocks.length === 0) {
    return <div className="h-48 animate-pulse rounded-xl bg-sedef-border/20" />;
  }

  return (
    <article className="blog-card p-6 md:p-8">
      <div className="prose ecology-content max-w-none text-sedef-primary">
        {blocks.map((block, index) => {
          if (block.type === 'section') {
            return <h2 key={index}>{block.content}</h2>;
          }

          if (block.type === 'subsection') {
            return <h3 key={index}>{block.content}</h3>;
          }

          return <p key={index}>{renderInlineText(block.content)}</p>;
        })}
      </div>
    </article>
  );
}