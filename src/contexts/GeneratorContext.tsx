import { createContext, useContext, useState } from "react";

interface GeneratorContextInterface {
  originalImage: string | null;
  setOriginalImage: (value: string | null) => void | null;
  theory: string;
  setTheory: (value: string) => void;
  caption: string | null;
  setCaption: (value: string | null) => void;
  result: string | null;
  setResult: (value: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
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
  const [originalImage, setOriginalImage] = useState<string | null>(
    "https://storage.googleapis.com/spacely/public/image/additionalTemplates/Bedrooom/BEDROOM04.jpg"
  );
  const [theory, setTheory] = useState<string>("7-elements");
  const [caption, setCaption] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = {
    originalImage,
    setOriginalImage,
    theory,
    setTheory,
    caption,
    setCaption,
    result,
    setResult,
    isLoading,
    setIsLoading,
  };
  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  );
}
