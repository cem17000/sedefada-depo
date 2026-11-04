export const INFORMATION_PAGES = {
  about: {
    slug: 'site-hakkinda-iletisim',
    title: { tr: 'Site Hakkında ve İletişim', en: 'About and Contact' },
    description: {
      tr: 'Sedefada.com hakkında bilgi ve iletişim adresi.',
      en: 'Information about Sedefada.com and contact details.',
    },
    content: {
      tr: '<p>Sedefada.com, Sedef Adası’nın tarihi, doğası, ulaşımı ve ada yaşamına ilişkin bilgi ve anıları bir araya getiren, Cem Birder tarafından yürütülen bağımsız bir çalışmadır. Resmî bir kurumun internet sitesi değildir. Görüş, öneri ve düzeltmeleriniz için <a href="mailto:cembirder@gmail.com">cembirder@gmail.com</a> adresinden iletişime geçebilirsiniz.</p>',
      en: '<p>Sedefada.com is an independent project run by Cem Birder, bringing together information and memories about Sedef Island’s history, nature, transport and island life. It is not an official institutional website. For feedback, suggestions and corrections, please contact <a href="mailto:cembirder@gmail.com">cembirder@gmail.com</a>.</p>',
    },
  },
  privacy: {
    slug: 'gizlilik-cerezler',
    title: { tr: 'Gizlilik ve Çerezler', en: 'Privacy and Cookies' },
    description: {
      tr: 'Sedefada.com gizlilik ve çerez bilgilendirmesi.',
      en: 'Privacy and cookies information for Sedefada.com.',
    },
    content: {
      tr: '<p>Sedefada.com, Cem Birder tarafından yönetilmektedir. Sitede Google Analytics kullanılmamaktadır.</p><p>Sitenin barındırma ve performans hizmetlerini sağlayan Netlify ile sayfalara gömülü YouTube içerikleri teknik veriler işleyebilir. YouTube içerikleri üçüncü taraf çerezlerin kullanılmasına yol açabilir.</p><p>Gizlilik ve kişisel verilerle ilgili sorularınız ve talepleriniz için <a href="mailto:cembirder@gmail.com">cembirder@gmail.com</a> adresinden iletişime geçebilirsiniz.</p>',
      en: '<p>Sedefada.com is managed by Cem Birder. This website does not use Google Analytics.</p><p>Netlify, which provides hosting and performance services, and YouTube content embedded in the pages may process technical data. YouTube content may result in the use of third-party cookies.</p><p>For questions and requests regarding privacy and personal data, please contact <a href="mailto:cembirder@gmail.com">cembirder@gmail.com</a>.</p>',
    },
  },
} as const;
