"use client";
import { SSRProvider } from "@react-aria/ssr";
import React, { useState } from "react";
import { getFragmentData } from "../../__generated__/gql-masking";
import { QuestionnaireFragment } from "../../__generated__/graphqlOperationTypes";
import { Snackbar, useDialog } from "../../lib";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { LoadMore } from "./LoadMore";
import { QuestionnaireList } from "./QuestionnaireList";
import { QUESTIONNAIRE_FRAGMENT, useQuestionnaireList } from "./useQuestionnaireList";

export const QuestionnaireListContainer: React.FC = () => {
  const {
    loading,
    questionnaires: _questionnaires,
    pageInfo,
    loadMore,
    deleteQuestionnaire,
    cancelToDeleteQuestionnaire,
  } = useQuestionnaireList();
  const { ref, open: openModal, close: closeModal } = useDialog({});
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<QuestionnaireFragment | null>(
    null
  );
  const [snackbarIsVisible, setSnackbarIsVisible] = useState(false);
  const questionnaires = getFragmentData(QUESTIONNAIRE_FRAGMENT, _questionnaires);

  if (loading || !questionnaires) {
    return null;
  }

  const onClickLoadMore = () => {
    loadMore();
  };

  const onClickDelete = (id: number) => {
    const q = questionnaires.find((questionnaire) => questionnaire.id === id);
    if (!q) return;
    setQuestionnaireToDelete(q);
    openModal();
  };

  const onClickSubmitDeletion = async (id: number) => {
    closeModal();
    try {
      await deleteQuestionnaire(id);
      // TODO: Show success snackbar
      setSnackbarIsVisible(true);
    } catch (e) {
      console.error(e);
      // TODO: Show error snackbar
    }
  };

  const onClickUndo = async () => {
    const id = questionnaireToDelete?.id;
    if (!id) return;
    setSnackbarIsVisible(false);
    await cancelToDeleteQuestionnaire(id);
  };

  return (
    <SSRProvider>
      <QuestionnaireList questionnaires={questionnaires} onClickDelete={onClickDelete} />
      <div className="mt-6" />
      <LoadMore pageInfo={pageInfo} loading={loading} onClickLoadMore={onClickLoadMore} />
      <DeleteConfirmationModal
        dialogRef={ref}
        questionnaire={questionnaireToDelete}
        onClose={closeModal}
        submit={onClickSubmitDeletion}
      />
      <Snackbar
        visible={snackbarIsVisible}
        duration={5000}
        position="bottom-left"
        onHide={() => setSnackbarIsVisible(false)}
      >
        <div className="flex items-center" data-cy="complete-snackbar">
          Questionnaire is successfully deleted.
          <button
            className="ml-6 font-bold text-red-bright400 hover:text-red-bright700"
            onClick={onClickUndo}
            data-cy="undo-button"
          >
            Undo
          </button>
        </div>
      </Snackbar>
    </SSRProvider>
  );
};
