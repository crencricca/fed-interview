import { useInfiniteQuery } from '@tanstack/react-query';
import { GET_VIDEOS } from '../graphql/queries';
import { graphqlClient } from '../lib/graphql-client';
import type { VideosResponse } from '../types/talk';

interface UseVideosOptions {
  pageSize?: number;
  searchQuery?: string;
  topicFilter?: string;
}

export function useVideos({
  pageSize = 12,
  searchQuery = '',
  topicFilter = ''
}: UseVideosOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['videos', searchQuery, topicFilter],
    queryFn: async ({ pageParam }) => {
      const response = await graphqlClient.request<VideosResponse>(GET_VIDEOS, {
        first: pageSize,
        after: pageParam,
        search: searchQuery || undefined,
        topic: topicFilter || undefined,
      });
      let filteredResponse = { ...response };
      // if (searchQuery !== '') {
      //   const filteredEdges = response.videos.edges.filter(edge => {
      //     return edge.node.slug.includes(searchQuery);
      //   })
      //   filteredResponse = { ...response, videos: { ...response.videos, edges: filteredEdges } }
      // }
      return filteredResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.videos.pageInfo.hasNextPage ? lastPage.videos.pageInfo.endCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
}
