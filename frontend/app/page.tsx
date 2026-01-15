'use client';
import { ContractContextProvider } from "@/components/context";
import Nav from "@/components/nav";
import MainPage from "@/components/main";
import Footer from "@/components/footer";


export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0f172a] relative">
      <ContractContextProvider>
        <Nav />
        <MainPage />
        <Footer />
      </ContractContextProvider>
    </div>
    );
}
