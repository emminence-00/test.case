"use client";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import QuestionEditor from "./Editor/Question";
import type { Test, Question, Option } from "@/lib/TestTypes";
import TagInput from "../components/TagInput";

export default function Page() {
  const [tags,setTags] = useState<string[]>([]);
  const [test, setTest] = useState<Test>({
    id: uuid(),
    name: "",
    tags,
    questions: [],
  });

  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });

  const handleNameChange = (name: string) => {
    setTest((prev) => ({ ...prev, name }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuid(),
      content: "",
      options: Array(4)
        .fill(null)
        .map(() => ({ id: uuid(), text: "" } as Option)),
      correctIndex: undefined,
    };
    setTest((prev) => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const updateQuestion = (index: number, updated: Question) => {
    setTest((prev) => {
      const newQs = [...prev.questions];
      newQs[index] = updated;
      return { ...prev, questions: newQs };
    });
  };

  const deleteQuestion = (index: number) => {
    setTest((prev) => {
      const newQs = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions: newQs };
    });
  };

  // ✅ Validation before saving
  const validateTest = (): { valid: boolean; title?: string; message?: string } => {
    if (!test.name.trim()) {
      return { valid: false, title: "Missing Test Name", message: "Please enter a name for the test." };
    }

    if (test.questions.length === 0) {
      return { valid: false, title: "No Questions", message: "You must add at least one question." };
    }

    for (let i = 0; i < test.questions.length; i++) {
      const q = test.questions[i];
      if (!q.content.trim()) {
        return { valid: false, title: "Incomplete Question", message: `Question ${i + 1} is missing content.` };
      }
      if (q.options.length < 2) {
        return { valid: false, title: "Not Enough Options", message: `Question ${i + 1} must have at least 2 options.` };
      }
      if (q.options.some((o) => !o.text.trim())) {
        return { valid: false, title: "Empty Option", message: `Question ${i + 1} has an option with no text.` };
      }
      if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        return { valid: false, title: "No Correct Answer", message: `Question ${i + 1} does not have a correct answer selected.` };
      }
    }

    return { valid: true };
  };

  const saveTest = () => {
    const validation = validateTest();
    if (!validation.valid) {
      setErrorDialog({
        open: true,
        title: validation.title || "Validation Error",
        message: validation.message || "Something went wrong.",
      });
      return;
    }

    console.log("✅ Test saved:", test);
    alert("Test saved to console!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300 p-8 pb-20 flex flex-col items-center">
      <div className="w-full layout">
        {/* Header */}
        <div className="text-center space-y-4 my-12">
          <h1 className="text-3xl font-bold">Create a Test</h1>
          <div className="flex gap-3 w-full flex-col md:justify-center">
            <Input
              placeholder="Enter test name"
              value={test.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            <TagInput onTagsChange={setTags} tags={tags}/>
            <Button className="px-6" onClick={saveTest}>
              Save Test
            </Button>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {test.questions.map((q, idx) => (
            <QuestionEditor
              key={q.id}
              question={q}
              index={idx}
              onChange={updateQuestion}
              onDelete={deleteQuestion}
            />
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={addQuestion}>+ Add Question</Button>
        </div>
      </div>

      {/* ❌ Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog((prev) => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorDialog.title}</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog((prev) => ({ ...prev, open: false }))}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
