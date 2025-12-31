import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { useCMS } from "./store";
import AddSectionModal from "./AddSectionModal";
import type { Section, SectionType } from "./store";

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

// interface SectionWrapperProps {
//   section: Section;
//   index: number;
//   children: ReactNode;
// }

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function SectionWrapper({ section, index, children }: any) {
  const { selectedId, setSelectedId, deleteSection, moveSection, addSection } =
    useCMS();

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const active = selectedId === section.id;

  return (
    <div
      className={`relative mb-4 group ${active ? "ring-4 ring-blue-500" : ""}`}
      onClick={() => setSelectedId(section.id)}
    >
      {active && (
        <div className="absolute -top-4 right-4 flex gap-1 bg-white shadow rounded p-1 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdd(true);
            }}
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteSection(section.id);
            }}
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(index, index - 1);
            }}
          >
            <ArrowUp size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(index, index + 1);
            }}
          >
            <ArrowDown size={16} />
          </button>
        </div>
      )}

      {children}

      {showAdd && (
        <AddSectionModal
          onSelect={(type: SectionType) => {
            addSection(index, type);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
