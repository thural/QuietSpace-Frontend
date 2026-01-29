/**
 * Live Collaboration Manager
 * 
 * This component provides real-time collaboration features including collaborative
 * editing, cursors, selections, and multi-user synchronization.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FiUsers, FiEdit3, FiEye, FiLock, FiUnlock, FiShare2, FiMessageSquare } from 'react-icons/fi';
import { useAdvancedWebSocket } from './AdvancedWebSocketManager';
import { useRealTimePresence } from './RealTimePresenceManager';

export interface CollaborationEvent {
    id: string;
    type: 'cursor' | 'selection' | 'edit' | 'presence' | 'lock' | 'unlock' | 'share' | 'comment';
    userId: string;
    chatId: string;
    timestamp: number;
    payload: any;
    metadata?: Record<string, any>;
}

export interface UserCursor {
    userId: string;
    position: {
        x: number;
        y: number;
        line?: number;
        column?: number;
    };
    visible: boolean;
    color: string;
    timestamp: number;
}

export interface UserSelection {
    userId: string;
    range: {
        start: { line: number; column: number };
        end: { line: number; column: number };
        text: string;
    };
    visible: boolean;
    color: string;
    timestamp: number;
}

export interface EditOperation {
    id: string;
    userId: string;
    type: 'insert' | 'delete' | 'replace';
    position: {
        line: number;
        column: number;
    };
    content: string;
    previousContent?: string;
    timestamp: number;
    applied: boolean;
}

export interface DocumentLock {
    userId: string;
    documentId: string;
    sectionId?: string;
    lockedAt: Date;
    expiresAt?: Date;
    reason?: string;
    isLocked: boolean;
}

export interface CollaborationSession {
    id: string;
    chatId: string;
    documentId: string;
    participants: string[];
    owner: string;
    createdAt: Date;
    lastActivity: Date;
    isActive: boolean;
    permissions: {
        canEdit: string[];
        canComment: string[];
        canShare: string[];
        canLock: string[];
    };
}

export interface CollaborationConfig {
    enableRealTimeCursors: boolean;
    enableRealTimeSelections: boolean;
    enableRealTimeEditing: boolean;
    enableDocumentLocking: boolean;
    enableCollaborativeComments: boolean;
    cursorUpdateInterval: number;
    selectionUpdateInterval: number;
    editHistorySize: number;
    lockTimeout: number;
    enableConflictResolution: boolean;
    enableVersionControl: boolean;
}

interface CollaborationContextType {
    sessions: Map<string, CollaborationSession>;
    cursors: Map<string, UserCursor>;
    selections: Map<string, UserSelection>;
    edits: EditOperation[];
    locks: Map<string, DocumentLock>;
    config: CollaborationConfig;
    currentSession: CollaborationSession | null;
    createSession: (chatId: string, documentId: string) => CollaborationSession;
    joinSession: (sessionId: string) => void;
    leaveSession: (sessionId: string) => void;
    updateCursor: (position: { x: number; y: number; line?: number; column?: number }) => void;
    updateSelection: (selection: { start: { line: number; column: number }; end: { line: number; column: number } }) => void;
    applyEdit: (edit: Omit<EditOperation, 'applied'>) => void;
    lockDocument: (sectionId?: string, reason?: string) => void;
    unlockDocument: (sectionId?: string) => void;
    isDocumentLocked: (sectionId?: string) => boolean;
    getDocumentLock: (sectionId?: string) => DocumentLock | null;
    shareSession: (userIds: string[]) => void;
    addComment: (comment: any) => void;
    updateConfig: (config: Partial<CollaborationConfig>) => void;
    getActiveUsers: (sessionId: string) => string[];
    getEditHistory: (sessionId: string) => EditOperation[];
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

// Collaboration Provider
interface CollaborationProviderProps {
    children: ReactNode;
    userId: string;
    config?: Partial<CollaborationConfig>;
}

export const LiveCollaborationProvider: React.FC<CollaborationProviderProps> = ({ 
    children, 
    userId,
    config: userConfig = {} 
}) => {
    const [sessions, setSessions] = useState<Map<string, CollaborationSession>>(new Map());
    const [cursors, setCursors] = useState<Map<string, UserCursor>>(new Map());
    const [selections, setSelections] = useState<Map<string, UserSelection>>(new Map());
    const [edits, setEdits] = useState<EditOperation[]>([]);
    const [locks, setLocks] = useState<Map<string, DocumentLock>>(new Map());
    const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null);

    const [config, setConfig] = useState<CollaborationConfig>({
        enableRealTimeCursors: true,
        enableRealTimeSelections: true,
        enableRealTimeEditing: true,
        enableDocumentLocking: true,
        enableCollaborativeComments: true,
        cursorUpdateInterval: 100,
        selectionUpdateInterval: 200,
        editHistorySize: 100,
        lockTimeout: 300000, // 5 minutes
        enableConflictResolution: true,
        enableVersionControl: true,
        ...userConfig
    });

    const { send, on, off } = useAdvancedWebSocket();
    const { getUserPresence } = useRealTimePresence();
    const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get user color
    const getUserColor = useCallback((userId: string): string => {
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
        ];
        
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    }, []);

    // Create collaboration session
    const createSession = useCallback((chatId: string, documentId: string): CollaborationSession => {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const session: CollaborationSession = {
            id: sessionId,
            chatId,
            documentId,
            participants: [userId],
            owner: userId,
            createdAt: new Date(),
            lastActivity: new Date(),
            isActive: true,
            permissions: {
                canEdit: [userId],
                canComment: [userId],
                canShare: [userId],
                canLock: [userId]
            }
        };

        setSessions(prev => new Map(prev).set(sessionId, session));
        setCurrentSession(session);

        // Broadcast session creation
        send({
            id: `session-created-${sessionId}`,
            type: 'session_created',
            payload: {
                sessionId,
                chatId,
                documentId,
                participants: session.participants,
                owner: session.owner,
                createdAt: session.createdAt
            },
            timestamp: Date.now(),
            sender: userId
        });

        return session;
    }, [userId, send]);

    // Join collaboration session
    const joinSession = useCallback((sessionId: string) => {
        const session = sessions.get(sessionId);
        if (!session) return;

        const updatedSession = {
            ...session,
            participants: [...session.participants, userId],
            lastActivity: new Date()
        };

        setSessions(prev => new Map(prev).set(sessionId, updatedSession));
        setCurrentSession(updatedSession);

        // Broadcast session join
        send({
            id: `session-joined-${sessionId}-${userId}`,
            type: 'session_joined',
            payload: {
                sessionId,
                userId,
                participants: updatedSession.participants,
                lastActivity: updatedSession.lastActivity
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [sessions, userId, send]);

    // Leave collaboration session
    const leaveSession = useCallback((sessionId: string) => {
        const session = sessions.get(sessionId);
        if (!session) return;

        const updatedSession = {
            ...session,
            participants: session.participants.filter(id => id !== userId),
            lastActivity: new Date()
        };

        if (updatedSession.participants.length === 0) {
            // Delete session if no participants left
            setSessions(prev => {
                const newSessions = new Map(prev);
                newSessions.delete(sessionId);
                return newSessions;
            });
            
            if (currentSession?.id === sessionId) {
                setCurrentSession(null);
            }
        } else {
            setSessions(prev => new Map(prev).set(sessionId, updatedSession));
        }

        // Broadcast session leave
        send({
            id: `session-left-${sessionId}-${userId}`,
            type: 'session_left',
            payload: {
                sessionId,
                userId,
                participants: updatedSession.participants,
                lastActivity: updatedSession.lastActivity
            },
            timestamp: Date.now(),
            sender: userId
        });

        // Clean up user-specific data
        setCursors(prev => {
            const newCursors = new Map(prev);
            newCursors.delete(userId);
            return newCursors;
        });

        setSelections(prev => {
            const newSelections = new Map(prev);
            newSelections.delete(userId);
            return newSelections;
        });

        // Unlock any documents locked by this user
        const userLocks = Array.from(locks.entries())
            .filter(([_, lock]) => lock.userId === userId)
            .map(([lockId, _]) => lockId);

        userLocks.forEach(lockId => {
            unlockDocument(lockId);
        });
    }, [sessions, userId, send, locks, unlockDocument]);

    // Update cursor position
    const updateCursor = useCallback((position: { x: number; y: number; line?: number; column?: number }) => {
        if (!config.enableRealTimeCursors || !currentSession) return;

        const cursor: UserCursor = {
            userId,
            position,
            visible: true,
            color: getUserColor(userId),
            timestamp: Date.now()
        };

        setCursors(prev => new Map(prev).set(userId, cursor));

        // Clear existing timeout
        if (cursorTimeoutRef.current) {
            clearTimeout(cursorTimeoutRef.current);
        }

        // Hide cursor after inactivity
        cursorTimeoutRef.current = setTimeout(() => {
            setCursors(prev => {
                const newCursors = new Map(prev);
                const existingCursor = newCursors.get(userId);
                if (existingCursor) {
                    newCursors.set(userId, { ...existingCursor, visible: false });
                }
                return newCursors;
            });
        }, 3000);

        // Broadcast cursor update
        send({
            id: `cursor-update-${currentSession.id}-${userId}`,
            type: 'cursor_update',
            payload: {
                sessionId: currentSession.id,
                userId,
                cursor
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [config.enableRealTimeCursors, currentSession, userId, getUserColor, send]);

    // Update selection
    const updateSelection = useCallback((selection: { start: { line: number; column: number }; end: { line: number; column: number } }) => {
        if (!config.enableRealTimeSelections || !currentSession) return;

        const userSelection: UserSelection = {
            userId,
            range: {
                ...selection,
                text: '' // This would be populated from the actual document
            },
            visible: true,
            color: getUserColor(userId),
            timestamp: Date.now()
        };

        setSelections(prev => new Map(prev).set(userId, userSelection));

        // Clear existing timeout
        if (selectionTimeoutRef.current) {
            clearTimeout(selectionTimeoutRef.current);
        }

        // Hide selection after inactivity
        selectionTimeoutRef.current = setTimeout(() => {
            setSelections(prev => {
                const newSelections = new Map(prev);
                const existingSelection = newSelections.get(userId);
                if (existingSelection) {
                    newSelections.set(userId, { ...existingSelection, visible: false });
                }
                return newSelections;
            });
        }, 5000);

        // Broadcast selection update
        send({
            id: `selection-update-${currentSession.id}-${userId}`,
            type: 'selection_update',
            payload: {
                sessionId: currentSession.id,
                userId,
                selection: userSelection
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [config.enableRealTimeSelections, currentSession, userId, getUserColor, send]);

    // Apply edit operation
    const applyEdit = useCallback((edit: Omit<EditOperation, 'applied'>) => {
        if (!config.enableRealTimeEditing || !currentSession) return;

        const editOperation: EditOperation = {
            ...edit,
            applied: true,
            timestamp: Date.now()
        };

        setEdits(prev => {
            const newEdits = [...prev, editOperation];
            // Keep only recent edits
            if (newEdits.length > config.editHistorySize) {
                return newEdits.slice(-config.editHistorySize);
            }
            return newEdits;
        });

        // Broadcast edit operation
        send({
            id: `edit-applied-${currentSession.id}-${userId}`,
            type: 'edit_applied',
            payload: {
                sessionId: currentSession.id,
                userId,
                edit: editOperation
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [config.enableRealTimeEditing, currentSession, userId, config.editHistorySize, send]);

    // Lock document
    const lockDocument = useCallback((sectionId?: string, reason?: string) => {
        if (!config.enableDocumentLocking || !currentSession) return;

        const lock: DocumentLock = {
            userId,
            documentId: currentSession.documentId,
            sectionId,
            lockedAt: new Date(),
            expiresAt: new Date(Date.now() + config.lockTimeout),
            reason,
            isLocked: true
        };

        const lockId = sectionId || 'document';
        setLocks(prev => new Map(prev).set(lockId, lock));

        // Broadcast document lock
        send({
            id: `document-locked-${currentSession.id}-${userId}`,
            type: 'document_locked',
            payload: {
                sessionId: currentSession.id,
                userId,
                documentId: currentSession.documentId,
                sectionId,
                lock
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [config.enableDocumentLocking, currentSession, userId, config.lockTimeout, send]);

    // Unlock document
    const unlockDocument = useCallback((sectionId?: string) => {
        if (!config.enableDocumentLocking || !currentSession) return;

        const lockId = sectionId || 'document';
        const existingLock = locks.get(lockId);
        
        if (existingLock && existingLock.userId === userId) {
            setLocks(prev => {
                const newLocks = new Map(prev);
                newLocks.delete(lockId);
                return newLocks;
            });

            // Broadcast document unlock
            send({
                id: `document-unlocked-${currentSession.id}-${userId}`,
                type: 'document_unlocked',
                payload: {
                    sessionId: currentSession.id,
                    userId,
                    documentId: currentSession.documentId,
                    sectionId,
                    lock: existingLock
                },
                timestamp: Date.now(),
                sender: userId
            });
        }
    }, [config.enableDocumentLocking, currentSession, userId, locks, send]);

    // Check if document is locked
    const isDocumentLocked = useCallback((sectionId?: string): boolean => {
        const lockId = sectionId || 'document';
        const lock = locks.get(lockId);
        
        if (!lock) return false;
        
        // Check if lock has expired
        if (lock.expiresAt && Date.now() > lock.expiresAt.getTime()) {
            setLocks(prev => {
                const newLocks = new Map(prev);
                newLocks.delete(lockId);
                return newLocks;
            });
            return false;
        }
        
        return lock.isLocked;
    }, [locks]);

    // Get document lock
    const getDocumentLock = useCallback((sectionId?: string): DocumentLock | null => {
        const lockId = sectionId || 'document';
        const lock = locks.get(lockId);
        
        // Check if lock has expired
        if (lock && lock.expiresAt && Date.now() > lock.expiresAt.getTime()) {
            setLocks(prev => {
                const newLocks = new Map(prev);
                newLocks.delete(lockId);
                return newLocks;
            });
            return null;
        }
        
        return lock;
    }, [locks]);

    // Share session
    const shareSession = useCallback((userIds: string[]) => {
        if (!currentSession) return;

        const updatedSession = {
            ...currentSession,
            participants: [...new Set([...currentSession.participants, ...userIds])],
            lastActivity: new Date()
        };

        setSessions(prev => new Map(prev).set(currentSession.id, updatedSession));
        setCurrentSession(updatedSession);

        // Broadcast session share
        send({
            id: `session-shared-${currentSession.id}-${userId}`,
            type: 'session_shared',
            payload: {
                sessionId: currentSession.id,
                userId,
                userIds,
                participants: updatedSession.participants,
                lastActivity: updatedSession.lastActivity
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [currentSession, userId, send]);

    // Add comment
    const addComment = useCallback((comment: any) => {
        if (!currentSession) return;

        // Broadcast comment
        send({
            id: `comment-added-${currentSession.id}-${userId}`,
            type: 'comment_added',
            payload: {
                sessionId: currentSession.id,
                userId,
                comment
            },
            timestamp: Date.now(),
            sender: userId
        });
    }, [currentSession, userId, send]);

    // Get active users in session
    const getActiveUsers = useCallback((sessionId: string): string[] => {
        const session = sessions.get(sessionId);
        return session ? session.participants : [];
    }, [sessions]);

    // Get edit history
    const getEditHistory = useCallback((sessionId: string): EditOperation[] => {
        return edits.filter(edit => {
            // Filter edits by session if needed
            return true; // For now, return all edits
        });
    }, [edits]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<CollaborationConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Handle incoming collaboration events
    useEffect(() => {
        const handleCursorUpdate = (data: any) => {
            const { userId: cursorUserId, cursor } = data.payload;
            
            if (cursorUserId !== userId) {
                setCursors(prev => new Map(prev).set(cursorUserId, cursor));
            }
        };

        const handleSelectionUpdate = (data: any) => {
            const { userId: selectionUserId, selection } = data.payload;
            
            if (selectionUserId !== userId) {
                setSelections(prev => new Map(prev).set(selectionUserId, selection));
            }
        };

        const handleEditApplied = (data: any) => {
            const { userId: editUserId, edit } = data.payload;
            
            if (editUserId !== userId) {
                setEdits(prev => {
                    const newEdits = [...prev, edit];
                    if (newEdits.length > config.editHistorySize) {
                        return newEdits.slice(-config.editHistorySize);
                    }
                    return newEdits;
                });
            }
        };

        const handleDocumentLocked = (data: any) => {
            const { userId: lockUserId, lock } = data.payload;
            
            if (lockUserId !== userId) {
                const lockId = lock.sectionId || 'document';
                setLocks(prev => new Map(prev).set(lockId, lock));
            }
        };

        const handleDocumentUnlocked = (data: any) => {
            const { userId: lockUserId, lock } = data.payload;
            
            if (lockUserId !== userId) {
                const lockId = lock.sectionId || 'document';
                setLocks(prev => {
                    const newLocks = new Map(prev);
                    newLocks.delete(lockId);
                    return newLocks;
                });
            }
        };

        const handleSessionCreated = (data: any) => {
            const { sessionId, session } = data.payload;
            setSessions(prev => new Map(prev).set(sessionId, session));
        };

        const handleSessionJoined = (data: any) => {
            const { sessionId, participants } = data.payload;
            setSessions(prev => {
                const session = prev.get(sessionId);
                if (session) {
                    return new Map(prev).set(sessionId, {
                        ...session,
                        participants,
                        lastActivity: new Date()
                    });
                }
                return prev;
            });
        };

        const handleSessionLeft = (data: any) => {
            const { sessionId, participants } = data.payload;
            setSessions(prev => {
                const session = prev.get(sessionId);
                if (session) {
                    if (participants.length === 0) {
                        const newSessions = new Map(prev);
                        newSessions.delete(sessionId);
                        return newSessions;
                    }
                    return new Map(prev).set(sessionId, {
                        ...session,
                        participants,
                        lastActivity: new Date()
                    });
                }
                return prev;
            });
        };

        const handleSessionShared = (data: any) => {
            const { sessionId, participants } = data.payload;
            setSessions(prev => {
                const session = prev.get(sessionId);
                if (session) {
                    return new Map(prev).set(sessionId, {
                        ...session,
                        participants,
                        lastActivity: new Date()
                    });
                }
                return prev;
            });
        };

        on('cursor_update', handleCursorUpdate);
        on('selection_update', handleSelectionUpdate);
        on('edit_applied', handleEditApplied);
        on('document_locked', handleDocumentLocked);
        on('document_unlocked', handleDocumentUnlocked);
        on('session_created', handleSessionCreated);
        on('session_joined', handleSessionJoined);
        on('session_left', handleSessionLeft);
        on('session_shared', handleSessionShared);

        return () => {
            off('cursor_update', handleCursorUpdate);
            off('selection_update', handleSelectionUpdate);
            off('edit_applied', handleEditApplied);
            off('document_locked', handleDocumentLocked);
            off('document_unlocked', handleDocumentUnlocked);
            off('session_created', handleSessionCreated);
            off('session_joined', handleSessionJoined);
            off('session_left', handleSessionLeft);
            off('session_shared', handleSessionShared);
        };
    }, [userId, config.editHistorySize, on, off]);

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (cursorTimeoutRef.current) {
                clearTimeout(cursorTimeoutRef.current);
            }
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current);
            }
        };
    }, []);

    const value: CollaborationContextType = {
        sessions,
        cursors,
        selections,
        edits,
        locks,
        config,
        currentSession,
        createSession,
        joinSession,
        leaveSession,
        updateCursor,
        updateSelection,
        applyEdit,
        lockDocument,
        unlockDocument,
        isDocumentLocked,
        getDocumentLock,
        shareSession,
        addComment,
        updateConfig,
        getActiveUsers,
        getEditHistory
    };

    return (
        <CollaborationContext.Provider value={value}>
            {children}
        </CollaborationContext.Provider>
    );
};

// Hook to use collaboration
export const useLiveCollaboration = () => {
    const context = useContext(CollaborationContext);
    if (!context) {
        throw new Error('useLiveCollaboration must be used within LiveCollaborationProvider');
    }
    return context;
};

// User Cursor Component
interface UserCursorProps {
    userId: string;
    className?: string;
}

export const UserCursor: React.FC<UserCursorProps> = ({ userId, className = '' }) => {
    const { cursors, getUserPresence } = useLiveCollaboration();
    const presence = getUserPresence(userId);
    const cursor = cursors.get(userId);

    if (!cursor || !cursor.visible) return null;

    return (
        <div
            className={`absolute pointer-events-none z-50 ${className}`}
            style={{
                left: cursor.position.x,
                top: cursor.position.y,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div
                className=\"w-4 h-4 rounded-full border-2 border-white shadow-lg\"
                style={{ backgroundColor: cursor.color }}
            />
            <div
                className=\"absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-75\"
            />
        </div>
    );
};

// User Selection Component
interface UserSelectionProps {
    userId: string;
    className?: string;
}

export const UserSelection: React.FC<UserSelectionProps> = ({ userId, className = '' }) => {
    const { selections } = useLiveCollaboration();
    const selection = selections.get(userId);

    if (!selection || !selection.visible) return null;

    return (
        <div
            className={`absolute pointer-events-none z-40 ${className}`}
            style={{
                backgroundColor: selection.color + '20',
                borderLeft: `2px solid ${selection.color}`,
                borderRight: `2px solid ${selection.color}`,
                top: selection.range.start.line * 20,
                left: selection.range.start.column * 8,
                height: (selection.range.end.line - selection.range.start.line + 1) * 20,
                width: (selection.range.end.column - selection.range.start.column + 1) * 8
            }}
        />
    );
};

// Document Lock Indicator
interface DocumentLockProps {
    sectionId?: string;
    className?: string;
}

export const DocumentLockIndicator: React.FC<DocumentLockProps> = ({ sectionId, className = '' }) => {
    const { locks, isDocumentLocked, getDocumentLock } = useLiveCollaboration();
    const lock = getDocumentLock(sectionId);
    const isLocked = isDocumentLocked(sectionId);

    if (!isLocked) return null;

    return (
        <div className={`flex items-center space-x-2 text-sm ${className}`}>
            <FiLock className=\"text-red-500\" />
            <span className=\"text-red-500\">Locked by {lock?.userId}</span>
            {lock?.reason && (
                <span className=\"text-gray-500\">({lock.reason})</span>
            )}
        </div>
    );
};

export default LiveCollaborationProvider;
