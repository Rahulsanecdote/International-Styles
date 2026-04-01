export default function Services() {
  const services = [
    {
      name: "Men's Haircut",
      description: "Scissor trim, fades, broads, and more",
      price: "$55",
    },
    {
      name: "Men's Haircut and Beard",
      description: "Complete cut with expert beard grooming",
      price: "$80",
    },
    {
      name: "Men's Haircut w/ Hot Towel Shave",
      description: "Full cut paired with a traditional hot towel shave",
      price: "$100",
    },
    {
      name: "Shape Up w/ Hot Towel Shave",
      description: "Clean lineup with a classic hot towel finish",
      price: "$80",
    },
    {
      name: "Shape-Up w/ Beard Trim",
      description: "Precision edges and beard sculpting",
      price: "$60",
    },
    {
      name: "Hot Towel Shave",
      description: "Traditional straight razor with hot towel treatment",
      price: "$55",
    },
    {
      name: "Beard Trim",
      description: "Expert shaping and grooming",
      price: "$35",
    },
    {
      name: "Shape Up",
      description: "Clean, precise lineup and edges",
      price: "$35",
    },
    {
      name: "Kids Regular Haircut",
      description: "For the young gentlemen",
      price: "$45",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-12 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Services
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-12 reveal">
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
                  <p className="font-display text-sm text-[#888888] tracking-wide">
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
        <div className="mt-12 text-center reveal">
          <a
            href="#booking"
            className="inline-flex items-center gap-4 group"
          >
            <span className="font-display text-[11px] tracking-[0.3em] uppercase text-[#888888] group-hover:text-[#C9A84C] transition-colors duration-300">
              Book Your Appointment
            </span>
            <div className="w-0 group-hover:w-12 h-px bg-[#C9A84C] transition-all duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
