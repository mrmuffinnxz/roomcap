import { createContext, useContext, useState } from "react";

interface GeneratorContextInterface {
  originalImage: string | null;
  setOriginalImage: (value: string | null) => void | null;
  theory: string;
  setTheory: (value: string) => void;
  analysis: string | null;
  setAnalysis: (value: string | null) => void;
  suggestion: string | null;
  setSuggestion: (value: string | null) => void;
  result: string | null;
  setResult: (value: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

const GeneratorContext = createContext<GeneratorContextInterface | undefined>(
  undefined
);

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error("useGenerator must be within GeneratorProvider");
  }
  return context;
}

export function GeneratorProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [theory, setTheory] = useState<string>("7-elements");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    originalImage,
    setOriginalImage,
    theory,
    setTheory,
    analysis,
    setAnalysis,
    suggestion,
    setSuggestion,
    result,
    setResult,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  );
}
