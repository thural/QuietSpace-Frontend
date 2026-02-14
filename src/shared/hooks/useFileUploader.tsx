import { useEffect, useState } from "react";
import { createFileUploadHookService } from "./FileUploadHookService";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;

/**
 * Enterprise useFileUploader hook
 * 
 * Now uses the FileUploadHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @param {FetchCallback} fetchCallback - A callback function that accepts a FormData object and returns a Promise.
 * @returns {{
 *     file: File | null,                             // The currently selected file.
 *     status: UploadStatus,                          // The status of the upload process.
 *     response: any,                                 // The response from the upload callback.
 *     handleFileChange: (e: any) => void, // Handler for file input changes.
 *     handleFileUpload: () => Promise<void>         // Function to initiate the file upload.
 * }} - An object containing the file upload state and handler functions.
 */
export const useFileUploader = (fetchCallback: FetchCallback) => {
    const [service, setService] = useState(() => createFileUploadHookService({ fetchCallback }));

    useEffect(() => {
        // Subscribe to upload state changes
        const unsubscribe = service.subscribe(() => {
            // State is managed internally by the service
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if fetchCallback changes
    useEffect(() => {
        const newService = createFileUploadHookService({ fetchCallback });
        setService(newService);

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [fetchCallback]);

    return service.getUploadUtilities();
};

export default useFileUploader;