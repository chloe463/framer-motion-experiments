import { motion } from "framer-motion";
import styled from "styled-components";

export const SelectedItemsContainer = styled.div`
  display: flex;
  margin: 64px auto;
  padding: 24px;
  width: 720px;
  overflow-x: scroll;
  line-height: 48px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.03);
  &:empty {
    height: 48px;
  }
`;
// const SelectedItemPillLayoutAnimator = styled(motion.span)`
export const SelectedItemPillLayoutAnimator = styled.span`
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition-property: all;
  & + & {
    margin-left: 8px;
  }
`;

export const SelectedItemPillFadeInAnimator = styled(motion.span)``;

export const SelectedItemPillBase = styled.span`
  background: rgba(0, 0, 0, 0.4);
  font-size: 16px;
  font-weight: 300;
  line-height: 28px;
  padding: 8px 24px;
  border-radius: 9999vmax;
  color: white;
  word-break: keep-all;
  cursor: pointer;
`;
