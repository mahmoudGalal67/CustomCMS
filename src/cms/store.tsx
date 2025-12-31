import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { nanoid } from "nanoid";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type SectionType = "hero" | "text";

export interface HeroProps {
  title: string;
  subtitle: string;
  bg: string;
}

export interface TextProps {
  text: string;
}

export type SectionProps = HeroProps | TextProps;

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
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedSection: Section | null;

  updateProp: (id: string, prop: string, value: string) => void;

  deleteSection: (id: string) => void;
  moveSection: (from: number, to: number) => void;
  addSection: (index: number, type: SectionType) => void;

  undo: () => void;
  redo: () => void;
  saveToBackend: () => Promise<void>;
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
  const [pages, setPages] = useState<Pages>({
    home: [
      {
        id: nanoid(),
        type: "hero",
        props: {
          title: "Welcome",
          subtitle: "Click to edit",
          bg: "#0f172a",
        },
      },
      {
        id: nanoid(),
        type: "text",
        props: {
          text: "This is a text section",
        },
      },
    ],
  });

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

  const selectedSection = pages.home.find((s) => s.id === selectedId) ?? null;

  /* ---------- ACTIONS ---------- */

  const updateProp = (id: string, prop: string, value: string) => {
    const newPages: Pages = {
      ...pages,
      home: pages.home.map((s) =>
        s.id === id
          ? {
              ...s,
              props: { ...s.props, [prop]: value },
            }
          : s
      ),
    };

    saveHistory(newPages);
  };

  const deleteSection = (id: string) => {
    const newPages: Pages = {
      ...pages,
      home: pages.home.filter((s) => s.id !== id),
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
      const res = await fetch("/api/save-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pages),
      });

      if (!res.ok) throw new Error("Failed to save");

      alert("Pages saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving pages");
    }
  };

  return (
    <CMSContext.Provider
      value={{
        pages,
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
