import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";
import { getJwt } from "./authService";

const apiEndpoint = apiUrl + "/dbcontainer";

// http.setJwt(getJwt());

export async function loadStoredProcedures() {
  return await http.get(apiEndpoint + "/allSpConfig");
}

export async function executeStoredProcedure(dbConfigId, spConfigId) {
  const headers = {
    "content-type": "application/json",
    "x-auth-token": getJwt(),
    "x-db-id": dbConfigId,
    "x-sp-id": spConfigId,
  };

  return await http.post(
    apiEndpoint + "/executeSproc",
    {
      dbConfigId,
      spConfigId,
    },
    { headers: headers }
  );
}

export default {
  loadStoredProcedures,
  executeStoredProcedure,
};
