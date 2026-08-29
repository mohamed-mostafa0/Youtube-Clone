export default function ChannelBanner({ banner }) {
  if (!banner) return null;
  return (
    <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] relative overflow-hidden group">
      <img 
        src={banner} 
        alt="Channel Banner" 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}
