"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, Translations, getTranslations, ar } from "@/lib/i18n";

type LanguageContextType = {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  t: ar,
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tawwerni-lang") as Language;
      if (saved === "en" || saved === "ar") {
        setLangState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "en" ? "ltr" : "rtl";
      }
    } catch {
      /* ignore storage error */
    }
  }, []);

  function setLang(newLang: Language) {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "en" ? "ltr" : "rtl";
    try {
      localStorage.setItem("tawwerni-lang", newLang);
    } catch {
      /* ignore */
    }
  }

  function toggleLang() {
    setLang(lang === "ar" ? "en" : "ar");
  }

  const t = getTranslations(lang);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}
