interface BlogCardProps {
  title: string;
  content: string;
  contentClassName?: string;
  publishedAt: string;
  categories: string[];
  type: 'POST' | 'PAGE';
  isSimulated?: boolean;
  hideTitle?: boolean;
}

function wrapNewspaperClipping(content: string) {
  const parsedContent = new DOMParser().parseFromString(content, 'text/html');
  const separator = Array.from(parsedContent.body.querySelectorAll('p')).find(
    (paragraph) => paragraph.textContent?.trim() === '* * *',
  );

  if (!separator) return content;

  const clipping = parsedContent.createElement('div');
  clipping.className = 'newspaper-clipping';

  while (parsedContent.body.firstChild && parsedContent.body.firstChild !== separator) {
    clipping.appendChild(parsedContent.body.firstChild);
  }

  const headline = clipping.querySelector('h2');
  if (headline) {
    const isEnglish = headline.textContent?.includes('SEDEF ISLAND');
    const image = parsedContent.createElement('img');
    image.src = '/kapri1.png';
    image.alt = isEnglish
      ? 'Milliyet newspaper clipping about Sedef Island'
      : 'Milliyet gazetesindeki Sedef Adası haberi kupürü';

    const caption = parsedContent.createElement('figcaption');
    caption.textContent = isEnglish
      ? 'Milliyet Newspaper, July 28, 1956'
      : 'Milliyet Gazetesi, 28 Temmuz 1956';

    const figure = parsedContent.createElement('figure');
    figure.className = 'newspaper-image';
    figure.append(image, caption);
    headline.after(figure);
  }

  parsedContent.body.insertBefore(clipping, separator);
  return parsedContent.body.innerHTML;
}

export function BlogCard({
  title,
  content,
  contentClassName = '',
  hideTitle = false,
}: BlogCardProps) {
  const renderedContent = contentClassName === 'memories-content'
    ? wrapNewspaperClipping(content)
    : content;

  return (
    <article className="glass-card p-6 sm:p-8 flex flex-col gap-0 hover:shadow-xl transition-all duration-300 group">
      {/* Başlık - SEO için h2 olarak */}
      {!hideTitle && title && (
        <h2 className="text-xl md:text-2xl font-bold text-sedef-primary mb-4 pb-3 border-b border-sedef-border">
          {title}
        </h2>
      )}
      
      {/* 
        prose-sedef: Özel tipografi stilin.
        [&_p]:my-6: Her <p> etiketinin üstüne ve altına 24px boşluk ekler.
        [&_br]:my-6: Eğer <br> ile satır atlandıysa onları 24px boşluğa dönüştürür.
        prose-p:my-0: Prose eklentisinin kendi varsayılan boşluklarını ezerek çakışmayı önler.
      */}
      <div
        className={`prose prose-sedef max-w-none text-sm sm:text-base text-sedef-primary/90 leading-relaxed 
                   [&_p]:my-6 
                   [&_br]:block [&_br]:my-6
                   prose-p:my-0 prose-headings:my-0
                   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
                   [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-6 [&_h4]:mb-2 ${contentClassName}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </article>
  );
}
