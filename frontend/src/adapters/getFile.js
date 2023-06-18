import axios from "axios";
import { apiAddress } from "../config/config";

export const getFile = async (id) => {
    const response = await axios.get(apiAddress + "files/" + id);
    return response.data;
}