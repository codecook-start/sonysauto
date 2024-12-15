import axios from "axios";
import { useMutation } from "react-query";

const useUploadImage = () => {
  const uploadImage = async (data: FormData) => {
    const response = await axios.post("/api/upload-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };
  const mutation = useMutation(
    async (file: File) => {
      const data = new FormData();
      data.append("file", file);
      const response = await uploadImage(data);
      return response;
    },
    {
      onSuccess: (response) => {
        console.log(response);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );
  return {
    uploadImage: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export default useUploadImage;
