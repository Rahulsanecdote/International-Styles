export default function About() {
  // TODO: Replace with actual team member information
  const teamMembers = [
    {
      name: "Master Barber",
      role: "Owner & Head Barber",
      specialty: "Classic Cuts & Fades",
      experience: "20+ years",
      bio: "Bringing traditional barbering excellence to Jersey City since 2001.",
    },
    {
      name: "Senior Barber",
      role: "Senior Barber",
      specialty: "Straight Razor Shaves",
      experience: "15+ years",
      bio: "Specializing in the art of traditional straight razor techniques.",
    },
    {
      name: "Lead Stylist",
      role: "Lead Stylist",
      specialty: "Modern Styling",
      experience: "10+ years",
      bio: "Expert in contemporary cuts and professional styling.",
    },
  ];

  return (
    <section id="about" className="py-28 md:py-36 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            About Us
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-16 reveal">
          Our Story
        </h2>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-28">
          {/* Left Column - Story */}
          <div className="reveal">
            <h3 className="font-display text-3xl font-light italic text-[#F5F5F5] mb-6">
              Est. <span className="text-[#C9A84C]">2001</span>
            </h3>
            <div className="space-y-4 font-body text-sm text-[#888888] tracking-wide leading-relaxed">
              <p>
                For over two decades, International Styles has been Jersey City&apos;s destination
                for premium barbering services. What started as a vision to bring traditional
                craftsmanship to the community has grown into a legacy of excellence.
              </p>
              <p>
                We believe in the art of barbering — where every cut is a conversation, every
                shave is an experience, and every client leaves feeling their absolute best.
                Our commitment to quality and tradition has made us a cornerstone of the
                neighborhood.
              </p>
              <p>
                Step into our shop, and you&apos;ll find more than just a haircut. You&apos;ll discover
                a place where classic techniques meet modern style, where craftsmanship is
                honored, and where every detail matters.
              </p>
            </div>
          </div>

          {/* Right Column - Values */}
          <div className="reveal">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-8">
              Our Values
            </h3>
            <div className="space-y-8">
              <div className="border-l-2 border-[#C9A84C] pl-6">
                <h4 className="font-display text-xl font-medium text-[#F5F5F5] mb-2">
                  Craftsmanship
                </h4>
                <p className="font-body text-sm text-[#888888] tracking-wide">
                  Every cut is executed with precision and care, honoring the traditions of
                  classic barbering.
                </p>
              </div>

              <div className="border-l-2 border-[#C9A84C] pl-6">
                <h4 className="font-display text-xl font-medium text-[#F5F5F5] mb-2">
                  Community
                </h4>
                <p className="font-body text-sm text-[#888888] tracking-wide">
                  Building lasting relationships with our clients and giving back to the
                  neighborhood we call home.
                </p>
              </div>

              <div className="border-l-2 border-[#C9A84C] pl-6">
                <h4 className="font-display text-xl font-medium text-[#F5F5F5] mb-2">
                  Excellence
                </h4>
                <p className="font-body text-sm text-[#888888] tracking-wide">
                  Maintaining the highest standards in service, technique, and client
                  satisfaction since day one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="font-display text-4xl font-light italic text-[#F5F5F5] mb-12 reveal">
            Meet the Team
          </h3>

          {/* Team Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="border border-[#1A1A1A] bg-[#0D0D0D] p-8 group hover:border-[#C9A84C]/30 transition-all duration-500 reveal"
              >
                {/* Placeholder Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#111111] border-2 border-[#C9A84C] mb-6 flex items-center justify-center">
                  <span className="text-[#C9A84C] text-3xl">👤</span>
                </div>

                {/* Name & Role */}
                <h4 className="font-display text-2xl font-medium text-[#F5F5F5] mb-1">
                  {member.name}
                </h4>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
                  {member.role}
                </p>

                {/* Specialty */}
                <div className="mb-4 pb-4 border-b border-[#222222]">
                  <p className="font-body text-xs text-[#888888] tracking-wide mb-1">
                    Specialty
                  </p>
                  <p className="font-body text-sm text-[#F5F5F5] tracking-wide">
                    {member.specialty}
                  </p>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <p className="font-body text-xs text-[#888888] tracking-wide mb-1">
                    Experience
                  </p>
                  <p className="font-body text-sm text-[#C9A84C] tracking-wide">
                    {member.experience}
                  </p>
                </div>

                {/* Bio */}
                <p className="font-body text-xs text-[#888888] tracking-wide leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 p-6 border border-[#C9A84C]/30 bg-[#111111] reveal">
            <p className="font-body text-xs text-[#888888] tracking-wide">
              <span className="text-[#C9A84C]">Note:</span> Update team member information
              in <code className="text-[#C9A84C]">src/components/About.tsx</code> with actual
              names, photos, and bios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
