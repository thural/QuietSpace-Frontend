import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MFAService, 
  MFAConfig, 
  MFAEnrollment, 
  MFAVerification, 
  MFAChallenge, 
  MFAMethod,
  TOTPEnrollmentData,
  SMSEnrollmentData,
  BackupCodesEnrollmentData
} from '@core/auth/services/MFAService';

/**
 * React hook for Multi-Factor Authentication (MFA)
 * 
 * Provides comprehensive MFA functionality with:
 * - TOTP enrollment and verification
 * - SMS verification setup and validation
 * - Backup codes generation and management
 * - Biometric authentication support
 * - Security key (WebAuthn) integration
 * - Email verification fallback
 * - Challenge-based authentication flow
 */

export interface UseMFAOptions extends Partial<MFAConfig> {
  /** User ID for MFA operations */
  userId?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-cleanup on unmount */
  autoCleanup?: boolean;
}

export interface UseMFAReturn {
  // State
  isLoading: boolean;
  error: string | null;
  availableMethods: MFAMethod[];
  enrollments: MFAEnrollment[];
  currentChallenge: MFAChallenge | null;
  
  // TOTP
  totpEnrollment: TOTPEnrollmentData | null;
  isTOTPEnrolling: boolean;
  
  // SMS
  smsEnrollment: SMSEnrollmentData | null;
  isSMSEnrolling: boolean;
  
  // Backup Codes
  backupCodes: BackupCodesEnrollmentData | null;
  isGeneratingBackupCodes: boolean;
  
  // Actions
  enrollTOTP: () => Promise<TOTPEnrollmentData>;
  verifyTOTPEnrollment: (enrollmentId: string, code: string) => Promise<boolean>;
  enrollSMS: (phoneNumber: string, countryCode: string) => Promise<SMSEnrollmentData>;
  verifySMSEnrollment: (enrollmentId: string, code: string) => Promise<boolean>;
  generateBackupCodes: () => Promise<BackupCodesEnrollmentData>;
  verifyBackupCode: (code: string) => Promise<boolean>;
  
  // Challenge flow
  createChallenge: (requiredMethods?: string[]) => Promise<MFAChallenge>;
  verifyChallenge: (challengeId: string, method: string, code: string) => Promise<boolean>;
  
  // Management
  disableMFA: (enrollmentId: string) => Promise<boolean>;
  refreshMethods: () => Promise<void>;
  
  // Utilities
  getMethodStatus: (methodType: string) => 'not-enrolled' | 'pending' | 'active' | 'disabled';
  getEnrollmentProgress: () => number;
}

/**
 * Hook for MFA functionality
 */
export function useMFA(options: UseMFAOptions = {}): UseMFAReturn {
  const {
    userId,
    debug = false,
    autoCleanup = true,
    ...config
  } = options;

  const [mfaService] = useState(() => new MFAService(config));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<MFAMethod[]>([]);
  const [enrollments, setEnrollments] = useState<MFAEnrollment[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<MFAChallenge | null>(null);
  
  // TOTP state
  const [totpEnrollment, setTOTPEnrollment] = useState<TOTPEnrollmentData | null>(null);
  const [isTOTPEnrolling, setIsTOTPEnrolling] = useState(false);
  
  // SMS state
  const [smsEnrollment, setSMSEnrollment] = useState<SMSEnrollmentData | null>(null);
  const [isSMSEnrolling, setIsSMSEnrolling] = useState(false);
  
  // Backup codes state
  const [backupCodes, setBackupCodes] = useState<BackupCodesEnrollmentData | null>(null);
  const [isGeneratingBackupCodes, setIsGeneratingBackupCodes] = useState(false);

  const serviceRef = useRef(mfaService);
  const userIdRef = useRef(userId);

  // Debug logging function
  const debugLog = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[MFA] ${message}`, data);
    }
  }, [debug]);

  // Initialize and load user data
  useEffect(() => {
    if (!userId) return;

    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const methods = await serviceRef.current.getAvailableMethods(userId);
        const userEnrollments = serviceRef.current.getUserEnrollments(userId);

        setAvailableMethods(methods);
        setEnrollments(userEnrollments);

        debugLog('User data loaded', { methods: methods.length, enrollments: userEnrollments.length });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load MFA data';
        setError(errorMessage);
        debugLog('Failed to load user data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, debugLog]);

  // Update refs when dependencies change
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // TOTP enrollment
  const enrollTOTP = useCallback(async (): Promise<TOTPEnrollmentData> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for TOTP enrollment');
    }

    try {
      setIsTOTPEnrolling(true);
      setError(null);

      const enrollment = await serviceRef.current.enrollTOTP(userIdRef.current);
      setTOTPEnrollment(enrollment);

      // Refresh enrollments
      const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
      setEnrollments(userEnrollments);

      debugLog('TOTP enrollment created', { enrollmentId: enrollment.secret.substring(0, 8) + '...' });
      return enrollment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in TOTP';
      setError(errorMessage);
      debugLog('TOTP enrollment failed', err);
      throw err;
    } finally {
      setIsTOTPEnrolling(false);
    }
  }, [debugLog]);

  // TOTP enrollment verification
  const verifyTOTPEnrollment = useCallback(async (enrollmentId: string, code: string): Promise<boolean> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for TOTP verification');
    }

    try {
      setError(null);

      const isValid = await serviceRef.current.verifyTOTPEnrollment(userIdRef.current, enrollmentId, code);

      if (isValid) {
        setTOTPEnrollment(null);
        // Refresh enrollments
        const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
        setEnrollments(userEnrollments);
      }

      debugLog('TOTP verification', { enrollmentId, success: isValid });
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify TOTP enrollment';
      setError(errorMessage);
      debugLog('TOTP verification failed', err);
      throw err;
    }
  }, [debugLog]);

  // SMS enrollment
  const enrollSMS = useCallback(async (phoneNumber: string, countryCode: string): Promise<SMSEnrollmentData> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for SMS enrollment');
    }

    try {
      setIsSMSEnrolling(true);
      setError(null);

      const enrollment = await serviceRef.current.enrollSMS(userIdRef.current, phoneNumber, countryCode);
      setSMSEnrollment(enrollment);

      // Refresh enrollments
      const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
      setEnrollments(userEnrollments);

      debugLog('SMS enrollment created', { phoneNumber: enrollment.phoneNumber });
      return enrollment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in SMS';
      setError(errorMessage);
      debugLog('SMS enrollment failed', err);
      throw err;
    } finally {
      setIsSMSEnrolling(false);
    }
  }, [debugLog]);

  // SMS enrollment verification
  const verifySMSEnrollment = useCallback(async (enrollmentId: string, code: string): Promise<boolean> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for SMS verification');
    }

    try {
      setError(null);

      const isValid = await serviceRef.current.verifySMSEnrollment(userIdRef.current, enrollmentId, code);

      if (isValid) {
        setSMSEnrollment(null);
        // Refresh enrollments
        const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
        setEnrollments(userEnrollments);
      }

      debugLog('SMS verification', { enrollmentId, success: isValid });
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify SMS enrollment';
      setError(errorMessage);
      debugLog('SMS verification failed', err);
      throw err;
    }
  }, [debugLog]);

  // Generate backup codes
  const generateBackupCodes = useCallback(async (): Promise<BackupCodesEnrollmentData> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for backup codes generation');
    }

    try {
      setIsGeneratingBackupCodes(true);
      setError(null);

      const codes = await serviceRef.current.generateBackupCodes(userIdRef.current);
      setBackupCodes(codes);

      // Refresh enrollments
      const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
      setEnrollments(userEnrollments);

      debugLog('Backup codes generated', { count: codes.codes.length });
      return codes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate backup codes';
      setError(errorMessage);
      debugLog('Backup codes generation failed', err);
      throw err;
    } finally {
      setIsGeneratingBackupCodes(false);
    }
  }, [debugLog]);

  // Verify backup code
  const verifyBackupCode = useCallback(async (code: string): Promise<boolean> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for backup code verification');
    }

    try {
      setError(null);

      const isValid = await serviceRef.current.verifyBackupCode(userIdRef.current, code);

      debugLog('Backup code verification', { success: isValid });
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify backup code';
      setError(errorMessage);
      debugLog('Backup code verification failed', err);
      throw err;
    }
  }, [debugLog]);

  // Create MFA challenge
  const createChallenge = useCallback(async (requiredMethods?: string[]): Promise<MFAChallenge> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for challenge creation');
    }

    try {
      setError(null);

      const challenge = await serviceRef.current.createChallenge(userIdRef.current, requiredMethods);
      setCurrentChallenge(challenge);

      debugLog('Challenge created', { challengeId: challenge.id, requiredMethods: challenge.requiredMethods.map(m => m.type) });
      return challenge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create MFA challenge';
      setError(errorMessage);
      debugLog('Challenge creation failed', err);
      throw err;
    }
  }, [debugLog]);

  // Verify MFA challenge
  const verifyChallenge = useCallback(async (challengeId: string, method: string, code: string): Promise<boolean> => {
    try {
      setError(null);

      const isValid = await serviceRef.current.verifyChallenge(challengeId, method, code);

      if (isValid && currentChallenge?.id === challengeId) {
        // Update current challenge
        const updatedChallenge = await serviceRef.current.createChallenge(userIdRef.current!);
        setCurrentChallenge(updatedChallenge);
      }

      debugLog('Challenge verification', { challengeId, method, success: isValid });
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify MFA challenge';
      setError(errorMessage);
      debugLog('Challenge verification failed', err);
      throw err;
    }
  }, [currentChallenge, debugLog]);

  // Disable MFA method
  const disableMFA = useCallback(async (enrollmentId: string): Promise<boolean> => {
    if (!userIdRef.current) {
      throw new Error('User ID is required for MFA disabling');
    }

    try {
      setError(null);

      const success = await serviceRef.current.disableMFA(userIdRef.current, enrollmentId);

      if (success) {
        // Refresh enrollments
        const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);
        setEnrollments(userEnrollments);

        // Refresh available methods
        const methods = await serviceRef.current.getAvailableMethods(userIdRef.current);
        setAvailableMethods(methods);
      }

      debugLog('MFA method disabled', { enrollmentId, success });
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable MFA method';
      setError(errorMessage);
      debugLog('MFA disabling failed', err);
      throw err;
    }
  }, [debugLog]);

  // Refresh methods and enrollments
  const refreshMethods = useCallback(async () => {
    if (!userIdRef.current) return;

    try {
      setError(null);

      const methods = await serviceRef.current.getAvailableMethods(userIdRef.current);
      const userEnrollments = serviceRef.current.getUserEnrollments(userIdRef.current);

      setAvailableMethods(methods);
      setEnrollments(userEnrollments);

      debugLog('Methods refreshed', { methods: methods.length, enrollments: userEnrollments.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh MFA methods';
      setError(errorMessage);
      debugLog('Methods refresh failed', err);
    }
  }, [debugLog]);

  // Get method status
  const getMethodStatus = useCallback((methodType: string): 'not-enrolled' | 'pending' | 'active' | 'disabled' => {
    const enrollment = enrollments.find(e => e.method.type === methodType);
    
    if (!enrollment) return 'not-enrolled';
    return enrollment.status;
  }, [enrollments]);

  // Get enrollment progress
  const getEnrollmentProgress = useCallback((): number => {
    const totalMethods = availableMethods.length;
    const activeMethods = enrollments.filter(e => e.status === 'active').length;
    
    return totalMethods > 0 ? (activeMethods / totalMethods) * 100 : 0;
  }, [availableMethods, enrollments]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCleanup) {
        debugLog('Cleaning up MFA hook');
      }
    };
  }, [autoCleanup, debugLog]);

  return {
    // State
    isLoading,
    error,
    availableMethods,
    enrollments,
    currentChallenge,
    
    // TOTP
    totpEnrollment,
    isTOTPEnrolling,
    
    // SMS
    smsEnrollment,
    isSMSEnrolling,
    
    // Backup Codes
    backupCodes,
    isGeneratingBackupCodes,
    
    // Actions
    enrollTOTP,
    verifyTOTPEnrollment,
    enrollSMS,
    verifySMSEnrollment,
    generateBackupCodes,
    verifyBackupCode,
    
    // Challenge flow
    createChallenge,
    verifyChallenge,
    
    // Management
    disableMFA,
    refreshMethods,
    
    // Utilities
    getMethodStatus,
    getEnrollmentProgress
  };
}

/**
 * Hook for MFA enrollment flow
 */
export function useMFAEnrollment(userId: string, options: UseMFAOptions = {}) {
  const mfa = useMFA({ ...options, userId });
  const [currentStep, setCurrentStep] = useState<'method-selection' | 'setup' | 'verification' | 'complete'>('method-selection');
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod | null>(null);

  const selectMethod = useCallback((method: MFAMethod) => {
    setSelectedMethod(method);
    setCurrentStep('setup');
  }, []);

  const completeEnrollment = useCallback(() => {
    setCurrentStep('complete');
    setSelectedMethod(null);
  }, []);

  const resetEnrollment = useCallback(() => {
    setCurrentStep('method-selection');
    setSelectedMethod(null);
  }, []);

  return {
    ...mfa,
    currentStep,
    selectedMethod,
    selectMethod,
    completeEnrollment,
    resetEnrollment
  };
}

/**
 * Hook for MFA verification flow
 */
export function useMFAVerification(userId: string, options: UseMFAOptions = {}) {
  const mfa = useMFA({ ...options, userId });
  const [currentMethod, setCurrentMethod] = useState<MFAMethod | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const startVerification = useCallback((method: MFAMethod) => {
    setCurrentMethod(method);
    setIsVerifying(true);
    setVerificationAttempts(0);
  }, []);

  const completeVerification = useCallback(() => {
    setCurrentMethod(null);
    setIsVerifying(false);
    setVerificationAttempts(0);
  }, []);

  const attemptVerification = useCallback(async (code: string) => {
    if (!currentMethod || !mfa.currentChallenge) return false;

    try {
      setVerificationAttempts(prev => prev + 1);
      
      const success = await mfa.verifyChallenge(mfa.currentChallenge.id, currentMethod.type, code);
      
      if (success) {
        completeVerification();
      }
      
      return success;
    } catch (err) {
      return false;
    }
  }, [currentMethod, mfa, completeVerification]);

  return {
    ...mfa,
    currentMethod,
    isVerifying,
    verificationAttempts,
    startVerification,
    completeVerification,
    attemptVerification
  };
}

/**
 * Hook for MFA analytics and monitoring
 */
export function useMFAAnalytics(userId: string, options: UseMFAOptions = {}) {
  const mfa = useMFA({ ...options, userId });
  const [analytics, setAnalytics] = useState({
    enrollmentRate: 0,
    verificationSuccessRate: 0,
    methodUsage: {} as Record<string, number>,
    securityScore: 0
  });

  // Calculate analytics
  useEffect(() => {
    const totalMethods = mfa.availableMethods.length;
    const activeMethods = mfa.enrollments.filter(e => e.status === 'active').length;
    
    const enrollmentRate = totalMethods > 0 ? (activeMethods / totalMethods) * 100 : 0;
    
    const methodUsage: Record<string, number> = {};
    mfa.enrollments.forEach(enrollment => {
      methodUsage[enrollment.method.type] = enrollment.metadata.usageCount;
    });

    // Calculate security score based on enrolled methods
    const securityScore = calculateSecurityScore(mfa.enrollments);

    setAnalytics({
      enrollmentRate,
      verificationSuccessRate: 95, // This would come from actual verification data
      methodUsage,
      securityScore
    });
  }, [mfa.availableMethods, mfa.enrollments]);

  return {
    ...mfa,
    analytics
  };
}

/**
 * Calculate security score based on enrolled MFA methods
 */
function calculateSecurityScore(enrollments: MFAEnrollment[]): number {
  let score = 0;
  const activeEnrollments = enrollments.filter(e => e.status === 'active');

  // Base score for having any MFA
  if (activeEnrollments.length > 0) {
    score += 40;
  }

  // Additional points for each method
  activeEnrollments.forEach(enrollment => {
    switch (enrollment.method.type) {
      case 'totp':
        score += 20;
        break;
      case 'sms':
        score += 15;
        break;
      case 'biometric':
        score += 25;
        break;
      case 'security-key':
        score += 30;
        break;
      case 'backup-codes':
        score += 10;
        break;
      case 'email':
        score += 10;
        break;
    }
  });

  // Bonus for multiple methods
  if (activeEnrollments.length >= 2) {
    score += 10;
  }

  return Math.min(score, 100);
}
