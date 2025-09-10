"use client";

import React, { useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MathKeyboardProps {
  onInsert: (snippet: string, move?: number) => void;
}

function MathKeyboard({ onInsert }: MathKeyboardProps) {
  const buttons = [
    { label: "Fraction", snippet: "\\frac{a}{b}", move: -3 },
    { label: "Power", snippet: "^{ }", move: -1 },
    { label: "Subscript", snippet: "_{ }", move: -1 },
    { label: "√", snippet: "\\sqrt{ }", move: -1 },
    { label: "∑", snippet: "\\sum_{n=1}^{\\infty}", move: -9 },
    { label: "∫", snippet: "\\int_{ }^{ }", move: -4 },
    { label: "π", snippet: "\\pi" },
    { label: "θ", snippet: "\\theta" },
    { label: "α", snippet: "\\alpha" },
    { label: "β", snippet: "\\beta" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {buttons.map((b) => (
        <Button
          key={b.label}
          variant="secondary"
          size="sm"
          className="rounded-xl"
          onClick={() => onInsert(b.snippet, b.move || 0)}
        >
          {b.label}
        </Button>
      ))}
    </div>
  );
}

interface MathWriterProps {
  value?: string;
  onChange?: (latex: string) => void;
  placeholder?: string;
}

export default function MathWriter({
  value = "",
  onChange = () => {},
  placeholder = "Type math (LaTeX)...",
}: MathWriterProps) {
  const [latex, setLatex] = useState<string>(String(value));
  const [displayMode, setDisplayMode] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onChange?.(latex);
    if (previewRef.current) {
      try {
        previewRef.current.innerHTML = katex.renderToString(latex || "\\;", {
          throwOnError: false,
          displayMode,
        });
      } catch (e) {
        previewRef.current.innerHTML = `<span class='text-destructive'>Error</span>`;
      }
    }
  }, [latex, displayMode, onChange]);

  function insertAtCursor(snippet: string, move = 0) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newValue = latex.slice(0, start) + snippet + latex.slice(end);
    setLatex(newValue);
    requestAnimationFrame(() => {
      const pos = start + snippet.length + move;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-card text-card-foreground shadow-lg rounded-2xl border">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Math Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Keyboard */}
        <MathKeyboard onInsert={insertAtCursor} />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full min-h-[120px] p-3 rounded-xl border bg-muted/30 text-foreground resize-vertical",
            "font-mono text-base focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="destructive" onClick={() => setLatex("")}>
            Clear
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard?.writeText(latex)}
          >
            Copy LaTeX
          </Button>
          <label className="ml-auto flex gap-2 items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={displayMode}
              onChange={() => setDisplayMode((s) => !s)}
            />
            Display Mode
          </label>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium mb-1">Preview</h3>
          <div
            ref={previewRef}
            className="p-4 rounded-lg border bg-muted text-lg overflow-x-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
