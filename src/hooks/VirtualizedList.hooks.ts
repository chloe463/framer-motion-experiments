import { gql, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { GetPostConnectionQuery, GetPostConnectionQueryVariables } from "./__generated__/GetPostConnectionQuery";
import { PostFragment as Post } from "./__generated__/PostFragment";

const PostFragment = gql`
  fragment PostFragment on Post {
    id
    userId
    title
    body
  }
`;

const GET_POSTS_QUERY = gql`
  query GetPostConnectionQuery($first: Int, $after: String, $query: String) {
    postConnection(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        node {
          ...PostFragment
        }
        cursor
      }
    }
  }
  ${PostFragment}
`;

const DEFAULT_FETCH_SIZE = 10;
const FIRST_CURSOR = "0";
const EMPTY_POSTS: Post[] = [];

type State = {
  posts: Post[];
  lastCursor: string;
}

const lastElement = <T>(a: T[]): T => a.slice(-1)[0];

export const useVirtualizedList = () => {
  const [variables, setVariables] = useState<GetPostConnectionQueryVariables>({
    first: DEFAULT_FETCH_SIZE,
    after: FIRST_CURSOR,
    query: "",
  });
  const { data, loading, refetch, fetchMore } = useQuery<
    GetPostConnectionQuery,
    GetPostConnectionQueryVariables
  >(GET_POSTS_QUERY, {
    variables,
  });

  const { posts, lastCursor } = useMemo<State>(() => {
    if (!data || !data.postConnection || !data.postConnection.edges) {
      return { posts: EMPTY_POSTS, lastCursor: "0" };
    }
    const m = new Map();
    data.postConnection.edges.forEach((edge) => m.set(edge.node.id, edge.node));
    const posts = Array.from(m.values());
    const lastCursor = lastElement(data.postConnection.edges).cursor || `${lastElement(posts).id}`;

    return { posts, lastCursor };
  }, [data]);

  const { fetchMorePosts, refetchPosts } = useMemo(() => ({
    fetchMorePosts: async () => {
      await fetchMore({
        query: GET_POSTS_QUERY,
        variables: {
          ...variables,
          after: lastCursor,
        },
      });
      setVariables((prev) => ({
        ...prev,
        after: lastCursor,
      }));
    },
    refetchPosts: async (query: string) => {
      await refetch({
        ...variables,
        first: DEFAULT_FETCH_SIZE,
        after: FIRST_CURSOR,
        query,
      });
      setVariables((prev) => ({
        ...prev,
        first: DEFAULT_FETCH_SIZE,
        after: FIRST_CURSOR,
        query,
      }));
    },
  }), [fetchMore, lastCursor, refetch, variables]);

  return {
    data,
    totalCount: data?.postConnection.totalCount || 0,
    posts,
    postsLoading: loading,
    refetchPosts,
    fetchMorePosts,
  };
};
