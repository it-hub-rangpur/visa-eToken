export const getLoginUserInfo = async (accessToken: string) => {
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await userResponse.json();

  return data;
};
