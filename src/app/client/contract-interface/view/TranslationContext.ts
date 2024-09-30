import { useTranslation } from "@/app/i18n/client";
import { createContext, useContext } from "react";

export const TranslationContext = createContext<
  ReturnType<typeof useTranslation>
>({} as ReturnType<typeof useTranslation>);

export const useTranslationContext = () => {
  return useContext(TranslationContext);
};
