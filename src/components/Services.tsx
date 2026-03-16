export default function Services() {
  const services = [
    {
      name: "Precision Haircut",
      description: "Classic cut tailored to your style",
      price: "$35",
    },
    {
      name: "Straight Razor Shave",
      description: "Hot towel treatment with traditional technique",
      price: "$45",
    },
    {
      name: "Beard Trim & Shape",
      description: "Expert sculpting and grooming",
      price: "$25",
    },
    {
      name: "Haircut + Beard Trim",
      description: "Complete grooming package",
      price: "$55",
    },
    {
      name: "Fade / Taper",
      description: "Modern precision fading",
      price: "$40",
    },
  ];

  return (
    <section id="services" className="py-28 md:py-36 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Services
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-16 reveal">
          Our Craft
        </h2>

        {/* Services List */}
        <div className="space-y-1">
          {services.map((service, index) => (
            <div
              key={index}
              className="group border-t border-[#1A1A1A] py-8 transition-all duration-300 hover:bg-[#111111]/50 hover:border-[#C9A84C]/30 px-6 -mx-6 reveal"
            >
              <div className="flex items-start justify-between gap-8">
                {/* Service Info */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-[#F5F5F5] mb-2 transition-colors duration-300 group-hover:text-[#C9A84C]">
                    {service.name}
                  </h3>
                  <p className="font-body text-sm text-[#888888] tracking-wide">
                    {service.description}
                  </p>
                </div>

                {/* Price */}
                <div className="font-display text-2xl md:text-3xl font-medium text-[#C9A84C] whitespace-nowrap">
                  {service.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Border */}
        <div className="border-b border-[#1A1A1A] mt-1" />

        {/* Call to Action */}
        <div className="mt-16 text-center reveal">
          <a
            href="#booking"
            className="inline-flex items-center gap-4 group"
          >
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-[#888888] group-hover:text-[#C9A84C] transition-colors duration-300">
              Book Your Appointment
            </span>
            <div className="w-0 group-hover:w-12 h-px bg-[#C9A84C] transition-all duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
