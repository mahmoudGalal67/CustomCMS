import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import type { DropResult } from "@hello-pangea/dnd";

import { useCMS } from "../../cms/store";
import SectionWrapper from "../../cms/SectionWrapper";
import Hero from "../../cms/section-types/Hero";
import Text from "../../cms/section-types/Text";

import { useEffect, type FC } from "react";
import { useGetPageQuery } from "@/services/pagesApi";

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
  const { pages, moveSection, setPages } = useCMS() as unknown as {
    pages: Pages;
    moveSection: (from: number, to: number) => void;
    setPages: (pages: Pages) => void;
  };
  const { data, isLoading } = useGetPageQuery(undefined);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    moveSection(result.source.index, result.destination.index);
  };
  useEffect(() => {
    if (data) {
      setPages({ home: data[0].content });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;
  console.log(pages);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="page">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {pages.home?.map((s, i) => {
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
