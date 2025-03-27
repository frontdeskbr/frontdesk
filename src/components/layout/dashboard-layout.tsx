
import React from "react";
import { motion } from "framer-motion";
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
      <div className="flex-1 ml-[70px] lg:ml-72"> {/* Increased spacing from sidebar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* Increased padding */}
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold">
              {/* Page title will be inserted by the page component */}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <motion.main
            className="flex-1 p-8" /* Increased padding */
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.main>
        </ScrollArea>
      </div>
    </div>
  );
};
