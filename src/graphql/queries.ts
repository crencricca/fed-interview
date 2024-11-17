import { gql } from 'graphql-request';

export const TRANSLATION_VIDEO_FRAGMENT = gql`
  fragment TranslationVideoInfo on Video {
    id
    talkExtras {
      footnotes {
        author
        annotation
        date
        linkUrl
        source
        text
        timecode
        title
        category
      }
    }
  }
`;

export const TRANSLATION_FRAGMENT = gql`
  fragment TranslationInfo on Translation {
    id
    language {
      id
      endonym
      englishName
      internalLanguageCode
      rtl
    }
    paragraphs {
      cues {
        text
        time
      }
    }
  }
`;

export const VIDEO_FRAGMENT = gql`
  fragment VideoInfo on Video {
    id
    title
    slug
    presenterDisplayName
    publishedAt
    primaryImageSet {
      url
      aspectRatioName
    }
    duration
    viewedCount
  }
`;

export const GET_VIDEOS = gql`
  query videos($first: Int, $after: String) {
    videos(
      first: $first
      after: $after
      channel: ALL
      isPublished: true
    ) {
      edges {
        cursor
        node {
          ...VideoInfo
          ...TranslationVideoInfo
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
  ${VIDEO_FRAGMENT}
  ${TRANSLATION_VIDEO_FRAGMENT}
`;
