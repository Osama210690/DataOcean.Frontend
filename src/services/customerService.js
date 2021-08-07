import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customer";

export async function getAllCustomer() {
  return await http.get(apiEndpoint);
}

export async function createCustomer(params) {
  return await http.post(apiEndpoint, params);
}

export async function updateCustomer(params) {
  return await http.put(apiEndpoint, params);
}

export async function deleteCustomer(id) {
  console.log(id);
  return await http.delete(apiEndpoint, { params: { customerCode: id } });
}

export default {
  getAllCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
