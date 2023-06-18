import axios from "axios";
import { apiAddress } from "../config/config";

export const uploadFiles = async (files) => {
    const formData = new FormData();
    formData.append("file", files);

    const response = await axios.post(apiAddress + "files/" , formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};