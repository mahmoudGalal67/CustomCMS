import { SECTION_REGISTRY } from "./section-types/registry";
import type { SectionType } from "./store";

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface AddSectionModalProps {
  onSelect: (type: SectionType) => void;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function AddSectionModal({
  onSelect,
  onClose,
}: AddSectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-72 p-4 space-y-3">
        <h3 className="font-semibold text-lg mb-2">Add Section</h3>

        {Object.entries(SECTION_REGISTRY).map(([category, sections]) => (
          <div key={category}>
            <h4 className="font-medium text-sm mb-1 capitalize">{category}</h4>

            <div className="flex flex-col gap-1">
              {sections.map((sec) => (
                <button
                  key={sec.type}
                  type="button"
                  className="w-full p-2 border rounded hover:bg-gray-100 text-left"
                  onClick={() => onSelect(sec.type as SectionType)}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-gray-500 mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
