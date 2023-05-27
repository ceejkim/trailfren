import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { contentfulClient } from "../../contentfulClient";
import { app } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { AccountPage } from "./account";
import AccountSignupPage from "./account-signup";

export interface AccountInfo {
  entryId: string;
  organizationName: string;
  userId: string;
  affiliate?: Contentful.AffiliateField;
}

const AccountHandler = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
    undefined
  );

  useEffect(() => {
    const asyncEffect = async () => {
      if (auth.currentUser?.uid === undefined) {
        setLoading(false);
        return;
      }
      loadAccountInfo();
      setLoading(false);
    };
    asyncEffect();
  }, [auth.currentUser?.uid]);

  const loadAccountInfo = async () => {
    const q = query(
      collection(db, "affiliates"),
      where("userId", "==", auth.currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);

    const newFirebaseAccount = querySnapshot.docs[0].data();
    if (newFirebaseAccount) {
      const [affiliateEntry] = await Promise.all([
        contentfulClient.getEntries({
          content_type: "affiliate",
        }),
      ]);
      setAccountInfo({
        ...(newFirebaseAccount as AccountInfo),
        affiliate: affiliateEntry.items[0].fields as any,
      });
    }
  };

  if (loading) {
    return null;
  } else if (accountInfo) {
    return (
      <AccountPage
        accountInfo={accountInfo}
        loadAccountInfo={loadAccountInfo}
      />
    );
  } else {
    return <AccountSignupPage />;
  }
};

export default AccountHandler;
