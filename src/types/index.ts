export type Project = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  context: string;
  challenge: string;
  solution: string;
  outcome: string;
};

export type TimelineItem = {
  year: string;
  role: string;
  company: string;
  description: string;
};