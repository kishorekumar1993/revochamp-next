export default function ContactStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': 'https://revochamp.site/tech/contact',
        name: 'Contact RevoChamp',
        url: 'https://revochamp.site/tech/contact',
        description: 'Official contact page for RevoChamp support and help',
        inLanguage: 'en',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://revochamp.site/tech/contact',
        },
        publisher: {
          '@type': 'Organization',
          name: 'RevoChamp',
          url: 'https://revochamp.site',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@revochamp.site',
            url: 'https://revochamp.site/tech/contact',
            availableLanguage: ['English'],
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How can I contact support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact our support team via email at support@revochamp.site or by using the contact form on this page.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does it take to get a response?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We typically respond to all inquiries within 24 hours on business days (Monday–Friday).',
            },
          },
          {
            '@type': 'Question',
            name: 'What are your support hours?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our support team is available Monday–Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      id="contact-page-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}