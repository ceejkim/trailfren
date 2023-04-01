import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { flatten } from "lodash";
import TrailfrenSDK from "./sdk";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import AccountPage from "./pages/account";
import LoginModal from "./components/login-modal";
import FAQPage from "./pages/faq";
import DonationsPage from "./pages/donations";
import Footer from "./components/footer";
import contentfulClient from "./contentfulClient";
import "./index.css";

interface User {
  username: string;
}

export const TrailfrenContext = createContext<{
  sdk: TrailfrenSDK;
  user: User;
  affiliates: Contentful.AffiliateField[];
  landingPages: Contentful.LandingPageField[];
}>({
  sdk: new TrailfrenSDK(),
  user: { username: "" },
  affiliates: [],
  landingPages: [],
});

function App() {
  const sdk = new TrailfrenSDK();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Contentful.AffiliateField[]>([]);
  const [landingPages, setLandingPages] = useState<
    Contentful.LandingPageField[]
  >([]);

  useEffect(() => {
    const asyncEffect = async () => {
      const affiliatesRes =
        await contentfulClient.getEntries<Contentful.AffiliateField>({
          content_type: "affiliate",
        });
      const landingPageRes =
        await contentfulClient.getEntries<Contentful.LandingPageField>({
          content_type: "landingPage",
        });
      setAffiliates(affiliatesRes.items.map((i) => i.fields));
      setLandingPages(landingPageRes.items.map((i) => i.fields));
      setLoading(false);
    };
    asyncEffect();
  }, []);

  const affiliatePaths: string[] = flatten(
    affiliates
      .map((a) => a.landingPages?.map((lp) => `/${lp.fields.landingPagePath}`)!)
      .filter((p) => p)
  );

  if (loading) {
    return null;
  }

  return (
    <div>
      <TrailfrenContext.Provider
        value={{
          sdk,
          user: {
            username: "test",
          },
          affiliates,
          landingPages,
        }}
      >
        <Navbar setModalVisible={setModalVisible} />
        <LoginModal visible={modalVisible} setModalVisible={setModalVisible} />
        <Routes>
          <Route index element={<Home />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="account" element={<AccountPage />} />
          {affiliatePaths.map((path) => (
            <Route key={path} path={path} element={<DonationsPage />} />
          ))}
        </Routes>
        <Footer />
      </TrailfrenContext.Provider>
    </div>
  );
}

export default App;
