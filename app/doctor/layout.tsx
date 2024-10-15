import React, { ReactNode } from "react";
import Header from "../components/ui/header";
import Sidebar from "./sidebarDoctor";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
