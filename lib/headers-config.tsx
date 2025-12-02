export const header = {
  default: "Default",
  amber: "Amber Minimal",
  vercel: "Vercel",
  caffeine: "Caffeine",
  claude: "Claude",
  darkmatter: "DarkMatter",
  fancey: "Fancey",
  whitekoala: "White Koala",
} as const;

export type HeaderName = keyof typeof header;
