import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import type { DropResult } from "@hello-pangea/dnd";

import { useCMS } from "../../../cms/store";
import SectionWrapper from "../../../cms/SectionWrapper";
import Hero from "../../../cms/section-types/Hero";
import Banner from "../../../cms/section-types/Banner";
import sliderFeaturedProducts from "../../../cms/section-types/SliderFeaturedProducts";
import CountDownOffers from "../../../cms/section-types/CountDownOffers";
import Text from "@/cms/section-types/Text";

import { useEffect, useState, type FC } from "react";
import { Move } from "lucide-react";
import CategorySecation from "@/cms/section-types/CategorySection";
import type { SectionType, Page, Pages } from "@/cms/Types";
import { nanoid } from "nanoid";

/* ------------------------------------------------------------------ */
/* Section map */
/* ------------------------------------------------------------------ */

const MAP: Record<SectionType, FC<any>> = {
    hero: Hero,
    text: Text,
    banner: Banner,
    sliderFeaturedProducts: sliderFeaturedProducts,
    CountDownOffers: CountDownOffers,
    CategorySecation: CategorySecation,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function AddNewPage() {
    const { moveSection, currentPage, pages } = useCMS();
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        moveSection(result.source.index, result.destination.index);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="AddNewpage">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {pages.find((page) => page.id == currentPage)?.sections.map((s, i) => {
                            const Component = MAP[s.type];

                            if (!Component) return null;
                            return (
                                <Draggable key={s.id} draggableId={s.id} index={i}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div {...provided.dragHandleProps} className="cursor-move p-2 -mb-4 z-10 relative bg-white w-fit rounded-md shadow">
                                                <Move />
                                            </div>
                                            <SectionWrapper section={s} index={i}>
                                                <Component {...s.props} id={s.id} />
                                            </SectionWrapper>
                                        </div>
                                    )}
                                </Draggable>)
                        })}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
