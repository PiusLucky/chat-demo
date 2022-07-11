export async function postData(url = "", data = {}, headers = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getData(url = "", headers = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function patchData(url = "", headers = {}) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers,
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
