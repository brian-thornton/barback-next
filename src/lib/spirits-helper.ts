import { Spirit } from "@/types/spirit-types";

export const saveSpirits = async (spirits: Spirit[]) => {
  try {
    await fetch(`/api/spirits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spirits }),
    });
  } catch (err) {
    console.log(err);
  }
};

export default saveSpirits;