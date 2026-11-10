import { useContext } from "react";
import { AuthContext } from "../lib/authContext.js";

export function useAuth() {
  return useContext(AuthContext);
}
