import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar.jsx";
import RightSidebar from "../../cms/RightSidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

import { useCMS } from "../../cms/store";

import { ChevronLeft, ChevronRight } from "lucide-react";

function UndoRedoToolbar() {
  const { undo, redo } = useCMS();

  return (
    <div className="flex gap-2 mb-4">
      {/* Undo Button */}
      <button
        onClick={undo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Undo
      </button>

      {/* Redo Button */}
      <button
        onClick={redo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        Redo
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <UndoRedoToolbar />
          <Outlet />
        </main>
        <RightSidebar />
      </SidebarProvider>
    </div>
  );
}
