import { Metadata } from 'next';
import Footer from '@/components/footer';
;
import ContactStructuredData from '@/components/contactStructuredData';
import ContactForm from '@/components/contactForm';

export const metadata: Metadata = {
  title: 'Contact RevoChamp | Support, Help & Enquiries',
  description:
    'Contact RevoChamp for support, queries, and feedback. Get help with courses, technical issues, and learning guidance.',
  openGraph: {
    title: 'Contact RevoChamp',
    description: 'Official contact page for RevoChamp support and help.',
    url: 'https://revochamp.site/tech/contact',
    images: ['https://revochamp.site/tech/contact-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@revochamp',
    creator: '@revochamp',
    title: 'Contact RevoChamp',
    description: 'Official contact page for RevoChamp support and help.',
    images: ['https://revochamp.site/tech/contact-og.png'],
  },
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://revochamp.site/tech/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactStructuredData />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-rich-blue/5 via-white to-soft-gray/50">
            <span className="inline-block px-4 py-1.5 bg-rich-blue text-white text-sm font-semibold rounded-full shadow-md shadow-rich-blue/30">
              💬 Get in Touch
            </span>
            <h1 className="mt-8 text-4xl md:text-6xl font-extrabold text-text-dark tracking-tight leading-tight">
              We'd love to
              <br />
              <span className="bg-gradient-to-r from-rich-blue to-blue-900 bg-clip-text text-transparent">
                hear from you.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg text-text-muted font-medium">
              Have questions, feedback, or suggestions? Reach out to us — we're here to help!
            </p>
          </section>

          {/* Quick Contact Cards */}
          <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickContactCard
              icon="📧"
              title="Email Us"
              detail="support@revochamp.site"
              bgColor="bg-rich-blue/10"
              iconColor="text-rich-blue"
            />
            <QuickContactCard
              icon="💬"
              title="Live Chat"
              detail="Available during business hours"
              bgColor="bg-success/10"
              iconColor="text-success"
            />
            <QuickContactCard
              icon="🌐"
              title="Social Media"
              detail="@RevoChamp"
              bgColor="bg-yellow-500/10"
              iconColor="text-yellow-600"
            />
          </section>

          {/* Contact Methods Grid */}
          <section className="py-16 bg-soft-gray -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">
                Connect With Us
              </h2>
              <p className="mt-3 text-text-muted font-medium">Multiple ways to reach our team</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ContactMethodCard emoji="📧" title="Email Support" description="24/7 email support for all inquiries" />
              <ContactMethodCard emoji="💬" title="Live Chat" description="Real-time assistance during business hours" />
              <ContactMethodCard emoji="📞" title="Phone Support" description="Priority support for urgent matters" />
              <ContactMethodCard emoji="🌐" title="Community Forum" description="Connect with other learners" />
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16">
            <ContactForm />
          </section>

          {/* Support Hours Section */}
          <section className="py-12">
            <div className="bg-gradient-to-br from-rich-blue to-blue-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-rich-blue/30 text-white">
              <div className="text-5xl text-center">⏰</div>
              <h2 className="text-3xl font-extrabold tracking-tight text-center mt-4">Support Hours</h2>
              <p className="text-center text-white/80 text-sm font-medium mt-1">
                We're here to help when you need us
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                <SupportHourCard day="Monday - Friday" hours="9:00 AM - 6:00 PM" icon="💼" />
                <SupportHourCard day="Saturday" hours="10:00 AM - 4:00 PM" icon="🌤️" />
                <SupportHourCard day="Sunday" hours="Closed" icon="😴" />
                <SupportHourCard day="Response Time" hours="Within 24 hours" icon="⚡" />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12">
            <div className="bg-gradient-to-br from-soft-gray to-white border border-light-gray rounded-2xl p-6 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">❓</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="space-y-4">
                <FaqItem
                  question="How can I contact support?"
                  answer="You can contact our support team via email at support@revochamp.site or by using the contact form above."
                />
                <FaqItem
                  question="How long does it take to get a response?"
                  answer="We typically respond to all inquiries within 24 hours on business days (Monday–Friday)."
                />
                <FaqItem
                  question="What are your support hours?"
                  answer="Our support team is available Monday–Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM."
                />
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}

// ========== Subcomponents ==========

function QuickContactCard({ icon, title, detail, bgColor, iconColor }: {
  icon: string;
  title: string;
  detail: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white border border-light-gray rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center text-2xl ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-extrabold text-text-dark">{title}</h4>
        <p className="text-sm text-text-muted font-medium">{detail}</p>
      </div>
    </div>
  );
}

function ContactMethodCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-white border border-light-gray rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl">{emoji}</div>
      <h4 className="mt-4 text-lg font-bold text-text-dark">{title}</h4>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function SupportHourCard({ day, hours, icon }: { day: string; hours: string; icon: string }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white font-bold text-sm">{day}</p>
        <p className="text-white/80 text-xs font-medium">{hours}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-white border border-light-gray rounded-xl p-4 group">
      <summary className="font-semibold text-text-dark cursor-pointer list-none flex justify-between items-center">
        {question}
        <span className="text-rich-blue group-open:rotate-180 transition">▼</span>
      </summary>
      <p className="mt-3 text-sm text-text-muted leading-relaxed">{answer}</p>
    </details>
  );
}