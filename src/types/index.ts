export type ProjectStatus = "live" | "internal" | "in-progress";

export type ProjectMetric = {
  value: string;
  label: string;
};

export type EnterpriseProject = {
  kind: "enterprise";
  name: string;
  badge: string;
  status: ProjectStatus;
  confidential: boolean;
  confidentialTitle: string;
  confidentialNote: string;
  overview: string;
  problem: string;
  challenge: string;
  architecture: string[];
  engineeringDecisions: string[];
  solution: string;
  solutionPoints: string[];
  outcome: string;
  metrics: ProjectMetric[];
  tech: string[];
  highlights: string[];
  role: string;
  date: string;
};

export type DeliverableAbstract = {
  tag: string;
  title: string;
};

export type Deliverable = {
  id: string;
  name: string;
  description: string;
  purpose: string[];
  overview?: string;
  problem?: string;
  solution?: string;
  outcome: string;
  tech: string[];
  highlights?: string[];
  abstract: DeliverableAbstract;
  linkLabel?: string;
  linkHref?: string;
  authorizedNote?: string;
  authorizedHref?: string;
};

export type CommercialEngagement = {
  kind: "commercial";
  name: string;
  badge: string;
  status: ProjectStatus;
  headline: string;
  overview: string;
  role: string;
  date: string;
  highlights: string[];
  deliverables: Deliverable[];
};

export type WorkItem = EnterpriseProject | CommercialEngagement;

export type WorkSection = {
  id: string;
  label: string;
  count: number;
  tagline: string;
  items: WorkItem[];
};

export type TimelineItem = {
  year: string;
  role: string;
  company: string;
  description: string;
};