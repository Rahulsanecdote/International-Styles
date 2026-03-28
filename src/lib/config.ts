/**
 * Business configuration — single source of truth for all business info.
 * Import BUSINESS from here instead of hardcoding in individual components.
 */
export const BUSINESS = {
  name: "International Styles",
  phone: "201-459-9090",
  phoneDot: "201.459.9090",
  phoneTel: "+12014599090",
  phoneFormatted: "+1-201-459-9090",
  email: "info@jcbarbers.com",
  address: "278 First St",
  city: "Jersey City",
  state: "NJ",
  zip: "07302",
  fullAddress: "278 First St, Jersey City, NJ",
  url: "https://jcbarbers.com",
} as const;
