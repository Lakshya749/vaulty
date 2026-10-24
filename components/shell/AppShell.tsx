"use client";

import React, { useState } from "react";
import { SidebarPill } from "./SidebarPill";
import { MobileTabBar } from "./MobileTabBar";
import { HeaderBar } from "./HeaderBar";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { CommandPalette } from "./CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      {/* Desktop Floating Sidebar */}
      <SidebarPill />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[104px] px-4 sm:px-8 py-4 max-w-[1440px] mx-auto pb-24 md:pb-12">
        <HeaderBar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenSearch={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
        />

        {children}
      </div>

      {/* Mobile Floating Bottom Nav */}
      <MobileTabBar />

      {/* Global ⌘K Command Palette */}
      <CommandPalette onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Add / Edit Subscription Modal */}
      <SubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
