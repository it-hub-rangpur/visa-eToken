"use client";

export const getApplicationState = (id: string) => {
  const state = localStorage?.getItem(id);

  return state ? JSON.parse(state) : {};
};
