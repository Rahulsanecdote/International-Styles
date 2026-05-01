"use client";

import { useState } from "react";

interface ReviewSubmitFormProps {
  onSuccess?: () => void;
}

export default function ReviewSubmitForm({ onSuccess }: ReviewSubmitFormProps) {
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    rating: 0,
    text: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setMessage({
        type: "success",
        text: "Thank you! Your review has been submitted and will appear after verification.",
      });

      // Reset form
      setFormData({
        author: "",
        email: "",
        rating: 0,
        text: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="font-display text-3xl md:text-4xl font-light italic text-[#F5F5F5] mb-3">
          Share Your Experience
        </h3>
        <p className="text-[#F5F5F5] font-display">
          Your feedback helps us continue delivering exceptional service
        </p>
      </div>

      {/* Star Rating Picker */}
      <div className="flex flex-col items-center space-y-3">
        <label className="font-display text-sm uppercase tracking-wider text-[#C9A84C]">
          Your Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                  star <= (hoveredRating || formData.rating)
                    ? "fill-[#C9A84C] text-[#C9A84C]"
                    : "fill-none text-[#333333]"
                }`}
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
        {formData.rating > 0 && (
          <p className="text-sm text-[#F5F5F5] font-display">
            {formData.rating === 5 && "Exceptional!"}
            {formData.rating === 4 && "Great!"}
            {formData.rating === 3 && "Good"}
            {formData.rating === 2 && "Fair"}
            {formData.rating === 1 && "Poor"}
          </p>
        )}
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="author" className="block font-display text-sm uppercase tracking-wider text-[#C9A84C] mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="author"
          required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full bg-[#111111] border border-[#222222] text-[#F5F5F5] px-4 py-3 font-display focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="Your name"
        />
      </div>

      {/* Email Input (Optional) */}
      <div>
        <label htmlFor="email" className="block font-display text-sm uppercase tracking-wider text-[#C9A84C] mb-2">
          Email <span className="text-[#F5F5F5] text-xs normal-case">(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#111111] border border-[#222222] text-[#F5F5F5] px-4 py-3 font-display focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="your@email.com"
        />
      </div>

      {/* Review Text */}
      <div>
        <label htmlFor="text" className="block font-display text-sm uppercase tracking-wider text-[#C9A84C] mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="text"
          required
          rows={5}
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full bg-[#111111] border border-[#222222] text-[#F5F5F5] px-4 py-3 font-display focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
          placeholder="Tell us about your experience..."
          minLength={10}
          maxLength={1000}
        />
        <p className="text-xs text-[#F5F5F5] mt-1 font-display">
          {formData.text.length}/1000 characters (minimum 10)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || formData.rating === 0}
        className="w-full bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 font-display text-sm uppercase tracking-wider hover:bg-[#E8C96A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 border ${
            message.type === "success"
              ? "bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C]"
              : "bg-red-900/10 border-red-500 text-red-500"
          } font-display text-sm`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
