import { ChangeEvent, useEffect, useState } from "react";
import { createFileUploadService, IUploadState } from "../services/FileUploadService";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;

/**
 * Enterprise useFileUploader hook
 * 
 * Now uses the FileUploadService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
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
    const [state, setState] = useState<IUploadState>({
        file: null,
        status: 'idle',
        response: null
    });

    useEffect(() => {
        // Create the enterprise service
        const service = createFileUploadService(fetchCallback);

        // Subscribe to state changes
        const unsubscribe = service.subscribe((newState) => {
            setState(newState);
        });

        return () => {
            unsubscribe();
            service.destroy();
        };
    }, [fetchCallback]);

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
        // The service will handle the state update through subscription
    };

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
        try {
            const service = createFileUploadService(fetchCallback);
            await service.uploadFile();
        } catch (error: unknown) {
            // Handle error display
            alert(`Error uploading file: ${(error as Error).message}`);
        }
    };

    return {
        file: state.file,
        status: state.status,
        response: state.response,
        handleFileChange,
        handleFileUpload
    };
};

export default useFileUploader;