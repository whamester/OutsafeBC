import { 
  API_GEOAPIFY_KEY,
  API_GEOAPIFY_URL
} from "../../constants.js";

const geocode = async (params, type) => {
  let url = API_GEOAPIFY_URL;

  if (type === "autocomplete") {
    const encodedSearchTerm = encodeURIComponent(params?.searchTerm);
    url += `autocomplete?text=${ encodedSearchTerm }&apiKey=${ API_GEOAPIFY_KEY }`;
  } else if (type === "geocode") {
    const text = encodeURIComponent(params?.text);
    url += `search?text=${ text }&apiKey=${ API_GEOAPIFY_KEY }`;
  } else if (type === "reverse-geocode") {
    url += `reverse?lat=${ params?.lat }&lon=${ params?.lng }&apiKey=${ API_GEOAPIFY_KEY }`;
  }

  try {
    const res = await fetch(url);
    let resJson = {};

    if (res.ok) {
      resJson = await res.json();
    } else {
      const statusCode = res.status;
      const errorMessage = await res.text();
      console.log(`Func: geocode, Status: ${ statusCode }, Error: ${ errorMessage }`);
      return;
    }
    
    return resJson?.features ?? [];
  } catch (error) {
    console.log(`Func: geocode, Type: ${ type }, Error: ${ error.message }`);
    return [];
  }
};

export default geocode;
