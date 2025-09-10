import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question } from "@/lib/TestTypes";

// Lightweight id generator
export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

// Better auto-math formatting with combined sub/sup
export function autoMathify(text: string) {
  return text
    // combined sub+sup: x_i^2 or x^2_i -> $x_{i}^{2}$
    .replace(/\b([A-Za-z])_([A-Za-z0-9]+)\^([A-Za-z0-9]+)\b/g, (_, b, sub, sup) => `$${b}_{${sub}}^{${sup}}$`)
    .replace(/\b([A-Za-z])\^([A-Za-z0-9]+)_([A-Za-z0-9]+)\b/g, (_, b, sup, sub) => `$${b}_{${sub}}^{${sup}}$`)
    // exponents: 2x^2 -> $...$
    .replace(/([0-9a-zA-Z])\^([0-9]+)/g, (_: any, base: string, exp: string) => `$${base}^{${exp}}$`)
    // subscripts: x_1 -> $...$
    .replace(/([0-9a-zA-Z])_([0-9]+)/g, (_: any, base: string, sub: string) => `$${base}_{${sub}}$`)
    // simple fractions: single letters to avoid URLs
    .replace(/\b([a-zA-Z])\/([a-zA-Z])\b/g, (_: any, num: string, den: string) => `$\\frac{${num}}{${den}}$`);
}

export type UseQuizEditorOptions = {
  autosave?: boolean;
  autosaveKey?: string; // if not provided we generate one
};

export function useQuizEditor(opts: UseQuizEditorOptions = {}) {
  const { autosave = true, autosaveKey } = opts;

  const initialId = useMemo(() => autosaveKey || uid("quiz_"), [autosaveKey]);

  const [title, setTitle] = useState<string>(() => {
    if (typeof window === "undefined") return "Untitled quiz";
    try {
      const saved = localStorage.getItem(initialId + ":title");
      return saved || "Untitled quiz";
    } catch {
      return "Untitled quiz";
    }
  });

  const [tags, setTags] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(initialId + ":tags");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (typeof window === "undefined")
      return [
        {
          id: uid("q_"),
          content:
            "Type your question here. Example: 2x^2 or a/b. Inline: E=mc^2. Display: $$\\frac{a^2+b^2}{c^2}$$",
          options: [
            { id: uid("o_"), text: "Option A" },
            { id: uid("o_"), text: "Option B" },
          ],
          correct: null,
          imageUrl: "",
          imgMaxWidth: 360,
        },
      ];

    try {
      const saved = localStorage.getItem(initialId + ":questions");
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      {
        id: uid("q_"),
        content:
          "Type your question here. Example: 2x^2 or a/b. Inline: E=mc^2. Display: $$\\frac{a^2+b^2}{c^2}$$",
        type: "mcq",
        options: [
          { id: uid("o_"), text: "Option A" },
          { id: uid("o_"), text: "Option B" },
        ],
        correct: null,
        imageUrl: "",
        imgMaxWidth: 360,
      },
    ];
  });

  // Autosave every 2 minutes and on changes
  useEffect(() => {
    if (!autosave) return;
    const id = initialId;
    try {
      localStorage.setItem(id + ":title", title);
      localStorage.setItem(id + ":tags", JSON.stringify(tags));
      localStorage.setItem(id + ":questions", JSON.stringify(questions));
    } catch {}
  }, [autosave, initialId, title, tags, questions]);

  useEffect(() => {
    if (!autosave) return;
    const id = initialId;
    const t = setInterval(() => {
      try {
        localStorage.setItem(id + ":title", title);
        localStorage.setItem(id + ":tags", JSON.stringify(tags));
        localStorage.setItem(id + ":questions", JSON.stringify(questions));
      } catch {}
    }, 2 * 60 * 1000);
    return () => clearInterval(t);
  }, [autosave, initialId, title, tags, questions]);

  // CRUD helpers
  const setQuestionsAndSave = useCallback((next: Question[]) => {
    setQuestions(next);
  }, []);

  const addQuestion = useCallback(() => {
    const q: Question = {
      id: uid("q_"),
      type: "mcq",
      content: "New question",
      options: [
        { id: uid("o_"), text: "Option 1" },
        { id: uid("o_"), text: "Option 2" },
      ],
      correct: null,
      imageUrl: "",
      imgMaxWidth: 360,
    };
    setQuestionsAndSave([...questions, q]);
  }, [questions, setQuestionsAndSave]);

  const removeQuestion = useCallback(
    (qId: string) => setQuestionsAndSave(questions.filter((q) => q.id !== qId)),
    [questions, setQuestionsAndSave]
  );

  const addOption = useCallback(
    (qId: string) =>
      setQuestionsAndSave(
        questions.map((q) =>
          q.id === qId
            ? { ...q, options: [...q.options, { id: uid("o_"), text: "New option" }] }
            : q
        )
      ),
    [questions, setQuestionsAndSave]
  );

  const removeOption = useCallback(
    (qId: string, oId: string) =>
      setQuestionsAndSave(
        questions.map((q) =>
          q.id === qId ? { ...q, options: q.options.filter((o) => o.id !== oId) } : q
        )
      ),
    [questions, setQuestionsAndSave]
  );

  const updateQuestionContent = useCallback(
    (qId: string, content: string) =>
      setQuestionsAndSave(questions.map((q) => (q.id === qId ? { ...q, content } : q))),
    [questions, setQuestionsAndSave]
  );

  const updateOptionText = useCallback(
    (qId: string, oId: string, text: string) =>
      setQuestionsAndSave(
        questions.map((q) =>
          q.id === qId
            ? { ...q, options: q.options.map((o) => (o.id === oId ? { ...o, text } : o)) }
            : q
        )
      ),
    [questions, setQuestionsAndSave]
  );

  const updateOptionImage = useCallback(
    (qId: string, oId: string, imageUrl: string) =>
      setQuestionsAndSave(
        questions.map((q) =>
          q.id === qId
            ? { ...q, options: q.options.map((o) => (o.id === oId ? { ...o, imageUrl } : o)) }
            : q
        )
      ),
    [questions, setQuestionsAndSave]
  );

  const setCorrectAnswer = useCallback(
    (qId: string, oId: string | null) =>
      setQuestionsAndSave(questions.map((q) => (q.id === qId ? { ...q, correct: oId } : q))),
    [questions, setQuestionsAndSave]
  );

  const setQuestionImageUrl = useCallback(
    (qId: string, url: string) =>
      setQuestionsAndSave(questions.map((q) => (q.id === qId ? { ...q, imageUrl: url } : q))),
    [questions, setQuestionsAndSave]
  );

  return {
    editorId: initialId,
    title,
    setTitle,
    tags,
    setTags,
    questions,
    setQuestions: setQuestionsAndSave,

    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    updateQuestionContent,
    updateOptionText,
    updateOptionImage,
    setCorrectAnswer,
    setQuestionImageUrl,
  } as const;
}
