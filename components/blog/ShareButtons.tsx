// components/ShareButtons.tsx
"use client";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const share = (platform: string) => {
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const platforms = [
    { name: "Twitter", icon: "𝕏", color: "hover:bg-black hover:text-white" },
    { name: "LinkedIn", icon: "in", color: "hover:bg-blue-700 hover:text-white" },
    { name: "Facebook", icon: "f", color: "hover:bg-blue-600 hover:text-white" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
        📤 Share This
      </p>
      <div className="flex gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => share(platform.name.toLowerCase())}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 text-slate-700 font-medium transition-all duration-200 transform hover:scale-110 ${platform.color}`}
            aria-label={`Share on ${platform.name}`}
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// // components/ShareButtons.tsx
// 'use client';

// export function ShareButtons({ url, title }: { url: string; title: string }) {
//   const share = (platform: string) => {
//     const shareUrls: Record<string, string> = {
//       twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
//       linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//     };
//     window.open(shareUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-4">
//       <span className="text-xs font-medium tracking-wider text-[#6B6760] uppercase">
//         Share
//       </span>
//       <div className="flex gap-2">
//         {['Twitter', 'LinkedIn', 'Facebook'].map((platform) => (
//           <button
//             key={platform}
//             onClick={() => share(platform.toLowerCase())}
//             className="px-3 py-1.5 text-xs text-[#6B6760] border border-[#DDD9D2] rounded-sm hover:bg-[#C8401E] hover:text-white hover:border-[#C8401E] transition-colors"
//             aria-label={`Share on ${platform}`}
//           >
//             {platform}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
