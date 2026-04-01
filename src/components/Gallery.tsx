"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "fade" | "classic" | "beard" | "styling";
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const images: GalleryImage[] = [
    { id: 1, src: "/gallery/fade-1.jpg", alt: "Precision Fade Cut", category: "fade" },
    { id: 2, src: "/gallery/fade-2.jpg", alt: "Modern Fade with Line Design", category: "fade" },
    { id: 3, src: "/gallery/classic-1.jpg", alt: "Classic Gentleman's Cut", category: "classic" },
    { id: 4, src: "/gallery/classic-2.jpg", alt: "Traditional Styling", category: "classic" },
    { id: 5, src: "/gallery/beard-1.jpg", alt: "Beard Trim & Sculpting", category: "beard" },
    { id: 6, src: "/gallery/styling-1.jpg", alt: "Professional Hair Styling", category: "styling" },
  ];

  const categories = [
    { value: "all", label: "All Work" },
    { value: "fade", label: "Fades" },
    { value: "classic", label: "Classic Cuts" },
    { value: "beard", label: "Beard Work" },
    { value: "styling", label: "Styling" },
  ];

  const filteredImages = filter === "all"
    ? images
    : images.filter(img => img.category === filter);

  return (
    <section id="gallery" className="py-28 md:py-36 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Our Work
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-6 reveal">
          Gallery
        </h2>

        {/* Subtitle */}
        <p className="font-display text-sm text-[#888888] tracking-wide mb-12 max-w-2xl reveal">
          A showcase of our craft. Every cut tells a story of precision, style, and tradition.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-16 reveal">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`font-display text-[11px] tracking-[0.3em] uppercase px-6 py-3 border transition-all duration-300 ${
                filter === cat.value
                  ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]"
                  : "border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden bg-[#111111] border border-[#1A1A1A] group cursor-pointer"
              onClick={() => setSelectedImage(image)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Actual Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/40 transition-all duration-500" />

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 border border-[#C9A84C] bg-[#0A0A0A]/80 flex items-center justify-center">
                  <span className="text-[#C9A84C] text-xl font-light">+</span>
                </div>
              </div>

              {/* Image Caption on Hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-[#C9A84C] hover:text-[#E8C96A] transition-colors"
            >
              <span className="font-display text-sm tracking-[0.3em] uppercase">Close ✕</span>
            </button>

            {/* Image Container */}
            <div className="relative aspect-square bg-[#111111] border-2 border-[#C9A84C]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="mt-6 text-center">
              <p className="font-display text-2xl md:text-3xl font-light italic text-[#F5F5F5] mb-2">
                {selectedImage.alt}
              </p>
              <p className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
                {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
