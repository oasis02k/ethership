export type ProjectType = 'building' | 'object' | 'ether-art';

export interface NewsItem {
  _id: string;
  date: string;
  title: string;
  location?: string;
  link?: string;
}

export interface ProjectCard {
  _id: string;
  title: string;
  slug: string;
  year: number;
  type: ProjectType;
  location?: string;
  result?: string;
  cover?: {
    alt?: string;
    asset?: {
      url: string;
      metadata?: { dimensions?: { width: number; height: number } };
    };
  };
}
