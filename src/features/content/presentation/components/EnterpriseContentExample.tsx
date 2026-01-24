/**
 * Enterprise Content Example Component
 * 
 * Demonstrates the usage of enterprise content hooks
 * Shows best practices for content management with custom query system
 */

import React, { useState } from 'react';
import { useEnterpriseContent } from '../hooks/useEnterpriseContent';
import type { ContentEntity, ContentTemplate, MediaFile } from '@features/content/domain/entities/ContentEntity';

/**
 * Enterprise Content Example Component
 */
export const EnterpriseContentExample: React.FC<{ contentId?: string }> = ({ contentId }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'list' | 'analytics'>('list');
  const [selectedContentId, setSelectedContentId] = useState<string | undefined>(contentId);
  
  const {
    // State
    content,
    contentList,
    authorContent,
    searchResults,
    trending,
    featured,
    media,
    analytics,
    moderation,
    templates,
    drafts,
    scheduled,
    isLoading,
    error,
    hasUnsavedChanges,
    
    // Actions
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    uploadMedia,
    moderateContent,
    searchContent,
    getTrendingContent,
    getFeaturedContent,
    loadCompleteContent,
    refreshContent,
    invalidateContentCache,
    resetChanges,
    markAsChanged
  } = useEnterpriseContent(selectedContentId);

  // Local form state
  const [contentForm, setContentForm] = useState({
    title: '',
    content: '',
    contentType: 'article',
    category: 'technology',
    tags: [] as string[],
    status: 'draft',
    hasMedia: false
  });

  // Handle form changes
  const handleFormChange = (field: keyof typeof contentForm, value: any) => {
    setContentForm(prev => ({ ...prev, [field]: value }));
    markAsChanged();
  };

  // Handle content creation
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createContent({
      ...contentForm,
      authorId: 'current-user', // Would get from auth context
      seo: {
        description: contentForm.content.substring(0, 150),
        keywords: contentForm.tags
      },
      moderation: {
        status: 'pending',
        flags: [],
        autoModeration: true
      }
    });
    
    if (result.success) {
      console.log('Content created successfully');
      setContentForm({
        title: '',
        content: '',
        contentType: 'article',
        category: 'technology',
        tags: [],
        status: 'draft',
        hasMedia: false
      });
      setActiveTab('list');
      refreshContent();
    } else {
      console.error('Failed to create content:', result.errors);
    }
  };

  // Handle content update
  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContentId) return;
    
    const result = await updateContent(selectedContentId, contentForm);
    
    if (result.success) {
      console.log('Content updated successfully');
      resetChanges();
    } else {
      console.error('Failed to update content:', result.errors);
    }
  };

  // Handle content deletion
  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      const result = await deleteContent(contentId);
      
      if (result.success) {
        console.log('Content deleted successfully');
        refreshContent();
      } else {
        console.error('Failed to delete content');
      }
    }
  };

  // Handle content publishing
  const handlePublishContent = async (contentId: string) => {
    const result = await publishContent(contentId);
    
    if (result.success) {
      console.log('Content published successfully');
      refreshContent();
    } else {
      console.error('Failed to publish content:', result.message);
    }
  };

  // Handle content scheduling
  const handleScheduleContent = async (contentId: string, publishDate: Date) => {
    const result = await scheduleContent(contentId, publishDate);
    
    if (result.success) {
      console.log('Content scheduled successfully');
      refreshContent();
    } else {
      console.error('Failed to schedule content:', result.message);
    }
  };

  // Handle media upload
  const handleMediaUpload = async (contentId: string, file: File) => {
    const result = await uploadMedia(contentId, file);
    
    if (result.success) {
      console.log('Media uploaded successfully');
      refreshContent();
    } else {
      console.error('Failed to upload media:', result.errors);
    }
  };

  // Handle content moderation
  const handleModerateContent = async (contentId: string, action: 'approve' | 'reject' | 'flag', reason: string) => {
    const result = await moderateContent(contentId, action, reason);
    
    if (result.success) {
      console.log(`Content ${action} successfully`);
      refreshContent();
    } else {
      console.error(`Failed to ${action} content:`, result.message);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    const results = await searchContent(query);
    console.log('Search results:', results);
  };

  // Handle content selection
  const handleContentSelect = (contentId: string) => {
    setSelectedContentId(contentId);
    setActiveTab('edit');
  };

  // Utility functions
  const handleRefresh = () => {
    refreshContent();
    console.log('Content data refreshed');
  };

  const handleInvalidateCache = () => {
    invalidateContentCache();
    console.log('Content cache invalidated');
  };

  const handleResetChanges = () => {
    resetChanges();
    console.log('Changes reset');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="content-loading">
        <div className="loading-spinner">Loading content...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="content-error">
        <div className="error-message">
          Error loading content: {error.message}
        </div>
        <button onClick={handleRefresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="enterprise-content-example">
      <div className="content-header">
        <h1>Enterprise Content Management</h1>
        <div className="content-actions">
          {hasUnsavedChanges && (
            <button onClick={handleResetChanges} className="reset-btn">
              Reset Changes
            </button>
          )}
          <button onClick={handleInvalidateCache} className="cache-btn">
            Clear Cache
          </button>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="content-tabs">
        <button
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Content List
        </button>
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Content
        </button>
        {selectedContentId && (
          <button
            className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit Content
          </button>
        )}
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="content-content">
        {activeTab === 'list' && (
          <div className="content-list-view">
            <div className="content-stats">
              <div className="stat-item">
                <h3>Total Content</h3>
                <p>{contentList?.data?.length || 0}</p>
              </div>
              <div className="stat-item">
                <h3>Published</h3>
                <p>{contentList?.data?.filter(c => c.status === 'published').length || 0}</p>
              </div>
              <div className="stat-item">
                <h3>Drafts</h3>
                <p>{drafts?.data?.length || 0}</p>
              </div>
              <div className="stat-item">
                <h3>Scheduled</h3>
                <p>{scheduled?.data?.length || 0}</p>
              </div>
            </div>

            <div className="content-list">
              {contentList?.data?.map(content => (
                <div key={content.id} className="content-item">
                  <h3>{content.title}</h3>
                  <p>{content.contentType}</p>
                  <p>{content.category}</p>
                  <p>Status: {content.status}</p>
                  <div className="content-actions">
                    <button onClick={() => handleContentSelect(content.id)}>
                      Edit
                    </button>
                    {content.status === 'draft' && (
                      <button onClick={() => handlePublishContent(content.id)}>
                        Publish
                      </button>
                    )}
                    <button onClick={() => handleDeleteContent(content.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleCreateContent} className="content-form">
            <h2>Create New Content</h2>
            
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={contentForm.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={contentForm.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                rows={10}
                required
              />
            </div>

            <div className="form-group">
              <label>Content Type:</label>
              <select
                value={contentForm.contentType}
                onChange={(e) => handleFormChange('contentType', e.target.value)}
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="document">Document</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                value={contentForm.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
              >
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags:</label>
              <input
                type="text"
                value={contentForm.tags.join(', ')}
                onChange={(e) => handleFormChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={contentForm.hasMedia}
                  onChange={(e) => handleFormChange('hasMedia', e.target.checked)}
                />
                Has Media
              </label>
            </div>

            <button type="submit" className="save-btn">
              Create Content
            </button>
          </form>
        )}

        {activeTab === 'edit' && selectedContentId && (
          <div className="content-edit-view">
            {content?.data ? (
              <form onSubmit={handleUpdateContent} className="content-form">
                <h2>Edit Content</h2>
                
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={contentForm.title || content.data.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content:</label>
                  <textarea
                    value={contentForm.content || content.data.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    rows={10}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={contentForm.status || content.data.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Update Content
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePublishContent(content.data.id)}
                    className="publish-btn"
                  >
                    Publish
                  </button>
                </div>
              </form>
            ) : (
              <div className="loading">Loading content...</div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && selectedContentId && (
          <div className="content-analytics-view">
            {analytics?.data ? (
              <div className="analytics-dashboard">
                <h2>Content Analytics</h2>
                
                <div className="analytics-stats">
                  <div className="stat-item">
                    <h3>Views</h3>
                    <p>{analytics.data.views || 0}</p>
                  </div>
                  <div className="stat-item">
                    <h3>Likes</h3>
                    <p>{analytics.data.likes || 0}</p>
                  </div>
                  <div className="stat-item">
                    <h3>Shares</h3>
                    <p>{analytics.data.shares || 0}</p>
                  </div>
                  <div className="stat-item">
                    <h3>Comments</h3>
                    <p>{analytics.data.comments || 0}</p>
                  </div>
                </div>

                <div className="engagement-metrics">
                  <h3>Engagement Metrics</h3>
                  <p>Engagement Rate: {((analytics.data.engagementRate || 0) * 100).toFixed(2)}%</p>
                  <p>Average Read Time: {analytics.data.averageReadTime || 0}s</p>
                  <p>Bounce Rate: {((analytics.data.bounceRate || 0) * 100).toFixed(2)}%</p>
                </div>

                <div className="moderation-status">
                  <h3>Moderation Status</h3>
                  {moderation?.data && (
                    <div>
                      <p>Status: {moderation.data.status}</p>
                      <p>Moderated By: {moderation.data.moderatedBy}</p>
                      <p>Moderated At: {moderation.data.moderatedAt?.toLocaleString()}</p>
                      {moderation.data.reason && (
                        <p>Reason: {moderation.data.reason}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="loading">Loading analytics...</div>
            )}
          </div>
        )}
      </div>

      {hasUnsavedChanges && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Don't forget to save them!
        </div>
      )}
    </div>
  );
};

export default EnterpriseContentExample;
