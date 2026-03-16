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

  // TODO: Replace with actual gallery images
  // For now, using placeholder data structure
  const images: GalleryImage[] = [
    { id: 1, src: "/gallery/fade-1.jpg", alt: "Precision Fade Cut", category: "fade" },
    { id: 2, src: "/gallery/classic-1.jpg", alt: "Classic Gentleman's Cut", category: "classic" },
    { id: 3, src: "/gallery/beard-1.jpg", alt: "Beard Sculpting", category: "beard" },
    { id: 4, src: "/gallery/styling-1.jpg", alt: "Professional Styling", category: "styling" },
    { id: 5, src: "/gallery/fade-2.jpg", alt: "Modern Fade", category: "fade" },
    { id: 6, src: "/gallery/classic-2.jpg", alt: "Traditional Cut", category: "classic" },
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
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Our Work
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-6 reveal">
          Gallery
        </h2>

        {/* Subtitle */}
        <p className="font-body text-sm text-[#888888] tracking-wide mb-12 max-w-2xl reveal">
          A showcase of our craft. Every cut tells a story of precision, style, and tradition.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-16 reveal">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`font-body text-[11px] tracking-[0.3em] uppercase px-6 py-3 border transition-all duration-300 ${
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
              {/* Placeholder for actual images */}
              <div className="absolute inset-0 flex items-center justify-center text-[#C9A84C]">
                <div className="text-center">
                  <div className="font-display text-6xl mb-2">📸</div>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase">
                    {image.alt}
                  </p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/20 transition-all duration-500" />

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 border border-[#C9A84C] flex items-center justify-center">
                  <span className="text-[#C9A84C] text-lg">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note for actual implementation */}
        <div className="mt-12 p-6 border border-[#C9A84C]/30 bg-[#111111] reveal">
          <p className="font-body text-xs text-[#888888] tracking-wide">
            <span className="text-[#C9A84C]">Note:</span> Add your actual gallery images to the{" "}
            <code className="text-[#C9A84C]">/public/gallery/</code> folder and update the image paths in{" "}
            <code className="text-[#C9A84C]">src/components/Gallery.tsx</code>
          </p>
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
              <span className="font-body text-sm tracking-[0.3em] uppercase">Close ✕</span>
            </button>

            {/* Image Container */}
            <div className="relative aspect-square bg-[#111111] border border-[#C9A84C]">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-[#C9A84C]">
                <div className="text-center">
                  <div className="font-display text-9xl mb-4">📸</div>
                  <p className="font-display text-2xl mb-2">{selectedImage.alt}</p>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#888888]">
                    {selectedImage.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
