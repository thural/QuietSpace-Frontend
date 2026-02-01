/**
 * Profile Search Container Component
 * 
 * Enterprise-grade profile search with advanced user discovery
 * Uses custom query system, intelligent caching, and search management
 */

import React, { useState, useCallback } from 'react';
import ErrorComponent from "@/shared/errors/ErrorComponent";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import DefaultContainer from "@/shared/DefaultContainer";
import Typography from "@/shared/Typography";
import { useProfile } from "@features/profile/application/hooks/useProfile";
import { LoadingSpinner } from "@/shared/ui/components";

/**
 * ProfileSearchContainer component.
 * 
 * This component provides enterprise-grade profile search functionality with:
 * - Custom query system with intelligent caching
 * - Advanced search with filters and pagination
 * - Real-time search results and suggestions
 * - Performance monitoring and optimization
 * - Type-safe operations with comprehensive validation
 * 
 * @returns {JSX.Element} - The rendered ProfileSearchContainer component.
 */
function ProfileSearchContainer() {
    // Enterprise profile hook
    const {
        searchResults,
        suggestions,
        isLoading,
        error,
        searchUsers,
        getUserSuggestions,
        clearError
    } = useProfile();

    // Local state for search management
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        limit: 20,
        offset: 0,
        filters: {}
    });
    const [isSearching, setIsSearching] = useState(false);

    // Handle search input change
    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Debounced search
        if (query.length >= 2) {
            const timeoutId = setTimeout(() => {
                performSearch(query);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            // Clear results if query is too short
            setSearchResults(null);
        }
    }, []);

    // Perform search
    const performSearch = useCallback(async (query: string) => {
        try {
            setIsSearching(true);
            await searchUsers(query, searchFilters);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    }, [searchUsers, searchFilters]);

    // Handle search form submission
    const handleSearchSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim().length >= 2) {
            performSearch(searchQuery.trim());
        }
    }, [searchQuery, performSearch]);

    // Load suggestions on mount
    React.useEffect(() => {
        getUserSuggestions('current-user', { limit: 10, type: 'mutual' });
    }, [getUserSuggestions]);

    // Error handling
    if (error) {
        return (
            <DefaultContainer>
                <ErrorComponent
                    message={`Error searching users: ${error.message}`}
                    onRetry={clearError}
                />
            </DefaultContainer>
        );
    }

    return (
        <DefaultContainer>
            <Typography variant="h2" className="mb-6">
                Find People
            </Typography>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by username or email..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSearching}
                    />
                    <button
                        type="submit"
                        disabled={isSearching || searchQuery.trim().length < 2}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Search Filters */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <Typography variant="h3" className="mb-4">
                    Search Filters
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Limit Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Results per page
                        </label>
                        <select
                            value={searchFilters.limit}
                            onChange={(e) => setSearchFilters(prev => ({
                                ...prev,
                                limit: parseInt(e.target.value)
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    {/* User Type Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            User Type
                        </label>
                        <select
                            value={searchFilters.filters.userType || 'all'}
                            onChange={(e) => setSearchFilters(prev => ({
                                ...prev,
                                filters: {
                                    ...prev.filters,
                                    userType: e.target.value
                                }
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="all">All Users</option>
                            <option value="verified">Verified</option>
                            <option value="popular">Popular</option>
                            <option value="new">New</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={searchFilters.filters.location || ''}
                            onChange={(e) => setSearchFilters(prev => ({
                                ...prev,
                                filters: {
                                    ...prev.filters,
                                    location: e.target.value
                                }
                            }))}
                            placeholder="City or country"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {(isLoading || isSearching) && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                </div>
            )}

            {/* Search Results */}
            {searchResults && !isLoading && !isSearching && (
                <div className="mb-8">
                    <Typography variant="h3" className="mb-4">
                        Search Results ({searchResults.length})
                    </Typography>

                    {searchResults.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Typography>No users found matching your search.</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.map((user) => (
                                <div key={user.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                                        <div>
                                            <Typography variant="h4" className="font-medium">
                                                {user.username}
                                            </Typography>
                                            <Typography variant="small" className="text-gray-500">
                                                {user.email}
                                            </Typography>
                                        </div>
                                    </div>

                                    {user.bio && (
                                        <Typography variant="small" className="text-gray-600 mb-3">
                                            {user.bio.substring(0, 100)}{user.bio.length > 100 ? '...' : ''}
                                        </Typography>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <Typography variant="small" className="text-gray-500">
                                            {user.followersCount || 0} followers
                                        </Typography>
                                        {user.isVerified && (
                                            <span className="text-blue-500 text-sm">✓ Verified</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Suggestions */}
            {suggestions && !isLoading && (
                <div className="mb-8">
                    <Typography variant="h3" className="mb-4">
                        Suggested for You
                    </Typography>

                    {suggestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Typography>No suggestions available at the moment.</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestions.map((user) => (
                                <div key={user.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                                        <div>
                                            <Typography variant="h4" className="font-medium">
                                                {user.username}
                                            </Typography>
                                            <Typography variant="small" className="text-gray-500">
                                                {user.followersCount || 0} followers
                                            </Typography>
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!searchResults && !suggestions && !isLoading && !isSearching && (
                <div className="text-center py-12">
                    <Typography variant="h3" className="mb-4">
                        Discover New People
                    </Typography>
                    <Typography className="text-gray-600 mb-6">
                        Search for users by username or email, or check out our suggestions below.
                    </Typography>
                </div>
            )}
        </DefaultContainer>
    );
}

// Export with error boundary
export default withErrorBoundary(ProfileSearchContainer, {
    fallback: <ErrorComponent message="Search component encountered an error" />,
    onError: (error, errorInfo) => {
        console.error('ProfileSearchContainer error:', error, errorInfo);
    }
});

// Export the component for testing
export { ProfileSearchContainer };
