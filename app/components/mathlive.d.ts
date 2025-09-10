declare namespace JSX {
  interface IntrinsicElements {
    'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      value?: string;
      onInput?: (e: any) => void;
      readOnly?: boolean;
      class?: string;
    };
  }
}
