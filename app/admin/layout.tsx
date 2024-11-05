import { ReactNode } from "react";
import Header from "../components/ui/header";
import Sidebar from "../components/ui/sideBar";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main className="md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
