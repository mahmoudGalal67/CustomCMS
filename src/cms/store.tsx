import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { nanoid } from "nanoid";
import { useAddToUserPageMutation } from "@/services/pagesApi";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type SectionType = "hero" | "text" | 'banner' | 'sliderFeaturedProducts' | 'CountDownOffers' | 'CategorySecation';

export interface HeroProps {
  title: string;
  subtitle: string;
  bg: string;
}

export interface TextProps {
  text: string;
}
export interface BannerProps {
  slides: { id: string, title: string, subTitle: string, image: string }[];
}
export interface sliderFeaturedProductsProps {
  products: string[];
  title: string;
  slider?: boolean
}
export interface CountDownOffers {
  offers: any;
  title: string;
}
export interface CategorySecation {
  title: string;
  limit: number;
  category: string;
}

export type SectionProps = HeroProps | TextProps | BannerProps | sliderFeaturedProductsProps | CountDownOffers | CategorySecation;

export interface Section {
  id: string;
  type: SectionType;
  props: SectionProps;
}

export interface Pages {
  home: Section[];
}

interface CMSContextValue {
  pages: Pages;
  setPages: (pages: Pages) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedSection: Section | null;

  updateProp: (id: string, prop: any, value: any) => void;

  deleteSection: (id: string) => void;
  moveSection: (from: number, to: number) => void;
  addSection: (index: number, type: SectionType) => void;

  undo: () => void;
  redo: () => void;
  saveToBackend: () => Promise<void>;
  isLoading: boolean;
  success: boolean;
}

interface CMSProviderProps {
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

const CMSContext = createContext<CMSContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Provider */
/* ------------------------------------------------------------------ */

export function CMSProvider({ children }: CMSProviderProps) {
  const [success, setSuccess] = useState(false);
  const [updatePage, { isLoading }] = useAddToUserPageMutation();

  const [pages, setPages] = useState<any>({
    home: [
    ],
  });

  // const DummyPages = [{ "id": "id1", "type": "hero", "props": { "title": "Welcome", "subtitle": "Click to edit", "bg": "#0f172a" } }, { "id": "Ir_t6VJFrYJshA60YYhuc", "type": "banner", "props": { "slides": [{ "id": "ecd7c7d7-3b7b-4567-80c6-beb8410334ea", "title": "New Slide 01", "subTitle": "Subtitle 01", "image": "\/storage\/uploads\/u0ESKNYvENjP9Zx8NphnRTYWfUx0GBxhgJ4cLRZH.jpg" }, { "id": "3f0d96fc-6faa-4975-acdd-f6f428d22e2b", "title": "New Slide 02", "subTitle": "Subtitle 02", "image": "\/storage\/uploads\/bo5j7f5Wu2M87y6HmGdbr0yTXGZhxix5Vv91GKLs.jpg" }] } }, { "id": "FvwCJvh0UOgnd82LcwKpL", "type": "hero", "props": { "title": "New Hero 2", "subtitle": "test", "bg": "#020617" } }]

  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ---------- History ---------- */
  const [history, setHistory] = useState<Pages[]>([]);
  const [redoStack, setRedoStack] = useState<Pages[]>([]);

  const saveHistory = (newPages: Pages) => {
    setHistory((prev) => [...prev, pages]);
    setRedoStack([]);
    setPages(newPages);
  };

  const undo = () => {
    if (!history.length) return;

    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, h.length - 1));
    setRedoStack((r) => [...r, pages]);
    setPages(prev);
  };

  const redo = () => {
    if (!redoStack.length) return;

    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, r.length - 1));
    setHistory((h) => [...h, pages]);
    setPages(next);
  };


  const selectedSection = pages.home?.find((s: any) => s.id === selectedId) ?? null;

  /* ---------- ACTIONS ---------- */

  const updateProp = (
    id: string,
    prop: string,
    value: any | ((prev: any) => any)
  ) => {
    const newPages: Pages = {
      ...pages,
      home: pages.home?.map((s: Section) => {
        if (s.id !== id) return s;

        const prevValue = (s.props as any)[prop];

        return {
          ...s,
          props: {
            ...s.props,
            [prop]:
              typeof value === "function"
                ? value(prevValue) // updater
                : value,
          },
        };
      }),
    };

    saveHistory(newPages);
  };
  const deleteSection = (id: string) => {
    const newPages: Pages = {
      ...pages,
      home: pages.home?.filter((s: any) => s.id !== id),
    };

    saveHistory(newPages);
    setSelectedId(null);
  };

  const moveSection = (from: number, to: number) => {
    const arr = [...pages.home];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);

    saveHistory({ ...pages, home: arr });
  };

  const addSection = (index: number, type: SectionType) => {
    const newSection: Section = {
      id: nanoid(),
      type,
      props:
        type === "hero"
          ? {
            title: "New Hero",
            subtitle: "Subtitle",
            bg: "#020617",
          }
          : type === "banner" ? {
            slides: [
              { id: nanoid(), title: "Banner Title", subTitle: "banner subTitle", image: '' }
            ]
          } : type === 'sliderFeaturedProducts' ? {
            products: [],
            title: 'Featured Products',
            slider: false,
          } : type === 'CountDownOffers' ? {
            offers: [],
            title: 'Special Offers'
          } : type == "CategorySecation" ? {
            category: '',
            limit: 10,
            title: 'Category Products'
          }
            : {
              text: "New text section",
            },
    };

    const arr = [...pages.home];
    arr.splice(index + 1, 0, newSection);

    saveHistory({ ...pages, home: arr });
  };

  const saveToBackend = async () => {
    try {
      await updatePage({ title: 'Home', content: pages.home });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setSuccess(false);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        pages,
        setPages,
        selectedId,
        setSelectedId,
        selectedSection,
        updateProp,
        deleteSection,
        moveSection,
        addSection,
        undo,
        redo,
        saveToBackend,
        isLoading,
        success,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) {
    throw new Error("useCMS must be used inside CMSProvider");
  }
  return ctx;
};
