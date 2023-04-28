import { GeneratorProvider } from "@/contexts/GeneratorContext";
import { MainPage } from "@/views/pages/MainPage";

export default function Page() {
  return (
    <GeneratorProvider>
      <MainPage />
    </GeneratorProvider>
  );
}
