import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (<>
    <ClerkProvider {...pageProps}>
      <Toaster />
      {/* <UserButton /> */}
      <Component {...pageProps} />
    </ClerkProvider>
  </>)
};

export default api.withTRPC(MyApp);
