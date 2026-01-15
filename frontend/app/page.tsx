'use client';
import { ContractContextProvider } from "@/components/context";
import MainPage from "@/components/main_page";
import Footer from "@/components/footer";


export default function Home() {
  return (
    <>
      <ContractContextProvider>
        <MainPage />
        <Footer />
      </ContractContextProvider>
    </>
  );
}
