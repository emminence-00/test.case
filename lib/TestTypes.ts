export type Option = {
    id: string;
    text: string;
    imageUrl?: string;
};

export type Question = {
    id: string;
    type:"mcq"|"short_answer"|"true_false"|"fill_in_the_blank";
    content: string;
    options: Option[];
    correctIndex?: number; // for mcq and true_false
    correct: number | undefined|string|null;
    imageUrl?: string;
    marks?: number;
    imgMaxWidth?:number; 
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
};

export type Test = {
    id: string;
    name: string;
    tags: string[];
    questions: Question[];
};
