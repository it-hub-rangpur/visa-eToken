import db from "@/db/index.json";

export const getById = async (id: string) => {
  const data = db.find((item) => item._id === id);
  return data;
};
