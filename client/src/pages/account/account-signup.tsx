import { FunctionComponent, useState } from "react";
import { getAuth } from "firebase/auth";
import { Asset, Entry } from "contentful-management";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import Button from "../../components/button";
import { contentfulClientManagement } from "../../contentfulClient";
import env from "../../../env";
import { app } from "../../firebaseConfig";
import { isValidUrl } from "../../utils/valid";

interface AccountPageProps {}

interface Form {
  organizationName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  aboutUs?: string;
  contributionDetails?: string;
  website?: string;
  customUrlPath?: string;
  photo: File | null;
}

const AccountSignupPage: FunctionComponent<AccountPageProps> = () => {
  const [loading, setLoading] = useState(false);
  const [validUrl, setValidUrl] = useState(true);
  const [validWebsite, setValidWebsite] = useState(true);
  const [uniqueUrlError, setUniqueUrlError] = useState(false);
  const [validAboutUs, setValidAboutUs] = useState(true);
  const [formData, setFormData] = useState<Form>({
    contactFirstName: undefined,
    contactLastName: undefined,
    email: undefined,
    aboutUs: undefined,
    contributionDetails: undefined,
    website: undefined,
    customUrlPath: undefined,
    photo: null,
  });

  // firebase user email
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let inputValue = e.target.value;
    if (e.target.name === "customUrlPath") {
      const isValid = isValidUrl(`https://www.trailfren.com/${inputValue}`);
      setValidUrl(isValid);
    }
    setFormData({ ...formData, [e.target.name]: inputValue });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // clear errors
    setUniqueUrlError(false);
    setValidUrl(true);
    setValidWebsite(true);

    if (formData.aboutUs?.length! < 100 || formData.aboutUs?.length! > 1000) {
      setValidAboutUs(false);
      setLoading(false);
      return;
    }

    let websiteUrl = formData.website || "";
    if (
      !websiteUrl.startsWith("http://") &&
      !websiteUrl.startsWith("https://")
    ) {
      if (websiteUrl.startsWith("www.")) {
        websiteUrl = "https://" + websiteUrl;
      } else {
        websiteUrl = "https://www." + websiteUrl;
      }
    }
    if (!isValidUrl(websiteUrl)) {
      setValidWebsite(false);
      setLoading(false);
      return;
    }

    let asset: Asset | undefined = undefined;
    let landingPageEntry: Entry | undefined = undefined;
    let newEntry: Entry | undefined = undefined;

    try {
      // First, upload the image file to Contentful
      const space = await contentfulClientManagement.getSpace(
        env.CONTENTFUL_SPACE_ID
      );
      const environment = await space.getEnvironment("master");

      // Convert the image file to an ArrayBuffer
      const fileReader = new FileReader();
      const promise = new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
        fileReader.onerror = () => reject(fileReader.error);
        fileReader.readAsArrayBuffer(formData.photo!);
      });

      const arrayBuffer = await promise;

      // Next, upload the image file to Contentful
      const upload = await environment.createUpload({ file: arrayBuffer });

      // Next, create an asset for the uploaded image
      asset = await environment.createAsset({
        fields: {
          title: {
            "en-US": formData.photo?.name!,
          },
          file: {
            "en-US": {
              fileName: formData.email!,
              contentType: formData.photo?.type!,
              uploadFrom: {
                sys: {
                  type: "Link",
                  linkType: "Upload",
                  id: upload.sys.id,
                },
              },
            },
          },
        },
      });

      // Process and publish the asset
      await asset.processForAllLocales();
      const uploadedAsset = await environment.getAsset(asset.sys.id);
      await uploadedAsset.publish();

      // create landing page entry
      landingPageEntry = await environment.createEntry("landingPage", {
        fields: {
          name: {
            "en-US": formData.organizationName,
          },
          landingPagePath: {
            "en-US": formData.customUrlPath,
          },
          contributionDeets: {
            "en-US": formData.contributionDetails,
          },
          // Add any other required fields for the landingPage content type here
        },
      });

      try {
        await landingPageEntry.publish();
        setUniqueUrlError(false);
      } catch (error: any) {
        // Rollback: Unpublish and delete the asset
        await uploadedAsset.unpublish();
        await uploadedAsset.delete();

        const errorMessage = JSON.parse(error.message).details.errors[0]
          .details;
        if (errorMessage === "Same field value present in other entry") {
          setUniqueUrlError(true);
          setLoading(false);
        }
        return;
      }

      const userEmail = auth.currentUser?.email;
      // Finally, create the Affiliate entry with the form data and the created asset
      newEntry = await environment.createEntry("affiliate", {
        fields: {
          name: {
            "en-US": formData.organizationName,
          },
          contactFirstName: {
            "en-US": formData.contactFirstName,
          },
          contactLastName: {
            "en-US": formData.contactLastName,
          },
          aboutUs: {
            "en-US": formData.aboutUs,
          },
          logo: {
            "en-US": {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: asset.sys.id,
              },
            },
          },
          treasurerEmail: {
            "en-US": userEmail,
          },
          adminFirebaseEmail: {
            "en-US": userEmail,
          },
          websiteUrl: {
            "en-US": websiteUrl,
          },
          landingPages: {
            "en-US": [
              {
                sys: {
                  type: "Link",
                  linkType: "Entry",
                  id: landingPageEntry.sys.id,
                },
              },
            ],
          },
        },
      });

      await newEntry.publish();

      // Save the entry ID to Firestore associated with the admin's Firebase UID
      const userId = auth.currentUser?.uid;
      const entryId = newEntry.sys.id;

      if (userId) {
        await addDoc(collection(db, "affiliates"), {
          userId,
          entryId,
          organizationName: formData.organizationName,
        });
      }

      setLoading(false);
    } catch (error) {
      // Rollback actions
      if (asset) {
        await asset.unpublish();
        await asset.delete();
      }
      if (landingPageEntry) {
        await landingPageEntry.unpublish();
        await landingPageEntry.delete();
      }
      if (newEntry) {
        await newEntry.unpublish();
        await newEntry.delete();
      }

      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <section>
      <div className="mx-auto mt-20 flex max flex-col max-w-2xl justify-center">
        <h4 className="mx-8 my-14 text-4xl font-medium">Account Setup</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name *
            </label>
            <span className="text-xs text-gray-600">
              Should be treasurer or decision maker of organization
            </span>
            <div className="mt-2 flex">
              <input
                type="text"
                name="contactFirstName"
                value={formData.contactFirstName || ""}
                onChange={handleChange}
                placeholder="First Name"
                required
                className={`w-1/2 mr-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                  loading ? " opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="text"
                name="contactLastName"
                value={formData.contactLastName || ""}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className={`w-1/2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                  loading ? " opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <span className="text-xs text-gray-600">
              Should be treasurer or decision maker of organization
            </span>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              required
              className={`mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                loading ? " opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Organization Name *
            </label>
            <div className="mt-2 flex">
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName || ""}
                onChange={handleChange}
                placeholder="Organization Name"
                required
                className={`w-1/2 mr-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                  loading ? " opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
          <div className="mb-8 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Message *
            </label>
            <span className="text-xs text-gray-600">
              Two sentence blurb on mission of organization
            </span>
            <textarea
              name="aboutUs"
              value={formData.aboutUs || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Message"
              required
              className={`mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                loading ? " opacity-50 cursor-not-allowed" : ""
              }`}
            ></textarea>
            <p className="text-xs text-gray-600 absolute bottom-2 right-2">
              {`${(formData.aboutUs || "").length} characters`}
            </p>
            {(formData.aboutUs || "").length < 100 ||
            (formData.aboutUs || "").length > 1000 ? (
              <p className="text-red-500 text-xs italic absolute -bottom-4 text-red left-0">
                {(formData.aboutUs || "").length < 100
                  ? "Message must be at least 100 characters."
                  : ""}
                {(formData.aboutUs || "").length > 1000
                  ? "Message must be under 1000 characters."
                  : ""}
              </p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contribution Details *
            </label>
            <span className="text-xs text-gray-600">
              Two sentence blurb on ways the organization will spend the funds
            </span>
            <textarea
              name="contributionDetails"
              value={formData.contributionDetails || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Contribution details"
              required
              className={`mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                loading ? " opacity-50 cursor-not-allowed" : ""
              }`}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Organization Website *
            </label>
            <input
              type="text"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="Website"
              required
              className={`mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                loading ? " opacity-50 cursor-not-allowed" : ""
              }`}
            />
            {!validWebsite && (
              <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                Please enter a valid URL.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Custom Trailfren URL Path
            </label>
            <div className="flex items-center mt-2 relative">
              <span className="text-gray-700 mr-2">www.trailfren.com/</span>
              <input
                type="text"
                name="customUrlPath"
                value={formData.customUrlPath || ""}
                onChange={handleChange}
                placeholder="your-path-here"
                required
                className={`w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                  loading ? " opacity-50 cursor-not-allowed" : ""
                }`}
              />
              {!validUrl && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  Please enter a valid URL.
                </p>
              )}
              {uniqueUrlError && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  This URL is already taken.
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoUpload}
              required
              className={`mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
                loading ? " opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Button loading={loading}>Create Account</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccountSignupPage;
