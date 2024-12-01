import { PhotoResponse } from '@/api/schemas/inferred/photo';
import { Image } from '@mantine/core';
import { useEffect, useState } from 'react';

interface PhotoDisplayProps {
    photoResponse: PhotoResponse | undefined;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photoResponse }) => {
    const [photoData, setPhotoData] = useState<string | null>(null);

    useEffect(() => {
        if (photoResponse && photoResponse.data) {
            setPhotoData(`data:${photoResponse.type};base64,${photoResponse.data}`);
        }
    }, [photoResponse]);

    return (
        <div>
            {photoData ? (
                <Image radius="md" src={photoData} alt={photoResponse.name} />
            ) : (
                <p>No photo available</p>
            )}
        </div>
    );
};

export default PhotoDisplay;
