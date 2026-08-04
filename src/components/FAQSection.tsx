import { useState } from 'react';
import { useLanguage } from '../lib/useLanguage';

interface FAQItem {
  question: { tr: string; en: string };
  answer: { tr: string; en: string };
}

const faqData: FAQItem[] = [
  {
    question: {
      tr: "Sedef Adası'na nasıl gidilir?",
      en: "How to get to Sedef Island?"
    },
    answer: {
      tr: "Sedef Adası'na Kartal'dan ve Büyükada'dan özel motorlarla veya Bostancı'dan şehir hatları vapurlarıyla ulaşabilirsiniz. Sabiha Gökçen Havalimanı bağlantısı M4 Metro hattı ile sağlanır; taksi ile iskeleye 10 dakikada ulaşabilirsiniz. Marmaray Metro hattı ise iskeleye sadece 250 metre mesafededir; sitemizden İstanbul'un her hangi bir metro istasyonundan Kartal'a Marmaray metro istasyonu rota ve sürelerine ulaşabilirsiniz.",
      en: "You can reach Sedef Island by private motorboats from Kartal and Büyükada, or by City Lines ferries from Bostancı. Sabiha Gökçen Airport is connected via the M4 Metro Line, and the Kartal pier can be reached by taxi in approximately 10 minutes from the metro station. The Marmaray rail line is located only 250 metres from the pier. On our website, you can also find routes and estimated travel times from any metro station in Istanbul to Kartal."
    }
  },
  {
    question: {
      tr: "Sedef Adası vapur saatleri nelerdir?",
      en: "What are the ferry schedules to Sedef Island?"
    },
    answer: {
      tr: "Bostancı ve Büyükada bağlantılı güncel vapur seferleri saatleri şehir hatlarından takip edilebilir. Büyükada'dan Sedef Adası'na çok sınırlı sayıda şehir hatları seferi vardır. Ancak, Kartal ve Büyükada'dan motorlar sabit sefer saati olmaksızın doldukça kalkmaktadır; özellikle Yaz sezonunda haftasonları ulaşım saatleri sıklaşmaktadır. Ayrıca, Sedefadalılar Derneği üyelerine özel tekne seferleri saatleri için sayfamızdaki tarife tablolarını inceleyebilirsiniz. Seferler mevsim içinde de değişiklik göstermektedir.",
      en: "Up-to-date ferry timetables for services from Bostancı and Büyükada are available from City Lines. There are only a limited number of City Lines ferry services between Büyükada and Sedef Island. However, private motorboats from Kartal and Büyükada do not operate on fixed schedules; they depart as they fill with passengers. During the summer season, especially on weekends, departures become much more frequent. Members of the Sedef Islanders Association can also refer to the timetable tables on our website for information about the association's dedicated boat services. Please note that all schedules are subject to seasonal changes."
    }
  },
  {
    question: {
      tr: "Sedef Adası'na metro ile nasıl gidilir?",
      en: "How to get to Sedef Island by metro?"
    },
    answer: {
      tr: "İstanbul'un her yerinden Kartal Marmaray istasyonu'na gelip, buradan yürüyerek 5-10 dakika içinde iskeleye ulaşabilirsiniz. Sabiha Gökçen Havalimanı bağlantısı M4 Kartal metro istasyonu ile sağlanır; taksi ile yaklaşık 10 dakikada iskeleye ulaşabilirsiniz. Web sitemizden (sayfanın başında) İstanbul'un her hangi bir metro istasyonundan Kartal'a Marmaray metro istasyonu rota ve hesaplanan yaklaşık seyahat sürelerine ulaşabilirsiniz.",
      en: "From anywhere in Istanbul, you can travel to Kartal Marmaray Station and reach the ferry pier withın a 5–10 minute walk. Sabiha Gökçen Airport is connected to the M4 Metro Line, which serves Kartal Metro Station. From there, the ferry pier is approximately a 10-minute taxi ride away. On our website (at the top of the page), you can find the Marmaray metro routes to Kartal from any metro station in Istanbul, along with estimated travel times."
    }
  },
  {
    question: {
      tr: "Sedef Adası giriş ücretli mi?",
      en: "Is there an entrance fee for Sedef Island?"
    },
    answer: {
      tr: "Sedef Adası'na giriş ücretsizdir. Ancak adanın bir bölümü özel mülkiyette olduğu için ziyaretçi kabul politikaları hakkında bilgi almanız önerilir. Adada plaj ve lokanta hizmeti veren işletmeler mevcuttur. Bir ek bilgi verelim, adada bakkal yoktur; tedarikli olmanız gerekebilir.",
      en: "Entry to Sedef Island is free of charge. However, as part of the island is privately owned, it is advisable to check the current visitor access policy before your visit. The island has businesses offering beach facilities and restaurants. One additional note: there are no shops or supermarkets on the island, so you may wish to bring any essentials you might need."
    }
  }
];

export function FAQSection() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-8 mb-6" aria-label="Sıkça Sorulan Sorular">
      <h2 className="text-xl md:text-2xl font-bold text-sedef-primary mb-6 flex items-center gap-2">
        <span className="text-2xl">❓</span>
        {lang === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
      </h2>
      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-sedef-border rounded-xl bg-sedef-card-bg overflow-hidden transition-all duration-200 hover:border-sedef-accent/40"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-sedef-accent/30 transition-colors"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-sedef-primary pr-4 flex-1">
                {faq.question[lang as 'tr' | 'en'] || faq.question.en}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-sedef-accent/10 text-sedef-accent transition-transform duration-200 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-5 pb-4 pt-2 text-sedef-secondary leading-relaxed">
                {faq.answer[lang as 'tr' | 'en'] || faq.answer.en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}