import Image from "next/image";

export default function ChannelAvatar({ url, name, size = "md" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  return (
    <div className={`relative rounded-full overflow-hidden flex-shrink-0 ${sizeClasses[size]}`}>
      <Image
        src={url}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 48px) 100vw"
      />
    </div>
  );
}
