import Footer from '@/components/footer';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About RevoChamp | Free Tech Learning Platform',
  description:
    'Learn about RevoChamp\'s mission, vision, and commitment to providing free, industry-ready tech education for everyone.',
  openGraph: {
    title: 'About RevoChamp',
    description: 'Free tech education for everyone.',
    url: 'https://revochamp.site/about',
    images: ['https://revochamp.site/tech/about-og.png'],
  },
  robots: 'index, follow, max-image-preview:large',
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-rich-blue/5 via-white to-soft-gray/50">
          <span className="inline-block px-4 py-1.5 bg-rich-blue text-white text-sm font-semibold rounded-full shadow-md shadow-rich-blue/30">
            ✨ Our Story
          </span>
          <h1 className="mt-8 text-4xl md:text-6xl font-extrabold text-text-dark tracking-tight leading-tight">
            Empowering learners
            <br />
            <span className="bg-gradient-to-r from-rich-blue to-blue-900 bg-clip-text text-transparent">
              to build real-world skills.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-text-muted font-medium">
            Transform careers with free, industry-ready courses.
          </p>
        </section>

        {/* Mission & Vision Cards */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MissionCard />
          <VisionCard />
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-soft-gray -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">
              Why Choose RevoChamp?
            </h2>
            <p className="mt-3 text-text-muted font-medium">What makes us different</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard emoji="🎓" title="Expert-Led Courses" description="Designed by industry professionals with real-world experience" />
            <FeatureCard emoji="💰" title="Always Free" description="Learn without subscriptions, hidden fees, or limitations" />
            <FeatureCard emoji="🚀" title="Job-Ready Skills" description="Build practical projects that prepare you for real careers" />
            <FeatureCard emoji="📈" title="Learn Anytime" description="Access content anytime with lifetime availability" />
          </div>
        </section>

        {/* Our Story & Commitment */}
        <section className="py-16 space-y-10">
          <StoryCard />
          <CommitmentCard />
        </section>

        {/* Stats */}
        <section className="py-12">
          <div className="bg-gradient-to-br from-rich-blue to-blue-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-rich-blue/30 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight text-center">Impact Numbers</h2>
            <p className="text-center text-white/80 text-sm font-medium mt-1">Trusted by learners worldwide</p>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard number="100,000+" label="Learners" icon="👥" />
              <StatCard number="100+" label="Courses" icon="📚" />
              <StatCard number="50+" label="Experts" icon="👨‍🏫" />
              <StatCard number="100%" label="Free" icon="🎁" />
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-12">
          <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-10">
            <div className="text-4xl text-center">❤️</div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark text-center mt-4">
              What Our Learners Say
            </h3>
            <TestimonialCard />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12">
          <div className="bg-gradient-to-br from-[#f0f4f9] to-white border border-light-gray rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">
              Start building your future today
            </h3>
            <p className="mt-2 text-text-muted text-sm font-medium">
              Join thousands of learners mastering in-demand tech skills for free
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-rich-blue text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Start Learning Today →
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

// ========== Subcomponents ==========

function MissionCard() {
  return (
    <div className="bg-white border border-light-gray rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">🎯</div>
      <h3 className="mt-4 text-2xl font-extrabold text-text-dark tracking-tight">Our Mission</h3>
      <p className="mt-3 text-text-muted font-medium leading-relaxed">
        We make world-class education accessible to all—equipping learners with practical, job-ready skills to succeed in a rapidly evolving digital world.
      </p>
    </div>
  );
}

function VisionCard() {
  return (
    <div className="bg-white border border-light-gray rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">👁️</div>
      <h3 className="mt-4 text-2xl font-extrabold text-text-dark tracking-tight">Our Vision</h3>
      <p className="mt-3 text-text-muted font-medium leading-relaxed">
        A future where education is accessible to all, not limited by cost or location. We envision millions of learners transforming their lives through practical, real-world knowledge.
      </p>
    </div>
  );
}

function StoryCard() {
  return (
    <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">📖</div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">Our Story</h3>
      </div>
      <p className="mt-5 text-text-muted font-medium leading-relaxed">
        RevoChamp was founded with a simple belief: quality education should not be limited by cost. Built by passionate developers and educators, the platform was created to bridge the gap between learning and real-world skills.
      </p>
      <p className="mt-4 text-text-muted font-medium leading-relaxed">
        Today, RevoChamp has grown into a global learning platform, helping thousands of learners across 50+ countries gain practical skills, advance their careers, and unlock new opportunities.
      </p>
    </div>
  );
}

function CommitmentCard() {
  const commitments = [
    '✓ 100% Free Forever',
    '✓ Industry-Relevant Content',
    '✓ Regular Updates',
    '✓ Expert Instructors',
    '✓ Practical Projects',
    '✓ Community Support',
  ];

  return (
    <div className="bg-soft-gray border border-light-gray rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">💪</div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">Our Commitment</h3>
      </div>
      <p className="mt-4 text-text-dark font-bold">We are committed to delivering a learning experience you can trust:</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {commitments.map((item, idx) => (
          <span
            key={idx}
            className="px-4 py-2 bg-rich-blue/10 border border-rich-blue/20 text-rich-blue text-sm font-semibold rounded-lg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-white border border-light-gray rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl">{emoji}</div>
      <h4 className="mt-4 text-lg font-bold text-text-dark">{title}</h4>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{number}</div>
      <div className="mt-1 text-white/70 text-sm font-semibold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function TestimonialCard() {
  return (
    <div className="mt-8 bg-white border border-light-gray rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex justify-center gap-1 text-accent-gold">
        {[...Array(5)].map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="mt-4 text-text-muted italic font-medium text-center leading-relaxed">
        “I started with no coding background. RevoChamp helped me build real projects and gain confidence. Within months, I landed my first developer job.”
      </p>
      <p className="mt-4 text-text-dark font-bold text-center">— Sarah Johnson</p>
      <p className="text-text-muted text-sm text-center">Frontend Developer</p>
    </div>
  );
}