import { ChangeEvent, useState } from "react";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;
export const useFileUploader = (fetchCallback: FetchCallback) => {

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [response, setResponse] = useState<any>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    }

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await fetchCallback(formData);
            setResponse(result);
            setStatus('success');
        } catch (e: unknown) {
            setStatus('error');
            alert(`Error uploading file: ${(e as Error).message}`);
        }
    }

    return {
        file,
        status,
        response,
        handleFileChange,
        handleFileUpload
    };
};

export default useFileUploader
