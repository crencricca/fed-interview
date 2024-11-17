export interface Speaker {
  firstname: string;
  middlename?: string;
  lastname: string;
}

export interface Topic {
  name: string;
}

export interface Image {
  url: string;
  aspectRatioName: string;
}

export interface Video {
  id: number;
  title: string;
  slug: string;
  primaryImageSet: Image[];
  presenterDisplayName: string;
  duration: number;
  canonicalUrl: string;
  viewedCount: number;
  publishedAt: string;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface VideosResponse {
  videos: {
    edges: Array<{
      cursor: string;
      node: Video;
    }>;
    pageInfo: PageInfo;
    totalCount: number;
  };
}

export interface TalkResponse {
  data: Video[];
  meta?: {
    total: number;
    page: number;
  };
}

export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};
