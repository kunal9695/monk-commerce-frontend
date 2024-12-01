import axios from "axios";

const API_URL = "http://stageapi.monkcommerce.app/task/products/search";
const API_KEY = "your_api_key_here"; 

export const fetchProducts = async (search = "", page = 1, limit = 10) => {
  const response = await axios.get(API_URL, {
    params: { search, page, limit },
    headers: {
      "Authorization": `Bearer ${API_KEY}`, 
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
