import React, { createContext, useContext, useEffect, useState } from "react";
import { createFileUploadHookService } from "./FileUploadHookService";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;

/**
 * FileUpload context for direct service integration
 */
const FileUploadContext = createContext<ReturnType<typeof createFileUploadHookService> | null>(null);

/**
 * FileUpload provider component that directly integrates with FileUploadHookService
 */
export const FileUploadProvider: React.FC<{ children: React.ReactNode; fetchCallback: FetchCallback }> = ({
    children,
    fetchCallback
}) => {
    const [service, setService] = useState(() => createFileUploadHookService({ fetchCallback }));

    useEffect(() => {
        // Subscribe to upload state changes
        const unsubscribe = service.subscribe(() => {
            // State is managed internally by service
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

    return (
        <FileUploadContext.Provider value={service}>
            {children}
        </FileUploadContext.Provider>
    );
};

/**
 * Enterprise useFileUploader hook with direct service integration
 * 
 * Optimized to use FileUploadHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @param {FetchCallback} fetchCallback - A callback function that accepts a FormData object and returns a Promise.
 * @returns {{
 *     file: File | null,                             // The currently selected file.
 *     status: UploadStatus,                          // The status of upload process.
 *     response: any,                                 // The response from upload callback.
 *     handleFileChange: (e: any) => void, // Handler for file input changes.
 *     handleFileUpload: () => Promise<void>         // Function to initiate the file upload.
 * }} - An object containing file upload state and handler functions.
 */
export const useFileUploader = (fetchCallback: FetchCallback) => {
    const service = useContext(FileUploadContext);

    if (!service) {
        throw new Error('useFileUploader must be used within FileUploadProvider');
    }

    return service.getUploadUtilities();
};

export default useFileUploader;