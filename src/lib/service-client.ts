export const getData = async (endpoint: string) => {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const postData = async (endpoint: string, body: any) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.log(err);
  }
};

export default getData;