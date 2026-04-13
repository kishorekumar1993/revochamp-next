import { Metadata } from 'next';
import Footer from '@/components/footer';
import PrivacyStructuredData from '@/components/PrivacyStructuredData';

export const metadata: Metadata = {
  title: 'Privacy Policy | RevoChamp Data Protection & Security',
  description:
    'Read RevoChamp privacy policy to understand how we collect, use, and protect your data securely.',
  openGraph: {
    title: 'Privacy Policy | RevoChamp',
    description: 'Read RevoChamp privacy policy to understand how we collect, use, and protect your data.',
    url: 'https://revochamp.site/tech/privacy',
    images: ['https://revochamp.site/tech/privacy-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@revochamp',
    creator: '@revochamp',
    title: 'Privacy Policy | RevoChamp',
    description: 'Read RevoChamp privacy policy to understand how we collect, use, and protect your data.',
    images: ['https://revochamp.site/tech/privacy-og.png'],
  },
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://revochamp.site/tech/privacy',
  },
  keywords: [
    'privacy policy RevoChamp',
    'data protection',
    'GDPR compliance',
    'user privacy',
    'security practices',
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <PrivacyStructuredData />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-rich-blue/5 via-white to-soft-gray/50">
            <span className="inline-block px-4 py-1.5 bg-rich-blue text-white text-sm font-semibold rounded-full shadow-md shadow-rich-blue/30">
              🔒 Your Privacy Matters
            </span>
            <h1 className="mt-8 text-4xl md:text-6xl font-extrabold text-text-dark tracking-tight leading-tight">
              Protecting your
              <br />
              <span className="bg-gradient-to-r from-rich-blue to-blue-900 bg-clip-text text-transparent">
                data & privacy.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg text-text-muted font-medium">
              We are committed to protecting your personal information and being transparent about how we use it.
            </p>
            <p className="mt-3 text-sm text-text-light font-medium">Last updated: January 2026</p>
          </section>

          {/* Key Principles Cards */}
          <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrincipleCard
              icon="🔐"
              title="Your Data is Safe"
              description="We use bank-level encryption to protect your information at all times."
              bgColor="bg-rich-blue/10"
            />
            <PrincipleCard
              icon="👁️"
              title="Full Transparency"
              description="We're clear about what data we collect and why we need it."
              bgColor="bg-success/10"
            />
            <PrincipleCard
              icon="⚡"
              title="You're in Control"
              description="Access, update, or delete your personal data anytime."
              bgColor="bg-yellow-500/10"
            />
          </section>

          {/* Policy Grid */}
          <section className="py-16 bg-soft-gray -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">
                Our Privacy Practices
              </h2>
              <p className="mt-3 text-text-muted font-medium">
                How we collect, use, and protect your information
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <PolicyCard emoji="📋" title="Information Collection" description="We collect only essential data to provide and improve our services" />
              <PolicyCard emoji="🎯" title="Usage of Data" description="Your information helps personalize your learning experience" />
              <PolicyCard emoji="🛡️" title="Data Protection" description="Industry-standard security measures protect your information" />
              <PolicyCard emoji="✓" title="Your Rights" description="You have full control over your personal data" />
            </div>
          </section>

          {/* Detailed Policy Sections */}
          <section className="py-16 space-y-10">
            <DataCollectionCard />
            <DataUsageCard />
            <DataSecurityCard />
            <DataRightsCard />
          </section>

          {/* Contact Section */}
          <section className="py-12">
            <div className="bg-gradient-to-br from-rich-blue to-blue-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-rich-blue/30 text-white">
              <div className="text-5xl text-center">📞</div>
              <h2 className="text-3xl font-extrabold tracking-tight text-center mt-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-center text-white/80 text-sm font-medium mt-1">
                We're here to help with any privacy concerns
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ContactCard icon="🔒" label="Privacy Concerns" email="privacy@revochamp.site" />
                <ContactCard icon="📊" label="Data Requests" email="data@revochamp.site" />
                <ContactCard icon="💬" label="General Support" email="support@revochamp.site" />
                <ContactCard icon="🛡️" label="Security Issues" email="security@revochamp.site" />
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

function PrincipleCard({ icon, title, description, bgColor }: {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white border border-light-gray rounded-2xl p-6 shadow-sm">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <h4 className="mt-4 text-xl font-extrabold text-text-dark tracking-tight">{title}</h4>
      <p className="mt-2 text-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PolicyCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-white border border-light-gray rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl">{emoji}</div>
      <h4 className="mt-4 text-lg font-bold text-text-dark">{title}</h4>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function ContactCard({ icon, label, email }: { icon: string; label: string; email: string }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-white font-bold text-sm">{email}</p>
      </div>
    </div>
  );
}

function BulletPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-1.5 h-1.5 bg-rich-blue rounded-full mt-2 shrink-0" />
      <p className="text-sm text-text-muted font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function DataCollectionCard() {
  return (
    <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">
          📋
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Information We Collect</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="Account Information: Name, email address, and profile details you provide during registration" />
        <BulletPoint text="Learning Data: Your course progress, quiz results, completion rates, and learning patterns" />
        <BulletPoint text="Device Information: Device type, operating system, browser type, and unique device identifiers" />
        <BulletPoint text="Usage Data: Pages visited, time spent on courses, features used, and interaction patterns" />
        <BulletPoint text="Analytics: Anonymous analytics data to help us improve our platform and user experience" />
      </div>
    </div>
  );
}

function DataUsageCard() {
  return (
    <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">
          🎯
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">How We Use Your Information</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="To provide, maintain, and improve our educational services" />
        <BulletPoint text="To personalize your learning experience and course recommendations" />
        <BulletPoint text="To send important course updates, progress reports, and educational communications" />
        <BulletPoint text="To analyze usage patterns and optimize our platform performance" />
        <BulletPoint text="To comply with legal obligations and protect our users' rights" />
        <BulletPoint text="To prevent fraud and ensure platform security" />
      </div>
    </div>
  );
}

function DataSecurityCard() {
  return (
    <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">
          🛡️
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Data Security & Protection</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="We implement industry-standard security measures including AES-256 encryption" />
        <BulletPoint text="All data is encrypted in transit using TLS 1.3 and at rest using secure storage" />
        <BulletPoint text="We conduct regular security audits, penetration testing, and vulnerability assessments" />
        <BulletPoint text="Access to personal data is strictly restricted to authorized personnel only" />
        <BulletPoint text="We fully comply with GDPR, CCPA, and other international privacy regulations" />
        <BulletPoint text="Regular backups ensure your data is never lost" />
      </div>
    </div>
  );
}

function DataRightsCard() {
  return (
    <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Your Rights & Choices</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="Right to Access: Request a complete copy of your personal data" />
        <BulletPoint text="Right to Rectify: Update or correct any inaccurate information" />
        <BulletPoint text="Right to Erasure: Request permanent deletion of your data" />
        <BulletPoint text="Right to Restrict: Limit how we use your data for specific purposes" />
        <BulletPoint text="Right to Portability: Export your data in a machine-readable format" />
        <BulletPoint text="Right to Object: Opt-out of certain data processing activities" />
      </div>
    </div>
  );
}