export type QuizScreenTemplate = "multiselect" | "sex";

export type QuizScreen = {
    id: string;
    editable: boolean;
    screenTemplate: QuizScreenTemplate;
    data: Record<string, unknown>;
    nextScreenId: string;
};

export type QuizConfig = {
    startScreenId: string;
    screens: QuizScreen[]
};