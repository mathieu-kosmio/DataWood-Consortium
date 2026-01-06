
export type PageStatus = 'draft' | 'stable' | 'deprecated';

export interface PageMetadata {
  title: string;
  description: string;
  status: PageStatus;
  version: string;
  lastUpdated: string;
  contributors: string[];
}

export interface DocPage {
  id: string;
  path: string;
  file?: string;
  metadata: PageMetadata;
  content: string;
}

export interface NavItem {
  title: string;
  path?: string;
  children?: NavItem[];
}
