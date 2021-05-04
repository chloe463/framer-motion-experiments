import { gql } from "@apollo/client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { PostFragment } from "../Post/__generated__/index.generated";
import * as S from "./styles";
import { useGetCommentsQuery } from "./__generated__/index.generated";

const AVATAR_URL = "https://dummyimage.com/88x88/b3b3b3/ffffff";
const AVATAR_URL_36 = "https://dummyimage.com/36x36/b3b3b3/ffffff";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _GET_COMMENTS_FRAGMENT = gql`
  query GetComments($postId: Int!) {
    comments(postId: $postId) {
      id
      postId
      name
      email
      body
    }
  }
`;


type Props = {
  post: PostFragment;
};

export const PostDetail: React.VFC<Props> = (props) => {
  const { post } = props;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { data: commentsQueryRes, loading } = useGetCommentsQuery({
    variables: {
      postId: post.id,
    },
  });

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }
    if (contentRef.current.getBoundingClientRect().height > window.innerHeight * 0.6) {
      contentRef.current.style.position = "relative";
      contentRef.current.style.top = "15vh";
      contentRef.current.style.borderBottomLeftRadius = "0px";
      contentRef.current.style.borderBottomRightRadius = "0px";
      contentRef.current.style.paddingBottom = "96px";
    }
  }, [post, commentsQueryRes]);

  useEffect(() => {
    let original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = original;
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <S.Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ pointerEvents: "auto", overflow: "scroll" }}
        className="overlay"
      >
        <Link to={`/virtualized-list`} />
        <S.Card ref={contentRef}>
          <S.Header>
            <S.AvatarImage src={AVATAR_URL} layoutId={`avatarImage-${post.id}`}/>
            <S.PostTitle layoutId={`postTitle-${post.id}`}>
              {post.id}. {post.title}
            </S.PostTitle>
          </S.Header>
          <S.PostBody layoutId={`postId-${post.id}`}>
            <S.PostBodyText>
              {post.body}
            </S.PostBodyText>
          </S.PostBody>
          {commentsQueryRes && (
            <S.Comments>
              {commentsQueryRes.comments.map((comment) => {
                return (
                  <S.Comment key={comment?.id}>
                    <S.CommentUser>
                      <S.CommentUserAvatar src={AVATAR_URL_36} />
                      <S.CommentUserName>
                        {comment?.name}
                      </S.CommentUserName>
                    </S.CommentUser>
                    <S.CommentText>
                      {comment?.body}
                    </S.CommentText>
                  </S.Comment>
                );
              })}
            </S.Comments>
          )}
          {loading && (
            <S.Comments>
              {Array.from({ length: 5 }, (_, i) => i).map((key) => {
                return (
                  <S.CommentDummy key={key} />
                );
              })}
            </S.Comments>
          )}
        </S.Card>
      </S.Overlay>
    </>,
    document.querySelector("body") as HTMLElement
  );
};
