import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import type { DropResult } from "@hello-pangea/dnd";

import { useCMS } from "../../cms/store";
import SectionWrapper from "../../cms/SectionWrapper";
import Hero from "../../cms/section-types/Hero";
import Text from "../../cms/section-types/Text";

import type { FC } from "react";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type SectionType = "hero" | "text";

interface BaseSection {
  id: string;
  type: SectionType;
  props: Record<string, any>;
}

interface Pages {
  home: BaseSection[];
}

interface HomeProps {
  editable: boolean;
}

/* ------------------------------------------------------------------ */
/* Section map */
/* ------------------------------------------------------------------ */

const MAP: Record<SectionType, FC<any>> = {
  hero: Hero,
  text: Text,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Home({ editable }: HomeProps) {
  const { pages, moveSection } = useCMS() as {
    pages: Pages;
    moveSection: (from: number, to: number) => void;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    moveSection(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="page">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {pages.home.map((s, i) => {
              const Component = MAP[s.type];

              if (!Component) return null;

              return editable ? (
                <Draggable key={s.id} draggableId={s.id} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SectionWrapper section={s} index={i}>
                        <Component {...s.props} id={s.id} />
                      </SectionWrapper>
                    </div>
                  )}
                </Draggable>
              ) : (
                <Component key={s.id} {...s.props} />
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
