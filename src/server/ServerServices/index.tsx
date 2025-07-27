export const getById = async (id: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/get-process/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 0 },
    }
  );
  const response = await data.json();
  return response?.data;
};
