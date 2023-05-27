import {
  useRef,
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import clubs from "./clubs";
import { TrailfrenContext } from "../../routes";
import heartIcon from "../../assets/icons/heart.svg";
import heartFullIcon from "../../assets/icons/heart-full.svg";

export const UserAccountPage: FunctionComponent = () => {
  const { user } = useContext(TrailfrenContext);
  const db = getFirestore(app);
  const location = useLocation();

  const referralClub = location.state?.club;
  const [firstName, setFirstName] = useState("");
  const [search, setSearch] = useState("");
  const [activeClubs, setActiveClubs] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !referralClub) return;

    const fetchData = async () => {
      const memberRef = doc(db, "members", user.uid);
      const docSnap = await getDoc(memberRef);

      if (docSnap.exists()) {
        if (docSnap.data().firstName) {
          setFirstName(docSnap.data().firstName);
        }

        // Store the referralClub in a new field if it's not already stored
        if (docSnap.data().referralClub !== referralClub) {
          await updateDoc(memberRef, {
            referralClub: referralClub,
          });
        }
      } else {
        // If there's no document yet, create a new one with the referralClub
        await setDoc(memberRef, {
          referralClub: referralClub,
        });
      }
    };

    fetchData();
  }, [user, referralClub]);

  useEffect(() => {
    // Define the function that will be called on keypress
    function handleKeyDown(event: any) {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        ref.current?.focus();
      }
    }

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Return a cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const joinClub = async (newClub: string) => {
    if (!user) return;

    setLoading(newClub);

    const memberRef = doc(db, "members", user.uid);

    const docSnap = await getDoc(memberRef);

    if (!docSnap.exists()) {
      await setDoc(memberRef, {
        clubs: [newClub],
      });
      console.log("Member and club created successfully.");
    } else {
      let clubs = docSnap.data().clubs;
      if (!clubs.includes(newClub)) {
        await updateDoc(memberRef, {
          clubs: arrayUnion(newClub),
        });
        console.log("Club added successfully.");
      } else {
        // remove the club from the database if it already exists
        await updateDoc(memberRef, {
          clubs: arrayRemove(newClub),
        });
        console.log("Club removed from array.");
      }
    }

    // Here you should refetch the club data after modification.
    // So that it can reflect the change in the UI.
    const updatedDocSnap = await getDoc(memberRef);
    const updatedClubs = updatedDocSnap.data()?.clubs;
    setActiveClubs(updatedClubs);

    setLoading(undefined);
  };

  const handleFirstNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFirstName = e.target.value;
    setFirstName(newFirstName);

    if (!user) return;

    const memberRef = doc(db, "members", user.uid);

    // This will update the first name in Firestore on the fly
    await updateDoc(memberRef, {
      firstName: newFirstName,
    });
  };

  const city = "Charlottesville";
  const categories = Object.keys(clubs[city]);

  return (
    <section>
      <div className="mx-4 md:mx-auto mt-20 flex max flex-col max-w-2xl justify-center">
        <h4 className="mb-14 text-4xl font-medium">User Account</h4>
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Email Address
            </label>
            <p>{user?.email}</p>
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium leading-6 text-gray-900"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </form>
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Quick search
            <span className="text-xs text-gray-600 ml-4">
              You will receive event updates, newsletters, etc for each
              organization you select
            </span>
          </label>
          <div className="relative mt-2 flex items-center mb-4">
            <input
              ref={ref}
              type="text"
              name="search"
              id="search"
              className="block w-full px-2 rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search for frens you want to hear from"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full max-h-[600px] overflow-auto mb-4 p-4">
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {category}
              </label>
              <div className="flex flex-col">
                <ul role="list" className="divide-y divide-salmon-400">
                  {clubs[city][category].map((club) => {
                    return club.name.toLowerCase().includes(search) ? (
                      <li
                        key={club.name}
                        className="flex justify-between gap-x-6 py-5 relative"
                      >
                        <div className="flex gap-x-4">
                          <img
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={club.logo}
                            alt=""
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {club.name}
                            </p>
                            <a
                              href={club.href}
                              className="mt-1 truncate text-xs leading-5 font-semibold text-salmon-400 hover:text-salmon-600"
                              target="_blank"
                            >
                              {club.href}
                            </a>
                          </div>
                        </div>
                        {loading === club.name ? (
                          <img className="heart" src={heartFullIcon} />
                        ) : (
                          // <div className="spinner-small mt-3" />
                          <button
                            disabled={!!loading}
                            onClick={() => joinClub(club.name)}
                          >
                            {activeClubs.includes(club.name) ? (
                              <img src={heartFullIcon} className="h-6 w-6" />
                            ) : (
                              <img src={heartIcon} className="h-6 w-6" />
                            )}
                          </button>
                        )}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
