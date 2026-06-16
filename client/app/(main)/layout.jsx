import Footer from "../components/commonUI/Footer";
import TopNav from "../components/commonUI/TopNav";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}
