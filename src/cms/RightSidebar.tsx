import { useCMS } from "./store";
import { ChevronLeft } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import SuccessButton from "@/components/SuccessButton";
import UploadButton from "@/components/UploadButton";
import SideBarEditContentSection from "@/cms/SideBarEditContentSections/FeaturedSliderProducts";

export default function RightSidebar() {
  const { selectedSection, updateProp, saveToBackend, success, isLoading } = useCMS();

  if (!selectedSection) {
    return (
      <aside className="w-72 bg-gray-100 p-4">
        <p className="text-gray-500">Select a section</p>
      </aside>
    );
  }

  const { toggleSidebar, open, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  const isOpen = isMobile ? openMobile : open;

  return (
    <Sidebar
      collapsible="icon"
      side="right"
      variant="sidebar"
      className={`relative px-2 ${isOpen ? " px-2" : " px-5"}`}
    >
      <Button
        onClick={toggleSidebar}
        className="w-6 h-6 absolute top-8 z-10 -left-4 rounded-full p-3 flex items-center justify-center transition-colors"
      >
        <ChevronLeft
          className={`w-6 h-6 font-bold transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        />
      </Button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Section Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {selectedSection.type == 'sliderFeaturedProducts' ? <SideBarEditContentSection  {...(selectedSection as any)} /> :
                Object.entries(selectedSection.props).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium capitalize mb-2 block">
                      {key}
                    </label>

                    {Array.isArray(value) ? value.map((slide: any, i: number) => (
                      <div className="flex flex-col gap-3 my-2 shadow p-2">
                        {Object.entries(slide).map(([key]) => {

                          if (key == 'id') {
                            return null
                          }
                          else if (key == 'image') {
                            return <UploadButton selectedSection={selectedSection} slide={slide} updateProp={updateProp} />
                          }
                          else {
                            return (<input
                              className="w-full border p-2 rounded"
                              value={slide[key]}
                              onChange={(e) =>
                                updateProp(selectedSection.id, "slides", (prevSlides: any = []) =>
                                  prevSlides.map((prevSlide: any) =>
                                    prevSlide.id === slide.id
                                      ? { ...prevSlide, [key]: e.target.value }
                                      : prevSlide
                                  )
                                )
                              }
                            />)
                          }

                        })}
                        {
                          value.length > 1 &&
                          <button
                            type="submit"
                            onClick={() =>
                              updateProp(selectedSection.id, "slides", (prevSlides = []) =>
                                prevSlides.filter((prevSlide: any) => prevSlide.id !== slide.id)
                              )
                            }
                            className="cursor-pointer flex w-full justify-center rounded-md bg-[red] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                          > Delete Slide</button>
                        }

                        {i == value.length - 1 && <button
                          type="submit"
                          onClick={() =>
                            updateProp(selectedSection.id, "slides", (prevSlides = []) => [
                              ...prevSlides,
                              {
                                id: crypto.randomUUID(),
                                title: "New Slide",
                                subTitle: "Subtitle",
                                image: "",
                              },
                            ])
                          }
                          className="cursor-pointer flex w-full justify-center rounded-md bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >➕ Add Slide</button>}
                      </div>

                    )) : key === "bg" ? (
                      <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                          updateProp(selectedSection.id, key, e.target.value)
                        }
                        className="w-full h-8 rounded-md overflow-hidden"
                      />
                    ) : (
                      <input
                        className="w-full border p-2 rounded"
                        value={value}
                        onChange={(e) =>
                          updateProp(selectedSection.id, key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))
              }
            </SidebarMenu>
            <div className="flex gap-2 my-4">
              <button
                type="submit"
                onClick={saveToBackend}
                disabled={isLoading}
                className="cursor-pointer flex w-full justify-center rounded-md bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {success ?
                  <AnimatePresence mode="wait">
                    <SuccessButton />
                  </AnimatePresence> : (isLoading ? "Loading..." : "Update")}
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  );
}
