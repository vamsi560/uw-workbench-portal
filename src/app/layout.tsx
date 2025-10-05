import type {Metadata} from 'next';
import './globals.css';
import '../components/workbench/professional-theme.css';
import '../components/workbench/interactive-elements.css';


import { AppBar } from "@/components/ui/app-bar"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Home, List, BarChart3, User, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Cyber Insurance Underwriting Portal',
  description: 'Professional cyber insurance underwriting workbench',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use client-side path for active nav highlight
  // This is a workaround for Next.js app directory layouts
  let pathname = "";
  if (typeof window !== "undefined") {
    pathname = window.location.pathname;
  }

  // Sidebar navigation items
  const navItems = [
    { label: "Dashboard", icon: Home, href: "/" },
    { label: "Work Items", icon: List, href: "/work-items" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar className="bg-gradient-to-b from-[#0099A8] via-[#00B4D8] to-[#48CAE4] text-white shadow-xl">
              <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-4">
                  <img src="/favicon.ico" alt="Logo" className="h-8 w-8 rounded" />
                  <span className="text-lg font-bold tracking-wide">UW Portal</span>
                </div>
                <SidebarSeparator />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          asChild
                          isActive={typeof window !== "undefined" ? window.location.pathname === item.href : false}
                          className="hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white"
                        >
                          <a className="flex items-center gap-3 px-2 py-2 rounded transition-colors">
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <SidebarSeparator />
                <div className="flex flex-col items-center gap-2 py-4">
                  <SidebarTrigger />
                  <span className="text-xs text-white/70">Collapse</span>
                </div>
              </SidebarFooter>
            </Sidebar>
            <main className="flex-1 min-h-screen bg-background">
              <AppBar />
              <div className="pt-2">{children}</div>
              <Toaster />
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
