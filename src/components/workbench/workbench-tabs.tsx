"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import * as React from "react";

interface WorkbenchTabsProps {
    onTasksClick: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function WorkbenchTabs({ onTasksClick, activeTab, setActiveTab }: WorkbenchTabsProps) {
  const tabs = ["My Submissions", "Work Items", "Tasks", "Subjectivities", "All Submissions", "Portfolio Management", "Dashboard"];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Tasks") {
        onTasksClick();
    }
  }

  return (
    <div className="flex items-center border-b">
        <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary text-lg -ml-2">
            x
        </Button>
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`py-2 px-1 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "My Submissions" && (
              <Badge className="ml-2 bg-primary text-primary-foreground">9</Badge>
            )}
             {tab === "Work Items" && (
              <Badge className="ml-2 bg-accent text-accent-foreground">4</Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
