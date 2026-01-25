/**
 * Feed Migration Example Component
 * 
 * This component demonstrates the migration from legacy useRealtimeFeedUpdates to the enterprise
 * WebSocket infrastructure. It shows how to use the migrated hook and monitor the migration process.
 */

import React, { useState, useEffect } from 'react';
import useRealtimeFeedUpdatesMigrated from '../../application/hooks/useRealtimeFeedUpdatesMigrated';
import type { RealtimePostUpdate } from '../../application/hooks/useRealtimeFeedUpdates';

interface FeedPost {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isOptimistic?: boolean;
}

/**
 * Example component demonstrating feed socket migration
 */
const FeedMigrationExample: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [showMigrationInfo, setShowMigrationInfo] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  // Use the migrated feed socket hook
  const {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    migration
  } = useRealtimeFeedUpdatesMigrated();

  // Handle sending a new post
  const handleSendPost = () => {
    if (!newPostContent.trim() || !isConnected) return;

    const postUpdate: RealtimePostUpdate = {
      type: 'post_created',
      postId: `post_${Date.now()}`,
      userId: 'current-user',
      data: {
        content: newPostContent.trim(),
        author: 'Current User',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    sendMessage(postUpdate);
    
    // Add optimistic post to local state
    const optimisticPost: FeedPost = {
      id: postUpdate.postId,
      content: newPostContent.trim(),
      author: 'Current User',
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isOptimistic: true
    };

    setPosts(prev => [optimisticPost, ...prev]);
    setNewPostContent('');
  };

  // Handle sending a reaction
  const handleSendReaction = (postId: string, reactionType: 'like' | 'love' = 'like') => {
    if (!isConnected) return;

    const reactionUpdate: RealtimePostUpdate = {
      type: 'reaction_added',
      postId,
      userId: 'current-user',
      data: {
        reactionType,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    sendMessage(reactionUpdate);
    
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  // Handle sending a comment
  const handleSendComment = (postId: string, comment: string) => {
    if (!comment.trim() || !isConnected) return;

    const commentUpdate: RealtimePostUpdate = {
      type: 'comment_added',
      postId,
      userId: 'current-user',
      data: {
        comment: comment.trim(),
        author: 'Current User',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    sendMessage(commentUpdate);
    
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );

  // Migration information panel
  const MigrationInfo = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-blue-900">Feed Migration Status</h3>
        <button
          onClick={() => setShowMigrationInfo(!showMigrationInfo)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showMigrationInfo ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showMigrationInfo && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Using Enterprise:</span>
            <span className={`font-medium ${
              migration.isUsingEnterprise ? 'text-green-600' : 'text-orange-600'
            }`}>
              {migration.isUsingEnterprise ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Fallback Active:</span>
            <span className={`font-medium ${
              migration.isFallbackActive ? 'text-red-600' : 'text-gray-600'
            }`}>
              {migration.isFallbackActive ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Updates Sent:</span>
            <span className="font-medium">{migration.performanceMetrics.updateCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Errors:</span>
            <span className={`font-medium ${
              migration.performanceMetrics.errorCount > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {migration.performanceMetrics.errorCount}
            </span>
          </div>
          
          {migration.performanceMetrics.enterpriseLatency && (
            <div className="flex justify-between">
              <span className="text-gray-600">Enterprise Latency:</span>
              <span className="font-medium">
                {migration.performanceMetrics.enterpriseLatency.toFixed(2)}ms
              </span>
            </div>
          )}
          
          {migration.performanceMetrics.legacyLatency && (
            <div className="flex justify-between">
              <span className="text-gray-600">Legacy Latency:</span>
              <span className="font-medium">
                {migration.performanceMetrics.legacyLatency.toFixed(2)}ms
              </span>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-500">
              Last Event: {migration.lastMigrationEvent}
            </div>
          </div>
          
          {migration.migrationErrors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="text-sm font-medium text-red-700 mb-2">Recent Errors:</div>
              <div className="space-y-1">
                {migration.migrationErrors.slice(-3).map((error, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Feed Migration Example
            </h2>
            <ConnectionStatus />
          </div>
        </div>

        {/* Migration Information */}
        <MigrationInfo />

        {/* New Post Input */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendPost()}
              placeholder="What's on your mind?"
              disabled={!isConnected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendPost}
              disabled={!isConnected || !newPostContent.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No posts yet. Start the conversation!
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={`border border-gray-200 rounded-lg p-4 ${
                  post.isOptimistic ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-500">
                      {post.timestamp.toLocaleTimeString()}
                      {post.isOptimistic && (
                        <span className="ml-2 text-blue-600 text-xs">Sending...</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-800 mb-3">{post.content}</div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSendReaction(post.id, 'like')}
                    disabled={!isConnected}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    👍 {post.likes}
                  </button>
                  
                  <button
                    onClick={() => handleSendComment(post.id, 'Great post!')}
                    disabled={!isConnected}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💬 {post.comments}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Connection Controls */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <button
              onClick={connect}
              disabled={isConnected}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Connect
            </button>
            <button
              onClick={disconnect}
              disabled={!isConnected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedMigrationExample;
