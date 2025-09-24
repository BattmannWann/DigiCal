import AxiosInstance from "./AxiosInstance";

const deleteData = async(endpoint) =>{
    try {
        const response = await AxiosInstance.delete(endpoint);
        return response.data
    } catch(err){
        console.error("Error deleting data:", err);
        throw err;
    }
};

export default deleteData;