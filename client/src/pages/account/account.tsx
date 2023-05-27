import { FunctionComponent, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Asset } from "contentful-management";
import { getFirestore } from "firebase/firestore";

import Button from "../../components/button";
import { contentfulClientManagement } from "../../contentfulClient";
import env from "../../../env";
import { app } from "../../firebaseConfig";
import { isValidUrl } from "../../utils/valid";
import { handleContentfulImage } from "../../utils/contentful";
import placeholder from "../../assets/placeholder.png";

interface AccountPageProps {
  accountInfo: {
    affiliate?: Contentful.AffiliateField;
  };
  loadAccountInfo?: () => Promise<void>;
}

interface Form {
  organizationName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  aboutUs?: string;
  contributionDetails?: string;
  website?: string;
  landingPages?: Contentful.AffiliateLandingPage[];
  clubs: string[];
  photo?: File | null;
}

export const AccountPage: FunctionComponent<AccountPageProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [validUrl, setValidUrl] = useState(true);
  const [formErrors, setFormErrors] = useState<Form>();
  const [formDisabled, setFormDisabled] = useState(true);

  // firebase user email
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [formData, setFormData] = useState<Form>({
    contactFirstName: props.accountInfo?.affiliate?.contactFirstName,
    contactLastName: props.accountInfo?.affiliate?.contactLastName,
    organizationName: props.accountInfo?.affiliate?.name,
    email: props.accountInfo?.affiliate?.treasurerEmail,
    aboutUs: props.accountInfo?.affiliate?.aboutUs,
    contributionDetails:
      props.accountInfo?.affiliate?.landingPages[0].fields.contributionDeets,
    website: props.accountInfo?.affiliate?.websiteUrl,
    ...Object.assign(
      {},
      ...(props.accountInfo?.affiliate?.landingPages?.map((lp, index) => ({
        [`contributionDeets-${index}`]: lp.fields.contributionDeets,
        [`landingPagePath-${index}`]: lp.fields.landingPagePath,
      })) || [])
    ),
    photo: null,
  });

  useEffect(() => {
    const asyncEffect = async () => {
      props.loadAccountInfo?.();
    };
    asyncEffect();
  }, []);

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

  const handleClick = (clubName: string) => {
    setFormData((formData) => ({
      ...formData,
      clubs: [...formData.clubs, clubName],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormDisabled((formDisabled) => !formDisabled);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const space = await contentfulClientManagement.getSpace(
        env.CONTENTFUL_SPACE_ID
      );
      const environment = await space.getEnvironment("master");

      let photoAsset: Asset | undefined;
      if (formData.photo) {
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
        photoAsset = await environment.createAsset({
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
        await photoAsset.processForAllLocales();
        const uploadedAsset = await environment.getAsset(photoAsset.sys.id);
        await uploadedAsset.publish();
      }

      // Get the current entry by ID
      const accountInfoEntry = await environment.getEntry("placeholder");

      // Update fields with new data from the form
      accountInfoEntry.fields.contactFirstName = {
        "en-US": formData.contactFirstName!,
      };
      accountInfoEntry.fields.contactLastName = {
        "en-US": formData.contactLastName!,
      };
      accountInfoEntry.fields.name = {
        "en-US": formData.organizationName!,
      };
      accountInfoEntry.fields.treasurerEmail = {
        "en-US": formData.email!,
      };
      accountInfoEntry.fields.aboutUs = {
        "en-US": formData.aboutUs!,
      };
      accountInfoEntry.fields.websiteUrl = {
        "en-US": formData.website!,
      };
      if (photoAsset) {
        accountInfoEntry.fields.logo = {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: photoAsset.sys.id,
            },
          },
        };
      }

      // Update landing page data
      const landingPageCount =
        accountInfoEntry.fields.landingPages["en-US"].length;
      for (let i = 0; i < landingPageCount; i++) {
        const landingPageEntry = await environment.getEntry(
          props.accountInfo?.affiliate?.landingPages?.[i].sys.id!
        );
        landingPageEntry.fields.contributionDeets = {
          "en-US": (formData as any)[`contributionDeets-${i}`],
        };
        landingPageEntry.fields.landingPagePath = {
          "en-US": (formData as any)[`landingPagePath-${i}`],
        };
        const updatedLandingPageEntry = await landingPageEntry.update();
        await updatedLandingPageEntry.publish();
      }

      const updatedAccountInfoEntry = await accountInfoEntry.update();
      await updatedAccountInfoEntry.publish();

      setFormDisabled(true);
      await props.loadAccountInfo?.();
    } catch (error) {
      console.error("Error updating entry:", error);
      // Perform any error handling actions, e.g. show an error message
    }

    setLoading(false);
  };

  const inputClass = formDisabled
    ? "w-1/2 mr-2 appearance-none py-2 text-gray-700 bg-white leading-tight"
    : `w-1/2 mr-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
        loading ? " opacity-50 cursor-not-allowed" : ""
      }`;
  const textareaClass = formDisabled
    ? "w-1/2 mr-2 w-full appearance-none py-2 text-gray-700 bg-white leading-tight"
    : `mt-2 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
        loading ? " opacity-50 cursor-not-allowed" : ""
      }`;

  const imageUrl = props.accountInfo?.affiliate?.logo?.fields.file.url;

  return (
    <section>
      <div className="mx-4 md:mx-auto mt-20 flex max flex-col max-w-2xl justify-center">
        <h4 className="my-14 text-4xl font-medium">Account</h4>
        <div className="relative">
          <form onSubmit={formDisabled ? handleEdit : handleSubmit}>
            {formDisabled ? (
              <div className="w-full flex flex-col justify-left mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Organization Logo
                </label>
                <img
                  className="w-40 h-40"
                  src={imageUrl ? handleContentfulImage(imageUrl) : placeholder}
                />
              </div>
            ) : (
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
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              {!formDisabled ? (
                <span className="text-xs text-gray-600">
                  The treasurer or decision maker of the organization
                </span>
              ) : null}
              <div className="mt-2 flex relative">
                <input
                  type="text"
                  name="contactFirstName"
                  value={
                    formDisabled &&
                    (formData.contactFirstName || formData.contactLastName)
                      ? `${formData.contactFirstName || ""} ${
                          formData.contactLastName || ""
                        }`
                      : formData.contactFirstName || ""
                  }
                  onChange={handleChange}
                  placeholder={formDisabled ? "Name" : "First Name"}
                  required
                  disabled={formDisabled || loading}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="contactLastName"
                  value={formDisabled ? " " : formData.contactLastName || ""}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  disabled={formDisabled || loading}
                  className={inputClass}
                />
                {formErrors?.contactFirstName && (
                  <p className="text-red italic absolute bottom-0">
                    {formErrors?.contactFirstName}
                  </p>
                )}
                {formErrors?.contactLastName && (
                  <p className="text-red italic absolute bottom-0ƒ">
                    {formErrors?.contactLastName}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-6 flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              {!formDisabled ? (
                <span className="text-xs text-gray-600">
                  The treasurer or decision maker of the organization
                </span>
              ) : null}
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={formDisabled || loading}
                className={inputClass}
              />
              {formErrors?.email && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors?.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName || ""}
                onChange={handleChange}
                placeholder="Organization Name"
                required
                disabled={formDisabled || loading}
                className={inputClass}
              />
              {formErrors?.organizationName && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors?.organizationName}
                </p>
              )}
            </div>
            <div className="mb-8 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message
              </label>
              {!formDisabled ? (
                <span className="text-xs text-gray-600">
                  Two sentence blurb on mission of organization
                </span>
              ) : null}
              <textarea
                name="aboutUs"
                value={formData.aboutUs || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Message"
                required
                disabled={formDisabled || loading}
                className={textareaClass}
              ></textarea>
              {!formDisabled ? (
                <p className="text-xs text-gray-600 absolute bottom-2 right-2">
                  {`${(formData.aboutUs || "").length} characters`}
                </p>
              ) : null}
              {(formData.aboutUs || "").length > 0 &&
              (formData.aboutUs || "").length < 100 ? (
                <p className="text-red-500 text-xs italic absolute -bottom-4 text-red left-0">
                  Message must be at least 100 characters.
                </p>
              ) : null}
              {(formData.aboutUs || "").length > 1000 ? (
                <p className="text-red-500 text-xs italic absolute -bottom-4 text-red left-0">
                  Message must be under 1000 characters.
                </p>
              ) : null}
              {formErrors?.aboutUs && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors?.aboutUs}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Organization Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="URL"
                required
                disabled={formDisabled || loading}
                className={inputClass}
              />
              {formErrors?.website && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors?.website}
                </p>
              )}
            </div>
            <div className="flex justify-center md:justify-end mb-4 w-full">
              {!formDisabled ? (
                <Button
                  type="secondary"
                  onClick={() => setFormDisabled(true)}
                  loading={loading}
                >
                  Cancel
                </Button>
              ) : null}
              <Button loading={true}>
                {formDisabled ? "Edit Info" : "Update Info"}
              </Button>
            </div>
            {loading && <div className="spinner"></div>}
          </form>
        </div>
      </div>
    </section>
  );
};
