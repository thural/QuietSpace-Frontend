import { PhotoResponse } from '@/shared/api/models/photo';
import { Image } from '@/shared/ui/components';
import React, { PureComponent, ReactNode } from 'react';

/**
 * PhotoDisplayProps interface.
 * 
 * This interface defines the props for the PhotoDisplay component.
 * 
 * @property {PhotoResponse | undefined} photoResponse - The response object containing photo data,
 * which may be undefined if no photo is available.
 */
interface IPhotoDisplayProps {
    photoResponse: PhotoResponse | undefined;
}

interface IPhotoDisplayState {
    photoData: string | null;
}

/**
 * PhotoDisplay component.
 * 
 * This component renders a photo based on the provided photo response. If the photo data is available,
 * it displays the image; otherwise, it shows a message indicating that no photo is available. The component
 * processes the photo response to create a base64-encoded image source for rendering.
 * 
 * @param {IPhotoDisplayProps} props - The component props.
 * @returns {JSX.Element} - The rendered PhotoDisplay component.
 */
class PhotoDisplay extends PureComponent<IPhotoDisplayProps, IPhotoDisplayState> {
    constructor(props: IPhotoDisplayProps) {
        super(props);

        this.state = {
            photoData: null
        };
    }

    override componentDidMount(): void {
        this.processPhotoData();
    }

    override componentDidUpdate(prevProps: IPhotoDisplayProps): void {
        const { photoResponse } = this.props;
        const { photoResponse: prevPhotoResponse } = prevProps;

        if (photoResponse !== prevPhotoResponse) {
            this.processPhotoData();
        }
    }

    /**
     * Process photo data to create base64 image source
     */
    private processPhotoData = (): void => {
        const { photoResponse } = this.props;

        if (photoResponse && photoResponse.data) {
            // Construct the base64 image source
            const photoData = `data:${photoResponse.type};base64,${photoResponse.data}`;
            this.setState({ photoData });
        } else {
            this.setState({ photoData: null });
        }
    };

    override render(): ReactNode {
        const { photoResponse } = this.props;
        const { photoData } = this.state;

        return (
            <div>
                {photoData ? (
                    // Render the image if photoData is available
                    <Image radius="md" src={photoData} alt={photoResponse?.name || 'Photo'} />
                ) : (
                    // Render a fallback message if no photo data is available
                    <p>No photo available</p>
                )}
            </div>
        );
    }
}

export default PhotoDisplay;
export type { IPhotoDisplayProps };