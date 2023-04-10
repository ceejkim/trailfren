import { FunctionComponent, useState } from "react";
import { getAuth } from "firebase/auth";
import { Asset } from "contentful-management";
import { getFirestore } from "firebase/firestore";

import Button from "../../components/button";
import { contentfulClientManagement } from "../../contentfulClient";
import env from "../../../env";
import { app } from "../../firebaseConfig";
import { isValidEmail, isValidUrl } from "../../utils/valid";
import { AccountInfo } from ".";
import { handleContentfulImage } from "../../utils/contentful";

interface AccountPageProps {
  accountInfo: AccountInfo;
  loadAccountInfo: () => Promise<void>;
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
  photo?: File | null;
}

const AccountPage: FunctionComponent<AccountPageProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [validUrl, setValidUrl] = useState(true);
  const [formErrors, setFormErrors] = useState<Form>({});
  const [formDisabled, setFormDisabled] = useState(true);

  const [formData, setFormData] = useState<Form>({
    contactFirstName: props.accountInfo.affiliate.contactFirstName,
    contactLastName: props.accountInfo.affiliate.contactLastName,
    organizationName: props.accountInfo.affiliate.name,
    email: props.accountInfo.affiliate.treasurerEmail,
    aboutUs: props.accountInfo.affiliate.aboutUs,
    contributionDetails: props.accountInfo.affiliate.contributionDeets,
    website: props.accountInfo.affiliate.websiteUrl,
    ...Object.assign(
      {},
      ...(props.accountInfo.affiliate.landingPages?.map((lp, index) => ({
        [`contributionDeets-${index}`]: lp.fields.contributionDeets,
        [`landingPagePath-${index}`]: lp.fields.landingPagePath,
      })) || [])
    ),
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
    console.log("new update: ", { [e.target.name]: inputValue });
    setFormData({ ...formData, [e.target.name]: inputValue });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormDisabled((formDisabled) => !formDisabled);
  };

  const validateForm = () => {
    const newErrors: Form = {};

    // Validate contactFirstName (required field)
    if (!formData.contactFirstName) {
      newErrors.contactFirstName = "Contact first name is required";
    }

    // Validate contactLastName (required field)
    if (!formData.contactLastName) {
      newErrors.contactLastName = "Contact last name is required";
    }

    // Validate email (required field and email format)
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate organizationName (required field)
    if (!formData.organizationName) {
      newErrors.organizationName = "Organization name is required";
    }

    // Validate aboutUs (required field)
    if (!formData.aboutUs) {
      newErrors.aboutUs = "About us is required";
    }

    // Validate contributionDetails (required field)
    if (!formData.contributionDetails) {
      newErrors.contributionDetails = "Contribution details is required";
    }

    // Validate website (required field and url format)
    if (!formData.website) {
      newErrors.website = "Website is required";
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = "Website is invalid";
    }

    // Validate landingPagesFields (required field and url format)
    if (formData.landingPages) {
      formData.landingPages.forEach((lp, index) => {
        if (!lp.fields.contributionDeets) {
          (newErrors as any)[`contributionDeets-${index}`] =
            "Contribution details are required";
        }
        if (!lp.fields.landingPagePath) {
          (newErrors as any)[`landingPagePath-${index}`] =
            "Landing page path is required";
        } else if (
          !isValidUrl(`https://www.trailfren.com/${lp.fields.landingPagePath}`)
        ) {
          (newErrors as any)[`landingPagePath-${index}`] =
            "Landing page path is invalid";
        }
      });
    }

    setFormErrors(newErrors);

    // If there are no errors, the form is valid
    return Object.keys(newErrors).length === 0;
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
      const accountInfoEntry = await environment.getEntry(
        props.accountInfo.entryId
      );

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
        console.log("updating photo");
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
          props.accountInfo.affiliate.landingPages?.[i].sys.id!
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
      await props.loadAccountInfo();
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

  return (
    <section>
      <div className="mx-auto mt-20 flex max flex-col max-w-2xl justify-center">
        <h4 className="mx-8 my-14 text-4xl font-medium">Account</h4>
        <div className="relative">
          <form onSubmit={formDisabled ? handleEdit : handleSubmit}>
            {formDisabled ? (
              <div className="w-full flex justify-left mb-6">
                {/* <div className={styles.logo}> */}
                <img
                  className="w-40 h-40"
                  src={handleContentfulImage(
                    props.accountInfo.affiliate?.logo?.fields.file.url
                  )}
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
                    formDisabled
                      ? `${formData.contactFirstName || ""} ${
                          formData.contactLastName || ""
                        }`
                      : formData.contactFirstName || ""
                  }
                  onChange={handleChange}
                  placeholder="First Name"
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
                {formErrors.contactFirstName && (
                  <p className="text-red italic absolute bottom-0">
                    {formErrors.contactFirstName}
                  </p>
                )}
                {formErrors.contactLastName && (
                  <p className="text-red italic absolute bottom-0ƒ">
                    {formErrors.contactLastName}
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
              {formErrors.email && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors.email}
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
              {formErrors.organizationName && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors.organizationName}
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
              {formErrors.aboutUs && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors.aboutUs}
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
                placeholder="Website"
                required
                disabled={formDisabled || loading}
                className={inputClass}
              />
              {formErrors.website && (
                <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                  {formErrors.website}
                </p>
              )}
            </div>
            <p className=" text-lg font-bold my-10">Landing Pages</p>
            {props.accountInfo.affiliate.landingPages?.map(
              (landingPage, index) => (
                <div key={`lp-${index}`}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Custom Trailfren URL Path
                    </label>
                    {formDisabled ? (
                      <a
                        className=" text-blue-600 font-medium hover:opacity-80"
                        target="_blank"
                        href={`https://www.trailfren.com/${
                          (formData as any)[`landingPagePath-${index}`]
                        }`}
                      >{`www.trailfren.com/${
                        (formData as any)[`landingPagePath-${index}`]
                      }`}</a>
                    ) : (
                      <div className="flex items-center mt-2 relative">
                        <span className="text-gray-700 mr-2">
                          www.trailfren.com/
                        </span>
                        <input
                          type="text"
                          name={`landingPagePath-${index}`}
                          value={
                            (formData as any)[`landingPagePath-${index}`] || ""
                          }
                          onChange={handleChange}
                          placeholder="your-path-here"
                          required
                          disabled={formDisabled || loading}
                          className={
                            inputClass + `${formDisabled ? " -ml-2" : ""}`
                          }
                        />
                        {(formErrors as any)[`landingPagePath-${index}`] && (
                          <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                            {(formErrors as any)[`landingPagePath-${index}`]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Contribution Details
                    </label>
                    {!formDisabled ? (
                      <span className="text-xs text-gray-600">
                        Two sentence blurb on ways the organization will spend
                        the funds
                      </span>
                    ) : null}
                    <textarea
                      name={`contributionDeets-${index}`}
                      value={
                        (formData as any)[`contributionDeets-${index}`] || ""
                      }
                      onChange={handleChange}
                      rows={4}
                      placeholder="Contribution details"
                      required
                      disabled={formDisabled || loading}
                      className={textareaClass}
                    ></textarea>
                    {(formErrors as any)[`contributionDeets-${index}`] && (
                      <p className="text-red-500 text-xs italic absolute -bottom-5 text-red left-44">
                        {(formErrors as any)[`contributionDeets-${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
            <div className="flex justify-end w-full">
              {!formDisabled ? (
                <Button
                  type="secondary"
                  onClick={() => setFormDisabled(true)}
                  loading={loading}
                >
                  Cancel
                </Button>
              ) : null}
              <Button loading={loading}>
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

export default AccountPage;
