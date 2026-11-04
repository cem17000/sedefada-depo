import { Fragment, type ReactNode } from 'react';
import type { Lang } from '../lib/i18n';
import { parseEcologyText } from '../lib/ecology';
import turkishEcology from '../../public/sedefada ekoloji 01?raw';
import englishEcology from '../../public/sedefada ecology 01?raw';

function renderInlineText(text: string): ReactNode {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function EcologyPage({ lang }: { lang: Lang }) {
  const blocks = parseEcologyText(lang === 'tr' ? turkishEcology : englishEcology);

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