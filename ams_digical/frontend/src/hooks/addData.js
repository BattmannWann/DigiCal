import AxiosInstance from "./AxiosInstance";

const addData = async(endpoint, data) =>{
    try {
        const response = await AxiosInstance.post(endpoint, data);
        console.log("data added successfully", response.data);
        return response.data
    } catch(err){
        console.error("Error adding data:", err);
        throw err;
    }
};

export default addData;