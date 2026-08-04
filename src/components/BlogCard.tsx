interface BlogCardProps {
  title: string;
  content: string;
  publishedAt: string;
  categories: string[];
  type: 'POST' | 'PAGE';
  isSimulated?: boolean;
  hideTitle?: boolean;
}

export function BlogCard({
  title,
  content,
  hideTitle = false,
}: BlogCardProps) {
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
        className="prose prose-sedef max-w-none text-sm sm:text-base text-sedef-primary/90 leading-relaxed 
                   [&_p]:my-6 
                   [&_br]:block [&_br]:my-6
                   prose-p:my-0 prose-headings:my-0
                   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
                   [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-6 [&_h4]:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
