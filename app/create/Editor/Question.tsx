//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator, Check, X, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Textarea } from "@/components/ui/textarea";
import DOMPurify from "dompurify";
import { v4 as uuid } from "uuid";

import type { Question as TQuestion, Option as TOption } from "@/lib/TestTypes";
type Props = { question: TQuestion; index: number; onChange?: (index: number, data: TQuestion) => void; onDelete?: (index: number) => void; };

/* Utility function: insert text at cursor */
function insertAtCursor(
  value: string,
  insertText: string,
  cursorPos: number | null
): { newValue: string; newCursor: number } {
  if (cursorPos === null || cursorPos < 0 || cursorPos > value.length) {
    return { newValue: value + insertText, newCursor: (value + insertText).length };
  }
  const before = value.slice(0, cursorPos);
  const after = value.slice(cursorPos);
  const newValue = before + insertText + after;
  return { newValue, newCursor: before.length + insertText.length };
}

/* Math renderer using KaTeX + DOMPurify */
function MathRenderer({ text }: { text: string }) {
  const renderMath = (input: string) =>
    input.replace(/\$([^$]+)\$/g, (_, latex) => {
      try {
        return katex.renderToString(latex, { throwOnError: false, displayMode: false });
      } catch {
        return `<span class="text-red-500">Invalid LaTeX</span>`;
      }
    });
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMath(text)) }} />;
}

/* Math editor popup (returns $...$ wrapped LaTeX) */
function MathEditorPopup({ onInsert, onClose }: { onInsert: (latex: string) => void; onClose: () => void }) {
  const [latex, setLatex] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    try {
      const rendered = katex.renderToString(latex || "\\;", { throwOnError: false, displayMode: false });
      setPreview(rendered);
    } catch {
      setPreview(`<span class='text-red-500'>Error</span>`);
    }
  }, [latex]);

  const mathButtons = [
    { label: "x²", snippet: "^{2}" },
    { label: "x₁", snippet: "_{1}" },
    { label: "√", snippet: "\\sqrt{}" },
    { label: "∫", snippet: "\\int" },
    { label: "∑", snippet: "\\sum" },
    { label: "π", snippet: "\\pi" },
    { label: "α", snippet: "\\alpha" },
    { label: "β", snippet: "\\beta" },
    { label: "θ", snippet: "\\theta" },
    { label: "∞", snippet: "\\infty" },
    { label: "≤", snippet: "\\leq" },
    { label: "≥", snippet: "\\geq" },
  ];

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(`$${latex}$`);
      setLatex("");
      onClose();
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-sm">Math Editor</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {mathButtons.map((btn) => (
          <Button
            key={btn.label}
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setLatex((prev) => prev + btn.snippet)}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <Textarea
        placeholder="Enter LaTeX..."
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        className="font-mono text-sm"
      />

      {latex && (
        <div className="p-3 bg-muted rounded-md border">
          <div className="text-xs mb-1 text-muted-foreground">Preview:</div>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(preview) }} className="text-center" />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleInsert} size="sm" className="flex-1">
          <Check className="h-4 w-4 mr-1" />
          Insert
        </Button>
        <Button variant="outline" onClick={() => setLatex("")} size="sm">
          Clear
        </Button>
      </div>
    </div>
  );
}

/* Main Component */
export default function QuestionEditor({ question, index, onChange, onDelete }: Props) {
  const [content, setContent] = useState<string>(question.content ?? "");
  const [options, setOptions] = useState<TOption[]>(
    question.options && question.options.length > 0
      ? question.options
      : Array(4).fill(null).map(() => ({ id: uuid(), text: "" }))
  );
  const [correct, setCorrect] = useState<number | undefined>(question.correctIndex);
  const [image, setImage] = useState<string | undefined>(question.image);
  const [activePopover, setActivePopover] = useState<number | null>(null);

  const questionRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const updated: TQuestion = { ...question, content, options, correctIndex: correct, image };
    onChange?.(index, updated);
  }, [content, options, correct, image]);

  const updateOptionText = (id: string, text: string) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));

  const updateOptionImage = (id: string, imageUrl?: string) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, imageUrl } : o)));

  const addOption = () => setOptions((prev) => [...prev, { id: uuid(), text: "" }]);

  const removeOptionByIndex = (optIndex: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => {
      const newOpts = prev.filter((_, i) => i !== optIndex);
      if (correct !== undefined) {
        if (correct === optIndex) setCorrect(undefined);
        else if (correct > optIndex) setCorrect(correct - 1);
      }
      return newOpts;
    });
  };

  const insertMathIntoQuestion = (mathLatex: string) => {
    const cursor = questionRef.current?.selectionStart ?? content.length;
    const { newValue, newCursor } = insertAtCursor(content, mathLatex, cursor);
    setContent(newValue);
    setTimeout(() => {
      questionRef.current?.focus();
      questionRef.current?.setSelectionRange(newCursor, newCursor);
    }, 0);
    setActivePopover(null);
  };

  const insertMathIntoOption = (optIndex: number, mathLatex: string) => {
    const input = optionRefs.current[optIndex];
    if (!input) return;
    const cursor = input.selectionStart ?? input.value.length;
    const { newValue, newCursor } = insertAtCursor(input.value, mathLatex, cursor);
    setOptions((prev) => prev.map((o, i) => (i === optIndex ? { ...o, text: newValue } : o)));
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursor, newCursor);
    }, 0);
    setActivePopover(null);
  };

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleOptionImageUpload = (optIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () =>
      setOptions((prev) => prev.map((o, i) => (i === optIndex ? { ...o, imageUrl: reader.result as string } : o)));
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setContent("");
    setOptions(Array(4).fill(null).map(() => ({ id: uuid(), text: "" })));
    setCorrect(undefined);
    setImage(undefined);
  };

  return (
    <Card className="w-full shadow-md rounded-2xl">
      <CardHeader className="flex items-center justify-between border-b pb-3">
        <CardTitle className="text-lg font-bold">Question {index + 1}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => clearForm()}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(index)}
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Question</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`q-img-${question.id}`)?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Image
              </Button>
              <Popover open={activePopover === -1} onOpenChange={(open) => setActivePopover(open ? -1 : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calculator className="h-4 w-4 mr-1" />
                    Math
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <div className="p-4">
                    <MathEditorPopup onInsert={insertMathIntoQuestion} onClose={() => setActivePopover(null)} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Input
            ref={(el) => (questionRef.current = el)}
            placeholder="Enter your question here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-base"
          />

          <input
            id={`q-img-${question.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleQuestionImageUpload}
          />
          {image && (
            <div className="mt-2 relative w-fit">
              <img src={image} alt="Question" className="max-w-xs rounded-md border" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 rounded-full h-6 w-6 p-0"
                onClick={() => setImage(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {content && (
            <div className="mt-2 p-3 rounded-md bg-muted">
              <MathRenderer text={content} />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Answer Options</label>
          <RadioGroup
            value={correct !== undefined ? String(correct) : undefined}
            onValueChange={(val) => setCorrect(Number(val))}
            className="space-y-3"
          >
            {options.map((opt, i) => (
              <div
                key={opt.id}
                className="flex flex-col gap-2 p-3 bg-muted/30 hover:bg-muted rounded-lg border transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={String(i)} id={`opt-${question.id}-${i}`} />
                  <input
                      ref={(el: HTMLInputElement | null) => (optionRefs.current[i] = el)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt.text}
                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                    className="flex-1 outline-none bg-transparent focus:ring-0 text-sm"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById(`opt-img-${question.id}-${opt.id}`)?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>

                  <Popover open={activePopover === i} onOpenChange={(open) => setActivePopover(open ? i : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="end">
                      <div className="p-4">
                        <MathEditorPopup onInsert={(latex) => insertMathIntoOption(i, latex)} onClose={() => setActivePopover(null)} />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOptionByIndex(i)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <input
                  id={`opt-img-${question.id}-${opt.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleOptionImageUpload(i, e)}
                />
                {opt.imageUrl && (
                  <div className="ml-6 relative w-fit">
                    <img src={opt.imageUrl} alt={`Option ${i} image`} className="max-w-xs rounded-md border" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 rounded-full h-6 w-6 p-0"
                      onClick={() => updateOptionImage(opt.id, undefined)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {opt.text && (
                  <div className="ml-6 text-sm text-muted-foreground">
                    <MathRenderer text={opt.text} />
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
            <span className="text-xs text-muted-foreground">Min 2 options</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm px-3 py-1 rounded-md bg-muted">
            {correct !== undefined ? (
              <span className="text-green-600 font-medium">
                ✓ Correct: Option {String.fromCharCode(65 + Number(correct))}
              </span>
            ) : (
              <span className="text-amber-600 font-medium">⚠ Select the correct answer</span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={clearForm}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
