function isValidEmail(email: string): boolean {
  const emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailRegex.test(email);
}
function isValidUrl(str: string) {

  const pattern = new RegExp(
    "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
  );
  return pattern.test(str);
};

export { isValidEmail, isValidUrl };