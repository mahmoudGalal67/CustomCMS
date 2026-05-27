/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

import type { ReactNode } from "react";

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

export interface Page {
    id: string,
    title: string;
    slug: string;
    sections: Section[];
}
export interface LinkType {
    id: string;
    title: string;
    slug: string;
}

export type Pages = Page[]

export interface CMSContextValue {
    pages: Pages;
    setPages: React.Dispatch<
        React.SetStateAction<Pages>
    >;
    currentPage: string;
    setcurrentPage: (page: string) => void;
    createPage: () => Page;
    currentPageData: Page,
    pageLinks: LinkType[];
    setpageLinks: React.Dispatch<
        React.SetStateAction<LinkType[]>
    >;

    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    selectedSection: Section | null;

    updateProp: (id: string, prop: any, value: any) => void;
    updatePageProp: (prop: any, value: any) => void;

    deleteSection: (id: string) => void;
    moveSection: (from: number, to: number) => void;
    addSection: (index: number, type: SectionType) => void;

    undo: () => void;
    redo: () => void;
    saveToBackend: () => Promise<void>;
    isLoading: boolean;
    success: boolean;
}

export interface CMSProviderProps {
    children: ReactNode;
}

// const DummyPages = [{ "id": "id1", "type": "hero", "props": { "title": "Welcome", "subtitle": "Click to edit", "bg": "#0f172a" } }, { "id": "Ir_t6VJFrYJshA60YYhuc", "type": "banner", "props": { "slides": [{ "id": "ecd7c7d7-3b7b-4567-80c6-beb8410334ea", "title": "New Slide 01", "subTitle": "Subtitle 01", "image": "\/storage\/uploads\/u0ESKNYvENjP9Zx8NphnRTYWfUx0GBxhgJ4cLRZH.jpg" }, { "id": "3f0d96fc-6faa-4975-acdd-f6f428d22e2b", "title": "New Slide 02", "subTitle": "Subtitle 02", "image": "\/storage\/uploads\/bo5j7f5Wu2M87y6HmGdbr0yTXGZhxix5Vv91GKLs.jpg" }] } }, { "id": "FvwCJvh0UOgnd82LcwKpL", "type": "hero", "props": { "title": "New Hero 2", "subtitle": "test", "bg": "#020617" } }]
