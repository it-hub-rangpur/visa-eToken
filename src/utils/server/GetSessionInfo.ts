import { JSDOM } from "jsdom";

const GetSessionInfo = (htmlString: string) => {
  const csrfTokenRegex = /var csrf_token = "([^"]+)"/;
  const csrfTokenMatch = htmlString?.match(csrfTokenRegex);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";

  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  const userImgElement = doc.querySelector("img.rounded-circle");
  const userImg = userImgElement ? userImgElement.getAttribute("src") : "";

  return {
    _token: csrfToken,
    isLoggedin: userImg ? true : false,
  };
};
export default GetSessionInfo;
