import { HeroConfig } from '@/types/topic';

interface Props {
  category: string;
  topicCount: number;
  config: HeroConfig;
}

export default function TopicHero({ category, topicCount, config }: Props) {
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-12 lg:pt-24 lg:pb-20">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">
            {topicCount > 0 ? `${topicCount}+ Free Tutorials` : config.badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          {config.title} <span className="text-blue-600">{capitalized}</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 italic px-2">
            {config.highlightedText}
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
          {config.description.replace('{category}', capitalized)}
        </p>

        {/* Chips / Technologies */}
        {config.chips.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {config.chips.map((chip, i) => (
              <span 
                key={i} 
                className="px-5 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all cursor-default"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
