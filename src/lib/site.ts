export const site = {
  name: "Klyx",
  url: "https://klyx.fr",
  email: "contact@klyx.fr",
  founder: "Maxime Mansiet",
  siret: "941 572 364 00029",
  city: "Bordeaux",
  calUrl: process.env.NEXT_PUBLIC_CAL_URL,
  socials: {
    linkedinCompany: "https://www.linkedin.com/company/klyx-studio",
    linkedinFounder: "https://www.linkedin.com/in/maxime-mansiet",
    instagram: "https://www.instagram.com/klyx.studio",
    github: "https://github.com/AirKyzzZ",
  },
  sisterSites: [
    { name: "Klyx Studio", url: "https://studio.klyx.fr" },
    { name: "Klyx Estate", url: "https://estate.klyx.fr" },
  ],
} as const;
