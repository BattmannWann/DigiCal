import AxiosInstance from "./AxiosInstance";

const updateData = async(endpoint, id, data) =>{
    try {
        const response = await AxiosInstance.put(`{endpoint}/${id}/`, data);
        console.log("data added successfully", response.data);
        return response.data
    } catch(err){
        console.error("Error updating data:", err);
        throw err;
    }
};

export default updateData;