
import React from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Sidebar } from "./sidebar";
import { UserButton } from "./user-button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-[70px] lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-1 items-center justify-end">
            <UserButton />
          </div>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <motion.main
            className="flex-1 px-3 py-3 sm:px-4 sm:py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.main>
        </ScrollArea>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};
