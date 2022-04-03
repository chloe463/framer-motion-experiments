import React from "react";
import { QuestionnaireFragment } from "../../__generated__/graphqlOperationTypes";
import { QuestionnaireListItem } from "./QuestionnaireListItem";

type Props = {
  questionnaires: QuestionnaireFragment[];
  onClickDelete: (id: number) => void;
};

export const QuestionnaireList: React.VFC<Props> = ({ questionnaires, onClickDelete }) => {
  return (
    <div>
      <ul>
        {questionnaires.map((questionnaire) => {
          return (<QuestionnaireListItem key={questionnaire.id} questionnaire={questionnaire} onClickDelete={onClickDelete} />);
        })}
      </ul>
    </div>
  );
};
