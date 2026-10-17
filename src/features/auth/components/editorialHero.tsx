import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface EditorialSlide {
  id: string;
  image: string;
  capsuleTag: string;
  editionNumber: string;
  statement: string;
  collection: string;
}

const EDITORIAL_SLIDES: EditorialSlide[] = [
  {
    id: 'slide-1',
    image: '/images/auth-editorial.png',
    capsuleTag: 'Autumn / Winter Capsule',
    editionNumber: 'N° 04 / 24',
    statement:
      '“Tailoring redefined through architectural proportion and tactile poise.”',
    collection: 'ATELIER Studio Milano — Bespoke Editions',
  },
  {
    id: 'slide-2',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    capsuleTag: 'Master Atelier Collection',
    editionNumber: 'N° 08 / 24',
    statement:
      '“Effortless silhouettes engineered with timeless artisan craftsmanship.”',
    collection: 'ATELIER Studio Milano — Master Atelier',
  },
  {
    id: 'slide-3',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    capsuleTag: 'Monolith Minimal Series',
    editionNumber: 'N° 12 / 24',
    statement:
      '“Precision cutting meeting sensual drapery in pure monolithic forms.”',
    collection: 'ATELIER Studio Milano — Permanent Collection',
  },
  {
    id: 'slide-4',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    capsuleTag: 'Cashmere & Silk Capsule',
    editionNumber: 'N° 18 / 24',
    statement:
      '“An ode to understated luxury, where every stitch tells a story of devotion.”',
    collection: 'ATELIER Studio Milano — Couture Line',
  },
];

/**
 * Editorial fashion carousel rendered on the left column of Auth screens.
 * Features automatic smooth crossfade transitions, progress indicators,
 * manual navigation, and pause-on-hover capability.
 */
export const EditorialHero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance slides every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EDITORIAL_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % EDITORIAL_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + EDITORIAL_SLIDES.length) % EDITORIAL_SLIDES.length,
    );
  };

  const activeSlide = EDITORIAL_SLIDES[currentIndex];

  return (
    <div
      className="group relative hidden w-full overflow-hidden bg-neutral-900 text-white lg:flex lg:w-1/2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with Crossfade */}
      {EDITORIAL_SLIDES.map((slide, idx) => (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.capsuleTag}
          onError={(e) => {
            // Fallback to local image if network fails
            (e.currentTarget as HTMLImageElement).src =
              '/images/auth-editorial.png';
          }}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Subtle Dark Gradient Overlay for Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

      {/* Foreground Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 xl:p-12">
        {/* Top Bar: Capsule Badge & Edition Number */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-widest text-neutral-900 uppercase backdrop-blur-md shadow-sm transition-all duration-500">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
            {activeSlide.capsuleTag}
          </span>
          <span className="font-mono text-xs tracking-widest text-white/90 uppercase">
            {activeSlide.editionNumber}
          </span>
        </div>

        {/* Bottom Section: Statement, Branding & Carousel Controls */}
        <div className="space-y-6">
          <div className="max-w-lg space-y-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">
              Collection Statement
            </p>
            <h2 className="min-h-[5.5rem] font-serif text-2xl font-light leading-snug tracking-tight text-white transition-opacity duration-500 sm:text-3xl xl:text-4xl">
              {activeSlide.statement}
            </h2>
            <div className="flex items-center gap-3 pt-2 text-xs font-light tracking-wider text-white/80">
              <span>{activeSlide.collection.split('—')[0]?.trim()}</span>
              <span className="h-px w-6 bg-white/40" />
              <span>{activeSlide.collection.split('—')[1]?.trim()}</span>
            </div>
          </div>

          {/* Carousel Slide Indicators & Arrows */}
          <div className="flex items-center justify-between border-t border-white/20 pt-4">
            {/* Dash / Bar Indicators */}
            <div className="flex items-center gap-2">
              {EDITORIAL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1 cursor-pointer rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Previous & Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous look"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/30 text-white/80 backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next look"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/30 text-white/80 backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
