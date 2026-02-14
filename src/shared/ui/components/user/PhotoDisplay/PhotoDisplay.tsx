/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IPhotoDisplayProps, IPhotoDisplayState, IPhotoResponse } from './interfaces';
import {
  photoDisplayContainerStyles,
  photoDisplayImageContainerStyles,
  photoDisplayImageStyles,
  photoDisplayNoPhotoStyles,
  photoDisplayLoadingStyles,
  photoDisplayResponsiveStyles,
  photoDisplayKeyframes
} from './styles';

/**
 * PhotoDisplay Component
 * 
 * Enterprise-grade photo display component with comprehensive theme integration,
 * base64 encoding, loading states, and responsive design.
 */
export class PhotoDisplay extends PureComponent<IPhotoDisplayProps, IPhotoDisplayState> {
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
    const { photoResponse, className, testId, id, onClick, style } = this.props;
    const { photoData } = this.state;
    const theme = useTheme();
    const hasPhoto = !!photoData;

    return (
      <div
        css={[
          photoDisplayContainerStyles(theme),
          photoDisplayResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {hasPhoto ? (
          <div css={photoDisplayImageContainerStyles(theme)}>
            <img 
              src={photoData} 
              alt={photoResponse?.name || 'Photo'}
              css={photoDisplayImageStyles(theme)}
            />
          </div>
        ) : (
          <div css={photoDisplayNoPhotoStyles(theme)}>
            No photo available
          </div>
        )}
      </div>
    );
  }
}

export default PhotoDisplay;
