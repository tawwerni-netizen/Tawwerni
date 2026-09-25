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
      let saved = (typeof localStorage !== "undefined" ? localStorage.getItem("tawwerni-lang") : null) as Language | null;
      if (!saved && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)tawwerni-lang=(ar|en)/);
        if (match) saved = match[1] as Language;
      }
      if (saved === "en" || saved === "ar") {
        setLangState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "en" ? "ltr" : "rtl";
        document.title = saved === "en" 
          ? "Tawwerni — Turn Daily Learning into Real Progress" 
          : "طوّرني — حوّل تعلّمك اليومي لتقدّم حقيقي";
        localStorage.setItem("tawwerni-lang", saved);
        document.cookie = `tawwerni-lang=${saved}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      /* ignore storage error */
    }
  }, []);

  function setLang(newLang: Language) {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "en" ? "ltr" : "rtl";
    document.title = newLang === "en" 
      ? "Tawwerni — Turn Daily Learning into Real Progress" 
      : "طوّرني — حوّل تعلّمك اليومي لتقدّم حقيقي";
    try {
      localStorage.setItem("tawwerni-lang", newLang);
      document.cookie = `tawwerni-lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
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
