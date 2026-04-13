import { Metadata } from 'next';
import Footer from '@/components/footer';
import TermsStructuredData from '@/components/termsStructuredData';
import AcceptButton from '@/components/AcceptButton';

export const metadata: Metadata = {
  title: 'Terms of Service | RevoChamp User Agreement',
  description:
    'Review RevoChamp terms and conditions to understand your rights and responsibilities while using our platform.',
  openGraph: {
    title: 'Terms of Service | RevoChamp',
    description: 'Review RevoChamp terms and conditions to understand your rights and responsibilities.',
    url: 'https://revochamp.site/tech/terms',
    images: ['https://revochamp.site/tech/terms-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@revochamp',
    creator: '@revochamp',
    title: 'Terms of Service | RevoChamp',
    description: 'Review RevoChamp terms and conditions to understand your rights and responsibilities.',
    images: ['https://revochamp.site/tech/terms-og.png'],
  },
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://revochamp.site/tech/terms',
  },
  keywords: [
    'terms of service RevoChamp',
    'user agreement',
    'platform terms',
    'legal conditions',
    'learning platform rules',
  ],
};

export default function TermsPage() {
  return (
    <>
      <TermsStructuredData />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-rich-blue/5 via-white to-soft-gray/50">
            <span className="inline-block px-4 py-1.5 bg-rich-blue text-white text-sm font-semibold rounded-full shadow-md shadow-rich-blue/30">
              ⚖️ Legal Agreement
            </span>
            <h1 className="mt-8 text-4xl md:text-6xl font-extrabold text-text-dark tracking-tight leading-tight">
              Our commitment
              <br />
              <span className="bg-gradient-to-r from-rich-blue to-blue-900 bg-clip-text text-transparent">
                to you.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg text-text-muted font-medium">
              Clear, fair terms that protect both you and our learning community.
            </p>
            <p className="mt-3 text-sm text-text-light font-medium">Effective: January 2026</p>
          </section>

          {/* Key Principles Cards */}
          <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrincipleCard
              icon="🛡️"
              title="Fair & Transparent"
              description="Clear terms that protect both learners and our platform."
              bgColor="bg-rich-blue/10"
            />
            <PrincipleCard
              icon="✓"
              title="Your Rights"
              description="Understand what you can expect from our service."
              bgColor="bg-success/10"
            />
            <PrincipleCard
              icon="⚡"
              title="Community Safety"
              description="Guidelines that ensure a positive learning environment."
              bgColor="bg-yellow-500/10"
            />
          </section>

          {/* Key Terms Grid */}
          <section className="py-16 bg-soft-gray -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">
                Key Terms
              </h2>
              <p className="mt-3 text-text-muted font-medium">What you need to know</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TermCard emoji="📋" title="Use License" description="Personal, non-commercial use of our learning materials" />
              <TermCard emoji="🎯" title="User Conduct" description="Respectful behavior and community guidelines" />
              <TermCard emoji="🛡️" title="Intellectual Property" description="Course content is protected by copyright" />
              <TermCard emoji="⚖️" title="Limitations" description="Clear terms about liability and warranties" />
            </div>
          </section>

          {/* Detailed Terms Sections */}
          <section className="py-16 space-y-10">
            <UsageTermsCard />
            <UserConductCard />
            <IntellectualPropertyCard />
            <DisclaimerCard />
          </section>

          {/* Additional Terms Section */}
      {/* Acceptance CTA */}
          <section className="py-12">
            <div className="bg-gradient-to-br from-soft-gray to-white border border-light-gray rounded-2xl p-6 md:p-10 text-center">
              <span className="text-5xl">🤝</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight mt-4">
                By using RevoChamp, you agree to these terms
              </h3>
              <p className="mt-3 text-text-muted text-sm md:text-base max-w-2xl mx-auto">
                We're committed to providing a safe, fair learning environment for everyone
              </p>
              {/* ✅ Client Component for interactive button */}
              <AcceptButton />
            </div>
          </section>
        </div>

     <Footer />
 
       </main>
    </>
  );
}

// ========== Subcomponents (Server Components – no 'use client') ==========

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

function TermCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-white border border-light-gray rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl">{emoji}</div>
      <h4 className="mt-4 text-lg font-bold text-text-dark">{title}</h4>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function AdditionalTermCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-white/80 text-xs">{description}</p>
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

function UsageTermsCard() {
  return (
    <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">
          📋
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Use License & Access</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="Personal, non-commercial use of course materials is permitted" />
        <BulletPoint text="One temporary download copy for personal viewing only" />
        <BulletPoint text="Cannot modify, copy, or distribute course content" />
        <BulletPoint text="No commercial use or public display of materials" />
        <BulletPoint text="Cannot decompile or reverse engineer any software" />
        <BulletPoint text="Must retain all copyright and proprietary notices" />
      </div>
    </div>
  );
}

function UserConductCard() {
  return (
    <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">
          🎯
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">User Conduct & Responsibilities</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="Treat all community members with respect and professionalism" />
        <BulletPoint text="Do not harass or cause distress to other users" />
        <BulletPoint text="No transmission of obscene or offensive content" />
        <BulletPoint text="Do not disrupt normal platform operations" />
        <BulletPoint text="No unauthorized access attempts to our systems" />
        <BulletPoint text="Report violations to our support team" />
      </div>
    </div>
  );
}

function IntellectualPropertyCard() {
  return (
    <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">
          🛡️
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Intellectual Property</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="All course materials are property of RevoChamp" />
        <BulletPoint text="Videos, lectures, quizzes are copyright protected" />
        <BulletPoint text="No reproduction or distribution without permission" />
        <BulletPoint text="Course content is for personal learning only" />
        <BulletPoint text="Trademarks and logos cannot be used without consent" />
        <BulletPoint text="User-generated content remains your property" />
      </div>
    </div>
  );
}

function DisclaimerCard() {
  return (
    <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <h3 className="text-2xl font-extrabold text-text-dark tracking-tight">Disclaimer & Limitations</h3>
      </div>
      <div className="space-y-1">
        <BulletPoint text="Materials provided 'as is' without warranties" />
        <BulletPoint text="No guarantee of accuracy or completeness" />
        <BulletPoint text="Not liable for indirect or consequential damages" />
        <BulletPoint text="Maximum liability limited to amount paid (if any)" />
        <BulletPoint text="Content may be updated without prior notice" />
        <BulletPoint text="Use at your own discretion and risk" />
      </div>
    </div>
  );
}