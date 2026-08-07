export type ProjectStatus = "live" | "internal";

export type ProjectCategory = "enterprise-ai" | "commercial-products";

export type Visual =
  | { type: "media"; src: string }
  | { type: "branded" };

export type ProjectVideo = {
  type: "video";
  src: string;
  poster?: string;
};

export type Cta = {
  label: string;
  type: "link" | "modal";
  href?: string;
};

export type ProjectFeature = {
  title: string;
  text: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  category: ProjectCategory;
  badge: string;
  statusLabel: string;
  description: string;
  overview: string;
  note?: string;
  role: string;
  date: string;
  tech: string[];
  features: ProjectFeature[];
  stats: ProjectMetric[];
  architecture?: string[];
  preview: Visual | ProjectVideo;
  gallery: (Visual | ProjectVideo)[];
  actionPrimary: Cta;
  actionSecondary?: Cta;
};

export type WorkSection = {
  id: string;
  label: string;
  count: number;
  tagline: string;
  items: Project[];
};

export type TimelineItem = {
  year: string;
  role: string;
  company: string;
  description: string;
};