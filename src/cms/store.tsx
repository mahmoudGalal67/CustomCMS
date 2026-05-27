import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { useGetPageLinksQuery, useGetPageQuery, useUpdatePageMutation } from "@/services/pagesApi";
import type { CMSContextValue, CMSProviderProps, LinkType, Page, Pages, Section, SectionType } from "./Types";


/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

const CMSContext = createContext<CMSContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Provider */
/* ------------------------------------------------------------------ */

export function CMSProvider({ children }: CMSProviderProps) {
  const [success, setSuccess] = useState(false);
  const [updatePage, { isLoading }] = useUpdatePageMutation();
  const { data } = useGetPageQuery(undefined);
  const { data: pagesLinks } = useGetPageLinksQuery(undefined);



  const [pages, setPages] = useState<any>([]);
  const [pageLinks, setpageLinks] = useState<LinkType[]>([{ id: "", title: "", slug: '' }]);
  const [currentPage, setcurrentPage] = useState<string>('');


  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ---------- History ---------- */
  const [history, setHistory] = useState<Pages>([]);
  const [redoStack, setRedoStack] = useState<Pages>([]);

  const currentPageData: Page = useMemo(() => pages.find(
    (page: Page) =>
      page.id == currentPage
  ), [currentPage, pages])

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


  const selectedSection = useMemo(() => {
    return (currentPageData?.sections.find(
      (s: any) => s.id == selectedId
    ) ?? null)
  }, [currentPageData, selectedId])

  useEffect(() => {
    if (data) {
      setPages(data);
    }
  }, [data]);

  useEffect(() => {
    setpageLinks(pagesLinks)
  }, [pagesLinks])


  /* ---------- ACTIONS ---------- */

  const updateProp = (
    id: string,
    prop: string,
    value: any | ((prev: any) => any)
  ) => {
    const newPages: Pages = pages.map(
      (page: Page) => {
        if (page.id !== currentPage) {
          return page;
        }
        return {
          ...page,
          sections: page.sections.map(
            (s: Section) => {
              if (s.id !== id) return s;

              const prevValue =
                (s.props as any)[prop];

              return {
                ...s,

                props: {
                  ...s.props,

                  [prop]:
                    typeof value === "function"
                      ? value(prevValue)
                      : value,
                },
              };
            }
          ),
        };
      }
    );

    saveHistory(newPages);
  };

  const updatePageProp = (
    prop: string,
    value: any | ((prev: any) => any)
  ) => {
    const newPages: Pages = pages.map(
      (page: Page) => {
        if (page.id !== currentPage) {
          return page;
        }
        return {
          ...page,
          [prop]: value
        };
      }
    );

    saveHistory(newPages);
  };
  const deleteSection = (id: string) => {
    if (!currentPageData) return;

    const newPages: Pages = pages.map(
      (page: Page) => {
        if (
          page.id !== currentPageData.id
        ) {
          return page;
        }

        return {
          ...page,

          sections: page.sections.filter(
            (s: any) => s.id !== id
          ),
        };
      }
    );

    saveHistory(newPages);

    setSelectedId(null);
  };
  const moveSection = (from: number, to: number) => {
    if (!currentPageData) return;

    const newPages: Pages = pages.map(
      (page: Page) => {
        if (
          page.id !== currentPageData.id
        ) {
          return page;
        }
        const arr = [...page.sections];
        const [removed] = arr.splice(from, 1);
        arr.splice(to, 0, removed);
        return {
          ...page,
          sections: arr
        };
      }
    );
    saveHistory(newPages);
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

    if (!currentPageData) return;

    const newPages: Pages = pages.map(
      (page: Page) => {
        if (
          page.id !== currentPageData.id
        ) {
          return page;
        }
        const arr = [...page.sections];
        arr.splice(index + 1, 0, newSection);
        return {
          ...page,
          sections: arr
        };
      }
    );

    saveHistory(newPages);
  };

  const saveToBackend = async () => {
    try {
      await updatePage({
        slug: currentPageData.slug
        , data: {
          title: currentPageData.title, sections: pages
            .find(
              (page: Page) =>
                page.id === currentPage
            ).sections
        }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setSuccess(false);
    }
  };

  const createPage = () => {

    const id = nanoid();

    const page: Page = {
      id,
      title: "Unknown",
      slug: "unknown",
      sections: [
        {
          id: nanoid(),
          type: "hero",
          props: {
            title: "New Hero",
            subtitle: "Subtitle",
            bg: "#020617",
          },
        },
      ],
    };

    setPages((prev: Page[]) => [...prev, page]);

    setcurrentPage(id);

    return page;
  };
  return (
    <CMSContext.Provider
      value={{
        pages,
        setPages,
        currentPage,
        setcurrentPage,
        currentPageData,
        createPage,
        pageLinks,
        setpageLinks,
        updatePageProp,
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
