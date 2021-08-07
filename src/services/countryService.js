import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/country";

export async function getAllCountries() {
  return await http.get(apiEndpoint);
}

export async function createCountry(params) {
  return await http.post(apiEndpoint, params);
}

export async function updateCountry(params) {
  return await http.put(apiEndpoint, params);
}

export async function deleteCountry(id) {
  return await http.delete(apiEndpoint, { params: { countryCode: id } });
}

export default {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
