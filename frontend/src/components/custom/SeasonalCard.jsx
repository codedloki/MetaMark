import React from 'react';
import { useNavigate } from 'react-router-dom';

const cn = (...classes) => classes.filter(Boolean).join(" ");

const SeasonCard = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  className,
  path // This prop will be received from the parent
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // FIX 1: Navigate only if a path is provided.
    // This also uses the path directly, making it more flexible.
    // The caller can now provide '/about' or 'about' and it will work as expected.
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-end p-6 w-full md:w-1/3 h-[350px] lg:h-[400px] bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:w-2/3",
        // Make the cursor a pointer if a path exists to indicate it's clickable
        path ? "cursor-pointer" : "",
        className
      )}
      onClick={handleCardClick}
    >
      <img
        src={imageSrc}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 z-0"
        alt={imageAlt || title}
      />
      <div className="absolute inset-0 bg-transparent bg-opacity-60 z-10"></div>

      <div className="relative z-20 space-y-2">
        <h2 className="text-xl font-bold text-white ">{title}</h2>
        <p className="text-sm text-gray-300">{subtitle}</p>
      </div>

      <div className="relative z-20 mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <p className="text-lg text-white">{description}</p>
      </div>

    </div>
  );
};

export function SeasonalHoverCards({ cards, className }) {
  return (
    <div className={cn("flex flex-wrap md:flex-nowrap gap-4 w-full px-4", className)}>
      {cards.map((card, index) => (
        <SeasonCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          path={card.path} // FIX 2: Pass the path from the card object to the SeasonCard component
        />
      ))}
    </div>
  );
}