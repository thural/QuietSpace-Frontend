import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from './useSessionTimeout';
import BoxStyled from '@/shared/BoxStyled';
import Typography from '@/shared/Typography';
import GradientButton from '@/shared/buttons/GradientButton';
import OutlineButton from '@/shared/buttons/OutlineButton';

/**
 * SessionTimeoutWarning component
 * 
 * Shows warning dialog when session is about to expire and allows user to extend session.
 */
export const SessionTimeoutWarning = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  const { resetTimer } = useSessionTimeout({
    timeoutMs: 30 * 60 * 1000, // 30 minutes
    warningMs: 5 * 60 * 1000,  // 5 minutes warning
    onWarning: (time) => {
      setTimeRemaining(time);
      setIsVisible(true);
    },
    onTimeout: () => {
      setIsVisible(false);
      navigate('/signin');
    }
  });

  /** Format time remaining in human readable format */
  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /** Extend session */
  const handleExtendSession = () => {
    resetTimer();
    setIsVisible(false);
  };

  /** Logout immediately */
  const handleLogout = () => {
    setIsVisible(false);
    navigate('/signout');
  };

  if (!isVisible) return null;

  return (
    <BoxStyled className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BoxStyled className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <Typography type="h3" className="text-xl font-semibold mb-4 text-center">
          Session Expiring Soon
        </Typography>
        
        <Typography size="md" className="text-gray-600 text-center mb-4">
          Your session will expire in <span className="font-bold text-red-500">{formatTimeRemaining(timeRemaining)}</span> due to inactivity.
        </Typography>
        
        <Typography size="sm" className="text-gray-500 text-center mb-6">
          Would you like to extend your session?
        </Typography>
        
        <div className="flex gap-3 justify-center">
          <GradientButton name="Extend Session" onClick={handleExtendSession} />
          <OutlineButton name="Logout Now" onClick={handleLogout} />
        </div>
      </BoxStyled>
    </BoxStyled>
  );
};

/**
 * SessionManager component for handling session timeout
 * 
 * Integrates session timeout monitoring with the application.
 */
export const SessionManager = ({ children }: { children: React.ReactNode }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  const { resetTimer } = useSessionTimeout({
    timeoutMs: 30 * 60 * 1000, // 30 minutes
    warningMs: 2 * 60 * 1000,  // 2 minutes warning
    onWarning: (time) => {
      setTimeRemaining(time);
      setShowWarning(true);
    },
    onTimeout: () => {
      setShowWarning(false);
      navigate('/signin');
    }
  });

  /** Handle session extension */
  const handleExtendSession = () => {
    resetTimer();
    setShowWarning(false);
  };

  /** Handle logout */
  const handleLogout = () => {
    setShowWarning(false);
    navigate('/signout');
  };

  return (
    <>
      {children}
      {showWarning && (
        <SessionTimeoutDialog
          timeRemaining={timeRemaining}
          onExtend={handleExtendSession}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

/**
 * Session timeout dialog component
 */
interface SessionTimeoutDialogProps {
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutDialog = ({ timeRemaining, onExtend, onLogout }: SessionTimeoutDialogProps) => {
  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
            Your session expires in <span className="font-bold text-red-500">{formatTimeRemaining(timeRemaining)}</span>
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
};

export default SessionTimeoutWarning;
