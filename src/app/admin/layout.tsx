import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar.jsx";
import RightSidebar from "../../cms/RightSidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

import { useCMS } from "../../cms/store";

function UndoRedoToolbar() {
  const { undo, redo } = useCMS();
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={undo} className="p-2 bg-gray-200 rounded">
        Undo
      </button>
      <button onClick={redo} className="p-2 bg-gray-200 rounded">
        Redo
      </button>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarProvider>
        <AppSidebar />
        <UndoRedoToolbar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
      <RightSidebar />
    </div>
  );
}
