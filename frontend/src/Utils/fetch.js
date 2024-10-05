const api = "http://127.0.0.1:8000";

export const getRequest = async (route) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Contentet-Type": "application/json",
    },
  };

  const response = await fetch(`${api}/${route}`, requestOptions);
  const data = await response.json();

  // console.log(data);
  return data;
};
