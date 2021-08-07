import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/cities";

export async function getAllCities() {
  return await http.get(apiEndpoint);
}

export async function createCity(params) {
  return await http.post(apiEndpoint, params);
}

export async function updateCity(params) {
  return await http.put(apiEndpoint, params);
}

export async function deleteCity(id) {
  return await http.delete(apiEndpoint, { params: { cityCode: id } });
}

export default {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
};
