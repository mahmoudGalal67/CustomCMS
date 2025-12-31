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

export default function RightSidebar() {
  const { selectedSection, updateProp, saveToBackend } = useCMS();

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
          className={`w-6 h-6 font-bold transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Section Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(selectedSection.props).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium capitalize">
                    {key}
                  </label>

                  {key === "bg" ? (
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        updateProp(selectedSection.id, key, e.target.value)
                      }
                      className="w-full h-8"
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
              ))}
            </SidebarMenu>
            <div className="flex gap-2 mb-4">
              <button
                onClick={saveToBackend}
                className="p-2 bg-green-500 text-white rounded"
              >
                Save JSON
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
