import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { flatten } from "lodash";
import { getAuth, User } from "firebase/auth";

import TrailfrenSDK from "./sdk";
import Navbar from "./components/navbar";
import LoginModal from "./components/login-modal";
import {
  HomePage,
  DonationsPage,
  AccountPage,
  FAQPage,
  SignUpPage,
} from "./pages";
import Footer from "./components/footer";
import { contentfulClient } from "./contentfulClient";
import { app } from "./firebaseConfig";
import "./index.css";

export const TrailfrenContext = createContext<{
  sdk: TrailfrenSDK;
  user: User | null;
  affiliates: Contentful.AffiliateField[];
}>({
  sdk: new TrailfrenSDK(),
  user: null,
  affiliates: [],
});

function App() {
  const sdk = new TrailfrenSDK();
  const auth = getAuth(app);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [affiliates, setAffiliates] = useState<Contentful.AffiliateField[]>([]);
  const [landingPagePaths, setLandingPagePaths] = useState<string[]>([]);

  function getLandingPagePaths(
    affiliates: Contentful.AffiliateField[]
  ): string[] {
    const landingPages = flatten(affiliates.map((a) => a.landingPages));
    const landingPagePaths = landingPages.map(
      (lp) => lp?.fields.landingPagePath
    );
    const filteredPaths = landingPagePaths.filter((lp) => lp) as string[];

    return filteredPaths;
  }

  useEffect(() => {
    const asyncEffect = async () => {
      auth.onAuthStateChanged((user) => {
        setUser(user);
      });

      const affiliatesRes = await contentfulClient.getEntries({
        content_type: "affiliate",
      });
      // contentful getEntries types seem borked, manually cast to AffiliateField[]
      const newAffiliates = affiliatesRes.items.map(
        (i) => i.fields
      ) as unknown as Contentful.AffiliateField[];
      setAffiliates(newAffiliates);
      const newLandingPagePaths = getLandingPagePaths(newAffiliates);
      setLandingPagePaths(newLandingPagePaths);
      setLoading(false);
    };
    asyncEffect();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div>
      <TrailfrenContext.Provider
        value={{
          sdk,
          user,
          affiliates,
        }}
      >
        <Navbar setModalVisible={setModalVisible} />
        <LoginModal visible={modalVisible} setModalVisible={setModalVisible} />
        <Routes>
          <Route
            index
            element={<HomePage setModalVisible={setModalVisible} />}
          />
          <Route index element={<SignUpPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="account" element={<AccountPage />} />
          {landingPagePaths.map((path) => (
            <Route key={path} path={path} element={<DonationsPage />} />
          ))}
          <Route
            path="*"
            element={<HomePage setModalVisible={setModalVisible} />}
          />
        </Routes>
        <Footer />
      </TrailfrenContext.Provider>
    </div>
  );
}

export default App;
