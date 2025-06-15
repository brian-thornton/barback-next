export const savePreferences = async (preferences: any) => {
  try {
    await fetch(`/api/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preferences }),
    });
  } catch (err) {
    console.log(err);
  }
};

export default savePreferences;