/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';
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
export class PhotoDisplay extends BaseClassComponent<IPhotoDisplayProps, IPhotoDisplayState> {
  protected override getInitialState(): Partial<IPhotoDisplayState> {
    return {
      photoData: null
    };
  }

  protected override componentDidMount(): void {
    this.processPhotoData();
  }

  protected override componentDidUpdate(prevProps: IPhotoDisplayProps): void {
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
      this.safeSetState({ photoData });
    } else {
      this.safeSetState({ photoData: null });
    }
  };

  protected override renderContent(): ReactNode {
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
