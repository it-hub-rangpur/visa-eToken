const GetSessionInfo = (htmlString: string) => {
  const csrfTokenRegex = /var csrf_token = "([^"]+)"/;
  const csrfTokenMatch = htmlString?.match(csrfTokenRegex);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";
  return {
    _token: csrfToken,
  };
};
export default GetSessionInfo;
