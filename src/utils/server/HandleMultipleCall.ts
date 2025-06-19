const HandleMultipleCall = async () => {
  try {
    const response = await fetch("https://payment.ivacbd.com");
    const status = response.status;
    const statusText = response.statusText;
    console.log({ status, statusText });
    return response;
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};

export default HandleMultipleCall;
