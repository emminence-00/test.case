'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MathfieldComponent = dynamic(() => import('./MathfieldComponent'), {
  ssr: false,
});

export interface MathEditorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  label?: string;
  onInsert?: (latex: string) => void;
  insertLabel?: string;
}

// Common LaTeX snippets teachers use a lot
const buttons = [
  { label: 'x_i^2', latex: 'x_i^2', tip: 'Subscript + superscript' },
  { label: '\\frac{a}{b}', latex: '\\frac{a}{b}', tip: 'Fraction' },
  { label: '\\sqrt{x}', latex: '\\sqrt{x}', tip: 'Square Root' },
  { label: '\\sum_{i=1}^{n}', latex: '\\sum_{i=1}^{n}', tip: 'Summation' },
  { label: '\\int_{a}^{b}', latex: '\\int_{a}^{b}', tip: 'Integral' },
  { label: 'e^{i\\pi}+1=0', latex: 'e^{i\\pi}+1=0', tip: 'Euler identity' },
];

export default function MathEditor({ value, onChange, className, label, onInsert, insertLabel }: MathEditorProps) {
  const [internal, setInternal] = useState('');

  // Reset internal state when component mounts or value changes
  useEffect(() => {
    setInternal(value || '');
  }, [value]);

  const handleInput = (e: { value: string }) => {
    setInternal(e.value);
    onChange(e.value);
  };

  const insertSnippet = (snippet: string) => {
    const next = internal ? `${internal} ${snippet}` : snippet;
    setInternal(next);
    onChange(next);
  };

  const handleInsert = () => {
    if (onInsert && internal) {
      onInsert(internal);
      setInternal(''); // Clear after insert
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label ? <div className="text-sm font-medium text-muted-foreground">{label}</div> : null}

      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <Tooltip key={b.label}>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => insertSnippet(b.latex)}>
                {b.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{b.tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-2">
        <MathfieldComponent 
          value={internal} 
          onInput={handleInput} 
          className="w-full min-h-[44px] px-2 py-2" 
        />
      </div>

      {onInsert ? (
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Tips: Use _ for subscripts, ^ for superscripts, combine them: <code>{"x_{i}^{2}"}</code>
          </div>
          <Button size="sm" onClick={handleInsert} disabled={!internal.trim()}>
            {insertLabel || 'Insert'}
          </Button>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          Tips: Use _ for subscripts, ^ for superscripts, and combine them: <code>{"x_{i}^{2}"}</code>. Type <code>{"\\frac"}</code>, <code>{"\\sqrt"}</code>, <code>{"\\sum"}</code>, <code>{"\\int"}</code>, etc.
        </div>
      )}
    </div>
  );
}