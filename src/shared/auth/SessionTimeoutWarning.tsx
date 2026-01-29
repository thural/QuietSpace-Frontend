import { Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from './useSessionTimeout';
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { CenterContainer } from '@/shared/ui/components/layout/CenterContainer';
import Typography from '@/shared/ui/components/utility/Typography';
import GradientButton from '@/shared/ui/buttons/GradientButton';
import OutlineButton from '@/shared/ui/buttons/OutlineButton';

// Define strict TypeScript interfaces
interface ISessionTimeoutWarningProps { }

interface ISessionTimeoutWarningState {
  isVisible: boolean;
  timeRemaining: number;
}

/**
 * SessionTimeoutWarning component
 * 
 * Shows warning dialog when session is about to expire and allows user to extend session.
 */
export class SessionTimeoutWarning extends Component<ISessionTimeoutWarningProps, ISessionTimeoutWarningState> {
  // Use private properties for services
  private navigate: ReturnType<typeof useNavigate>;
  private resetTimer: () => void;

  // Constructor with method binding
  constructor(props: ISessionTimeoutWarningProps) {
    super(props);

    // Initialize state properly
    this.state = {
      isVisible: false,
      timeRemaining: 0
    };

    // Initialize navigation
    this.navigate = useNavigate();

    // Initialize session timeout hook
    const { resetTimer } = useSessionTimeout({
      timeoutMs: 30 * 60 * 1000, // 30 minutes
      warningMs: 5 * 60 * 1000,  // 5 minutes warning
      onWarning: (time) => {
        this.setState({
          timeRemaining: time,
          isVisible: true
        });
      },
      onTimeout: () => {
        this.setState({ isVisible: false });
        this.navigate('/signin');
      }
    });

    this.resetTimer = resetTimer;
  }

  // Extract complex logic into private methods
  private formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Extract event handlers
  private handleExtendSession = (): void => {
    this.resetTimer();
    this.setState({ isVisible: false });
  };

  private handleLogout = (): void => {
    this.setState({ isVisible: false });
    this.navigate('/signout');
  };

  // Extract render helpers for clean JSX
  private renderContent = (): ReactNode => {
    const { timeRemaining } = this.state;

    return (
      <Container className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <Typography type="h3" className="text-xl font-semibold mb-4 text-center">
          Session Expiring Soon
        </Typography>
        <Typography className="text-gray-600 mb-6 text-center">
          Your session will expire in {this.formatTimeRemaining(timeRemaining)}. Would you like to extend your session?
        </Typography>
        <FlexContainer className="space-x-4 justify-center">
          <GradientButton name="Extend Session" onClick={this.handleExtendSession} />
          <OutlineButton name="Logout Now" onClick={this.handleLogout} />
        </FlexContainer>
      </Container>
    );
  };

  // Keep render method clean and focused
  render(): ReactNode {
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <CenterContainer className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {this.renderContent()}
      </CenterContainer>
    );
  }
}

/**
 * SessionManager component for handling session timeout
 * 
 * Integrates session timeout monitoring with the application.
 */
interface ISessionManagerProps {
  children: React.ReactNode;
}

interface ISessionManagerState {
  showWarning: boolean;
  timeRemaining: number;
}

export class SessionManager extends Component<ISessionManagerProps, ISessionManagerState> {
  // Use private properties for services
  private navigate: ReturnType<typeof useNavigate>;
  private resetTimer: () => void;

  // Constructor with method binding
  constructor(props: ISessionManagerProps) {
    super(props);

    // Initialize state properly
    this.state = {
      showWarning: false,
      timeRemaining: 0
    };

    // Initialize navigation
    this.navigate = useNavigate();

    // Initialize session timeout hook
    const { resetTimer } = useSessionTimeout({
      timeoutMs: 30 * 60 * 1000, // 30 minutes
      warningMs: 2 * 60 * 1000,  // 2 minutes warning
      onWarning: (time) => {
        this.setState({
          timeRemaining: time,
          showWarning: true
        });
      },
      onTimeout: () => {
        this.setState({ showWarning: false });
        this.navigate('/signin');
      }
    });

    this.resetTimer = resetTimer;
  }

  // Extract event handlers
  private handleExtendSession = (): void => {
    this.resetTimer();
    this.setState({ showWarning: false });
  };

  private handleLogout = (): void => {
    this.setState({ showWarning: false });
    this.navigate('/signout');
  };

  // Extract render helpers
  private renderWarningDialog = (): ReactNode => {
    const { timeRemaining } = this.state;

    return (
      <SessionTimeoutDialog
        timeRemaining={timeRemaining}
        onExtend={this.handleExtendSession}
        onLogout={this.handleLogout}
      />
    );
  };

  // Keep render method clean and focused
  render(): ReactNode {
    const { children } = this.props;
    const { showWarning } = this.state;

    return (
      <>
        {children}
        {showWarning && this.renderWarningDialog()}
      </>
    );
  }
}

/**
 * Session timeout dialog component
 */
interface ISessionTimeoutDialogProps {
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

class SessionTimeoutDialog extends Component<ISessionTimeoutDialogProps> {
  // Extract complex logic into private methods
  private formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keep render method clean and focused
  render(): ReactNode {
    const { timeRemaining, onExtend, onLogout } = this.props;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Session Timeout Warning
            </h3>

            <p className="text-gray-600 mb-6">
              Your session expires in <span className="font-bold text-red-500">{this.formatTimeRemaining(timeRemaining)}</span>
            </p>

            <div className="space-y-3">
              <button
                onClick={onExtend}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Extend Session
              </button>

              <button
                onClick={onLogout}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SessionTimeoutWarning;
