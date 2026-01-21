import { PhotoResponse } from '@/shared/api/models/photo';
import { Image } from '@mantine/core';
import { useEffect, useState } from 'react';

/**
 * PhotoDisplayProps interface.
 * 
 * This interface defines the props for the PhotoDisplay component.
 * 
 * @property {PhotoResponse | undefined} photoResponse - The response object containing photo data,
 * which may be undefined if no photo is available.
 */
interface PhotoDisplayProps {
    photoResponse: PhotoResponse | undefined;
}

/**
 * PhotoDisplay component.
 * 
 * This component renders a photo based on the provided photo response. If the photo data is available,
 * it displays the image; otherwise, it shows a message indicating that no photo is available. The component
 * processes the photo response to create a base64-encoded image source for rendering.
 * 
 * @param {PhotoDisplayProps} props - The component props.
 * @returns {JSX.Element} - The rendered PhotoDisplay component.
 */
const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photoResponse }) => {
    const [photoData, setPhotoData] = useState<string | null>(null); // State to hold the processed photo data

    useEffect(() => {
        // Effect to update photoData when photoResponse changes
        if (photoResponse && photoResponse.data) {
            // Construct the base64 image source
            setPhotoData(`data:${photoResponse.type};base64,${photoResponse.data}`);
        }
    }, [photoResponse]); // Dependency on photoResponse

    return (
        <div>
            {photoData ? (
                // Render the image if photoData is available
                <Image radius="md" src={photoData} alt={photoResponse.name} />
            ) : (
                // Render a fallback message if no photo data is available
                <p>No photo available</p>
            )}
        </div>
    );
};

export default PhotoDisplay;