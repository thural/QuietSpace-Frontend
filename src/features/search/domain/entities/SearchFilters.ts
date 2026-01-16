/**
 * Search Filters Entity.
 * 
 * Represents search filters and their configuration.
 */

/**
 * SearchFilters interface.
 * 
 * Defines the structure for search filters.
 */
export interface SearchFilters {
    /** Filter by specific user */
    user?: string;
    
    /** Filter by date range */
    date?: string;
    
    /** Filter by content type */
    type?: 'posts' | 'users' | 'all';
    
    /** Filter by tags */
    tags?: string[];
    
    /** Filter by date range */
    dateRange?: {
        from?: string;
        to?: string;
    };
    
    /** Filter by content rating */
    rating?: 'all' | 'safe' | 'sensitive';
    
    /** Filter by language */
    language?: string;
    
    /** Filter by location */
    location?: {
        country?: string;
        city?: string;
        radius?: number;
    };
    
    /** Filter by verification status */
    verified?: boolean;
    
    /** Filter by minimum followers count */
    minFollowers?: number;
    
    /** Filter by content category */
    category?: string;
    
    /** Sort order */
    sortBy?: 'relevance' | 'date' | 'popularity' | 'followers';
    
    /** Sort direction */
    sortOrder?: 'asc' | 'desc';
    
    /** Pagination */
    pagination?: {
        page?: number;
        limit?: number;
        offset?: number;
    };
    
    /** Custom filters */
    custom?: Record<string, any>;
}

/**
 * SearchFilterConfig interface.
 * 
 * Configuration for search filters.
 */
export interface SearchFilterConfig {
    /** Available filter types */
    availableFilters: string[];
    
    /** Default filter values */
    defaultFilters: SearchFilters;
    
    /** Maximum number of results per page */
    maxResultsPerPage: number;
    
    /** Whether to enable advanced filters */
    enableAdvancedFilters: boolean;
    
    /** Filter validation rules */
    validationRules: {
        [key: string]: {
            required?: boolean;
            minLength?: number;
            maxLength?: number;
            pattern?: RegExp;
            allowedValues?: string[];
        };
    };
}

/**
 * SearchFilterPreset interface.
 * 
 * Predefined filter configurations.
 */
export interface SearchFilterPreset {
    /** Preset identifier */
    id: string;
    
    /** Preset display name */
    name: string;
    
    /** Preset description */
    description: string;
    
    /** Preset filters */
    filters: SearchFilters;
    
    /** Whether preset is built-in */
    isBuiltIn: boolean;
    
    /** Preset icon */
    icon?: string;
    
    /** Preset category */
    category: 'general' | 'content' | 'user' | 'date' | 'location';
}

/**
 * SearchFilterState interface.
 * 
 * Represents the current state of search filters.
 */
export interface SearchFilterState {
    /** Current active filters */
    activeFilters: SearchFilters;
    
    /** Available filter presets */
    presets: SearchFilterPreset[];
    
    /** Currently selected preset */
    selectedPreset?: string;
    
    /** Whether filters panel is open */
    isFiltersOpen: boolean;
    
    /** Whether filters have been modified */
    hasUnsavedChanges: boolean;
    
    /** Last applied filters */
    lastAppliedFilters?: SearchFilters;
}
