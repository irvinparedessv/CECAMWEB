export interface User {
  name: string;
  role: string;
  website: string;
  imageUrl: string;
  socialLinks: SocialLink[];
  metrics: Metric[];
}

interface SocialLink {
  icon: string;
  url: string;
}

interface Metric {
  label: string;
  value: number;
}


