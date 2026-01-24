/**
 * Enterprise Search Example Component
 * 
 * Demonstrates the usage of enterprise search hooks with
 * advanced features like caching, error handling, and suggestions
 */

import React, { useState } from 'react';
import { useEnterpriseSearch } from '@features/search/application/hooks';
import { UserList } from '@/features/profile/data/models/user';
import { PostList } from '@/features/feed/data/models/post';

/**
 * Enterprise Search Example Props
 */
interface EnterpriseSearchExampleProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
  enableMigrationMode?: boolean;
}

/**
 * User Result Component
 */
const UserResult: React.FC<{ user: any }> = ({ user }) => (
  <div className="user-result p-3 border-b hover:bg-gray-50">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
        {user.name?.charAt(0) || 'U'}
      </div>
      <div>
        <div className="font-medium">{user.name || 'Unknown User'}</div>
        <div className="text-sm text-gray-500">@{user.username || 'unknown'}</div>
      </div>
    </div>
  </div>
);

/**
 * Post Result Component
 */
const PostResult: React.FC<{ post: any }> = ({ post }) => (
  <div className="post-result p-3 border-b hover:bg-gray-50">
    <div className="font-medium">{post.title || 'Untitled Post'}</div>
    <div className="text-sm text-gray-600 mt-1">{post.content?.substring(0, 100)}...</div>
    <div className="text-xs text-gray-400 mt-2">
      By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
    </div>
  </div>
);

/**
 * Suggestion Component
 */
const Suggestion: React.FC<{ suggestion: string; onSelect: (suggestion: string) => void }> = ({ 
  suggestion, 
  onSelect 
}) => (
  <div 
    className="suggestion px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
    onClick={() => onSelect(suggestion)}
  >
    🔍 {suggestion}
  </div>
);

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="error-message p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-700">{error}</div>
    <button 
      onClick={onRetry}
      className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
    >
      Retry
    </button>
  </div>
);

/**
 * Enterprise Search Example Component
 */
export const EnterpriseSearchExample: React.FC<EnterpriseSearchExampleProps> = ({
  className = '',
  placeholder = 'Search users and posts...',
  showSuggestions = true,
  enableMigrationMode = false
}) => {
  const [showUserResults, setShowUserResults] = useState(true);
  const [showPostResults, setShowPostResults] = useState(true);
  
  const search = useEnterpriseSearch();

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    search.setQuery(suggestion);
    search.setFocused(false);
  };

  // Handle tab switching
  const handleTabSwitch = (tab: 'users' | 'posts') => {
    if (tab === 'users') {
      setShowUserResults(true);
      setShowPostResults(false);
    } else {
      setShowUserResults(false);
      setShowPostResults(true);
    }
  };

  return (
    <div className={`enterprise-search-example ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={search.queryInputRef}
          type="text"
          value={search.query}
          onChange={search.handleInputChange}
          onKeyDown={search.handleKeyDown}
          onFocus={search.handleInputFocus}
          onBlur={search.handleInputBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Loading Indicator */}
        {search.isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {search.focused && showSuggestions && search.suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {search.suggestions.map((suggestion, index) => (
            <Suggestion 
              key={index} 
              suggestion={suggestion} 
              onSelect={handleSuggestionSelect}
            />
          ))}
        </div>
      )}

      {/* Error Message */}
      {search.error && (
        <ErrorMessage error={search.error} onRetry={search.retry} />
      )}

      {/* Results Section */}
      {(search.userResults.length > 0 || search.postResults.length > 0) && (
        <div className="mt-6">
          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => handleTabSwitch('users')}
              className={`px-4 py-2 font-medium ${
                showUserResults 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users ({search.userResults.length})
            </button>
            <button
              onClick={() => handleTabSwitch('posts')}
              className={`px-4 py-2 font-medium ${
                showPostResults 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts ({search.postResults.length})
            </button>
          </div>

          {/* Results Content */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg">
            {showUserResults && search.userResults.length > 0 && (
              <div className="user-results">
                <div className="px-4 py-2 bg-gray-50 border-b font-medium">
                  User Results
                </div>
                {search.userResults.map((user, index) => (
                  <UserResult key={user.id || index} user={user} />
                ))}
              </div>
            )}

            {showPostResults && search.postResults.length > 0 && (
              <div className="post-results">
                <div className="px-4 py-2 bg-gray-50 border-b font-medium">
                  Post Results
                </div>
                {search.postResults.map((post, index) => (
                  <PostResult key={post.id || index} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {!search.isLoading && !search.error && 
       search.query && 
       search.userResults.length === 0 && 
       search.postResults.length === 0 && (
        <div className="mt-6 text-center py-8 text-gray-500">
          <div className="text-lg">No results found</div>
          <div className="text-sm mt-2">Try adjusting your search terms</div>
        </div>
      )}

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-xs">
          <div className="font-medium mb-2">Debug Information:</div>
          <div>Query: "{search.query}"</div>
          <div>Focused: {search.focused.toString()}</div>
          <div>Loading: {search.isLoading.toString()}</div>
          <div>Error: {search.error || 'None'}</div>
          <div>User Results: {search.userResults.length}</div>
          <div>Post Results: {search.postResults.length}</div>
          <div>Suggestions: {search.suggestions.length}</div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseSearchExample;
