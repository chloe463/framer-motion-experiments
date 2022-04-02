import { gql } from "@apollo/client";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { colors } from "../../lib";
import { QuestionnaireFragment } from "../../__generated__/graphqlOperationTypes";
import { Chart } from "./Chart";
import { Pencil } from "./Pencil";
import { Trash } from "./Trash";

const DUMMY_COVER_IMAGE_URL = "https://dummyimage.com/128x64/b3b3b3/ffffff";

export const QUESTIONNAIRE_FRAGMENT = gql`
  fragment Questionnaire on Questionnaire {
    id
    title
    description
    state
    startAt
    endAt
    questions {
      id
    }
  }
`;

type Props = {
  questionnaire: QuestionnaireFragment;
};

const STATES: string[] = [
  "Draft", "Published", "Hidden", "Expired"
];

const INDICATOR_COLORS: string[] = [
  colors.blackAlpha200,
  colors.brand,
  colors.blackAlpha400,
  colors.blackAlpha500,
];

export const Questionnaire: React.VFC<Props> = ({ questionnaire }) => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseOver = useCallback((_e: React.MouseEvent) => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onClickAnswers = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("answers clicked");
  }, []);

  const onClickTrash = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("trash clicked");
  }, []);

  return (
    <li onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <div className="relative flex items-center py-3 px-6 hover:bg-black-alpha50">
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DUMMY_COVER_IMAGE_URL} className="rounded" width={128} height={64} alt="cover-image" />
        <div className="ml-4">
          <Link href={`/questionnaires/${questionnaire.id}`}>
            <a>
              <h3 className="text-subheading text-black-alpha800 tracking-wide font-semibold hover:text-black-alpha700 hover:underline">
                {questionnaire.title}
              </h3>
            </a>
          </Link>
          <div className="flex items-center">
            <span className="inline-block w-[14px] h-[14px] rounded-full" style={{ backgroundColor: INDICATOR_COLORS[questionnaire.state] }}/>
            <p className="ml-2 text-body2 text-black-alpha500">
              {STATES[questionnaire.state]}
            </p>
            <span className="ml-2 text-body1 text-black-alpha500">/</span>
            <p className="ml-2 text-body2 text-black-alpha500">
              {questionnaire.questions.length} questions
            </p>
          </div>
        </div>
        <div
          className="absolute flex items-center right-6 transition-transform duration-200 space-x-4"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(16px)"
          }}
        >
          <Link href={{ pathname: `/questionnaires/${questionnaire.id}/edit` }}>
            <a aria-label={`Edit a questionnaire ${questionnaire.id}`}>
              <Pencil className="block text-black-alpha400 hover:text-black-alpha500 w-8 h-8 transition-colors duration-200 ease-in" />
            </a>
          </Link>
          <button onClick={onClickAnswers} aria-label={`See result of questionnaire ${questionnaire.id}`}>
            <Chart  className="block text-black-alpha400 hover:text-black-alpha500 w-8 h-8 transition-colors duration-200 ease-in" />
          </button>
          <button onClick={onClickTrash} aria-label={`Delete a questionnaire ${questionnaire.id}`}>
            <Trash  className="block text-black-alpha400 hover:text-black-alpha500 w-8 h-8 transition-colors duration-200 ease-in" />
          </button>
        </div>
      </div>
    </li>
  );
};
