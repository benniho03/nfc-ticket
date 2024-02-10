import Head from "next/head";
import HeaderNavigation from "@/components/header-navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer-navigation";
import ReactPDF from "@react-pdf/renderer";
import PdfCreate from "@/components/pdf/PdfCreate";

export default function Home() {

  return (
    <>
      <Head>
        <title>Tickety</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderNavigation mainSite={true} />
      <main>
        <div className="h-screen bg-[url('/assets/bg-img-nfc.webp')] bg-cover bg-center">
          <div className="container h-full pt-20">
            <div className=" flex h-full flex-col place-content-center items-center justify-center">
              <h1 className=" pb-2 text-center text-9xl font-black  drop-shadow-md outlinetext text-transparent">
                FIND YOUR
              </h1>
              <h1 className=" pb-2 text-center text-9xl font-black text-slate-50 drop-shadow-md mb-6">
                EVENT
              </h1>
              <div>
                <Button size={"lg"} className="py-8 text-3xl">
                  <a href="/event">Zu den Events</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
