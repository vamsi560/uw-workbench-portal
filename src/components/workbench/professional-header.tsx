"use client";

import * as React from "react";
import { Bell, Search, Settings, User, ChevronDown, Globe, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ProfessionalHeaderProps {
  currentPage?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  userInfo?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  notificationCount?: number;
}

export function ProfessionalHeader({
  currentPage = "Work Items",
  breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Underwriting", href: "/underwriting" },
    { label: "Workbench" }
  ],
  userInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Senior Underwriter"
  },
  notificationCount = 3
}: ProfessionalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700/50">
      {/* Top Bar */}
      <div className="border-b border-blue-700/30 bg-blue-900/20">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global Portal</span>
              </div>
              <div>Last updated: {new Date().toLocaleString()}</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="h-8 text-blue-100 hover:bg-blue-700/50">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-blue-100 hover:bg-blue-700/50">
                Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-50 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-800 font-bold text-lg">UW</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Underwriting Workbench</h1>
                <p className="text-sm text-blue-200">Cyber Insurance Portal</p>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList className="text-sm">
                {(breadcrumbItems || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href} className="text-blue-200 hover:text-white">
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-medium text-white">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Section - Search & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Search submissions, work items..."
                className="w-80 pl-10 bg-white/10 border-blue-600/30 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 text-white hover:bg-blue-700/50">
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-600">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary" className="text-xs">
                    {notificationCount} new
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start space-x-3 p-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">New submission assigned</p>
                    <p className="text-xs text-muted-foreground">Work item #WI-2024-001 requires your attention</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Risk assessment completed</p>
                    <p className="text-xs text-muted-foreground">ABC Corp submission ready for review</p>
                    <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm font-medium text-primary">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-blue-700/50">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9 px-3 text-white hover:bg-blue-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-blue-800 font-medium text-sm">
                      {(userInfo?.name || '').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                    <p className="text-xs text-blue-200 mt-1">{userInfo.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}