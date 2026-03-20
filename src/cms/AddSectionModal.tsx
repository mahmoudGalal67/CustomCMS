import { useEffect, useRef } from "react";
import { SECTION_REGISTRY } from "./section-types/registry";
import type { SectionType } from "./store";

interface AddSectionModalProps {
  onSelect: (type: SectionType) => void;
  onClose: () => void;
}

export default function AddSectionModal({
  onSelect,
  onClose,
}: AddSectionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------- */
  /* Close on outside click + ESC                                   */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* -------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="
          relative
          w-[340px]
          max-h-[80vh]
          overflow-y-auto
          rounded-2xl
          bg-white/95
          backdrop-blur-xl
          shadow-2xl
          p-5
          space-y-4
        "
        style={{
          animation: "modalIn 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Add Section
          </h3>

          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-full
              flex items-center justify-center
              text-gray-500
              hover:bg-gray-200
              transition
              cursor-pointer
            "
          >
            ✕
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {Object.entries(SECTION_REGISTRY).map(([category, sections]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category}
              </h4>

              <div className="flex flex-col gap-2">
                {sections.map((sec) => (
                  <button
                    key={sec.type}
                    onClick={() => onSelect(sec.type as SectionType)}
                    className="
                      group
                      w-full
                      p-3
                      rounded-xl
                      border border-gray-200
                      bg-white
                      text-left
                      transition
                      hover:border-blue-400
                      hover:bg-blue-50
                      hover:shadow-md
                      active:scale-[0.98]
                      cursor-pointer
                    "
                  >
                    <span className="font-medium text-gray-800 group-hover:text-blue-600 cursor-pointer">
                      {sec.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="
            w-full
            py-2
            rounded-lg
            text-sm
            font-medium
            text-gray-600
            hover:bg-gray-100
            transition
            cursor-pointer
            hover:text-blue-600
            max-content
          "
        >
          Cancel
        </button>
      </div>

      {/* Keyframes injected inline (no config needed) */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes modalIn {
            0% {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}