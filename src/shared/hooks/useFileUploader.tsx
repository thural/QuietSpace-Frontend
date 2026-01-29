import { ChangeEvent, useState } from "react";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;

/**
 * Custom hook for handling file uploads.
 *
 * This hook manages the state of a file upload process including 
 * the selected file, upload status, and response from the upload 
 * callback function. It provides methods to handle file selection 
 * and initiate the upload.
 *
 * @param {FetchCallback} fetchCallback - A callback function that accepts a FormData object and returns a Promise.
 * @returns {{
 *     file: File | null,                             // The currently selected file.
 *     status: UploadStatus,                          // The status of the upload process.
 *     response: any,                                 // The response from the upload callback.
 *     handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void, // Handler for file input changes.
 *     handleFileUpload: () => Promise<void>         // Function to initiate the file upload.
 * }} - An object containing the file upload state and handler functions.
 */
export const useFileUploader = (fetchCallback: FetchCallback) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [response, setResponse] = useState<any>(null);

    /**
     * Handles changes in the file input.
     *
     * This function updates the state with the selected file 
     * when a user selects a file from the file input.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
     */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    }

    /**
     * Initiates the file upload process.
     *
     * This function creates a FormData object containing the selected 
     * file and calls the provided fetch callback to upload the file.
     * It updates the status based on the success or failure of the upload.
     *
     * @returns {Promise<void>} - A promise that resolves when the upload process completes.
     */
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

export default useFileUploader;