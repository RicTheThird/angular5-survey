export interface Questions {
    questionId: number,
	parentQuestionCode: string,
	questionCode: string,
	questionText: string,
	questionType: string,
	isActive: boolean,
	isMandatory: boolean,
	questionSeq: number,
	accessSource: string,
    accessSourceSub: string,
    answers: Answers[]
}

export interface Answers {
    answerId: number,
    answerCode: string,
    answerText: string,
    impliedQuestionCode: string,
    answerWeight: number,
    answerSeq: number,
    active: boolean
}

export interface UIQuestAnswerObj {
    parentQuestion: Questions;
    subQuestions: Questions[];
}

export interface QuestionAnswers {
    questionAnswerId: number,
    questionId: number,
    questionCode: string,
    questionType: string,
    answerId: number,
	answerCode: string,
	referenceId: number,
    answerComment: string
}