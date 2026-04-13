// ShareButtons.tsx
'use client';
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const share = (platform: string) => {
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    window.open(shareUrls[platform], '_blank');
  };
  return (
    <div className="flex gap-4">
      <button onClick={() => share('twitter')} className="text-[#6B6760] hover:text-black">Twitter</button>
      <button onClick={() => share('linkedin')} className="text-[#6B6760] hover:text-black">LinkedIn</button>
      <button onClick={() => share('facebook')} className="text-[#6B6760] hover:text-black">Facebook</button>
    </div>
  );
}
