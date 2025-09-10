export type Option = {
    id: string;
    text: string;
    imageUrl?: string;
};

export type Question = {
    id: string;
    content: string;
    options: Option[];
    correctIndex: number | undefined;
    image?: string;
    marks?: number;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
};

export type Test = {
    id: string;
    name: string;
    tags: string[];
    questions: Question[];
};
