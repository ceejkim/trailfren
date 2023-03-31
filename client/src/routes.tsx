import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TrailfrenSDK from "./sdk";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import AccountPage from "./pages/account";
import LoginModal from "./components/login-modal";
import FAQPage from "./pages/faq";
import Footer from "./components/footer";
import "./index.css";

interface User {
  username: string;
}

export const TrailfrenContext = createContext<{ sdk: TrailfrenSDK; user: User }>({
  sdk: new TrailfrenSDK(),
  user: { username: "" },
});

function App() {
  const sdk = new TrailfrenSDK();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <TrailfrenContext.Provider
        value={{
          sdk,
          user: {
            username: "test",
          },
        }}
      >
        <Navbar setModalVisible={setModalVisible} />
        <LoginModal visible={modalVisible} setModalVisible={setModalVisible} />
        <Routes>
          <Route index element={<Home />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="account" element={<AccountPage />} />
        </Routes>
        <Footer />
      </TrailfrenContext.Provider>
    </div>
  );
}

export default App;
