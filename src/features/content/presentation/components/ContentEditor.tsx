import * as React from 'react';
import { useContentDI } from '../application/services/ContentServiceDI';
import { styles } from './ContentEditor.styles';

interface ContentEditorProps {
  authorId: string;
  initialContent?: any;
  onSave?: (content: any) => void;
  className?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ 
  authorId, 
  initialContent, 
  onSave,
  className = '' 
}) => {
  const { createContent, updateContent, loading, error } = useContentDI(authorId);
  const [title, setTitle] = React.useState(initialContent?.title || '');
  const [content, setContent] = React.useState(initialContent?.content || '');
  const [contentType, setContentType] = React.useState<'post' | 'article' | 'page'>(
    initialContent?.contentType || 'post'
  );
  const [tags, setTags] = React.useState<string[]>(initialContent?.tags || []);
  const [categories, setCategories] = React.useState<string[]>(initialContent?.categories || []);
  const [visibility, setVisibility] = React.useState<'public' | 'private' | 'unlisted'>(
    initialContent?.visibility || 'public'
  );
  const [tagInput, setTagInput] = React.useState('');
  const [categoryInput, setCategoryInput] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);

  const handleSave = async (status: 'draft' | 'published') => {
    try {
      const contentData = {
        title,
        content,
        contentType,
        status,
        visibility,
        tags,
        categories,
        authorId
      };

      if (initialContent) {
        await updateContent(initialContent.id, contentData);
      } else {
        await createContent(contentData);
      }

      onSave?.(contentData);
    } catch (err) {
      console.error('Failed to save content:', err);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  const getWordCount = () => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.ceil(words / 200); // 200 words per minute
  };

  return (
    <div className={`content-editor ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          {initialContent ? 'Edit Content' : 'Create New Content'}
        </h2>
        <div style={styles.headerActions}>
          <button
            style={styles.button}
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      {/* Editor or Preview */}
      {!isPreview ? (
        <div style={styles.editor}>
          {/* Title Input */}
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title..."
              style={styles.input}
            />
          </div>

          {/* Content Type */}
          <div style={styles.field}>
            <label style={styles.label}>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              style={styles.select}
            >
              <option value="post">Post</option>
              <option value="article">Article</option>
              <option value="page">Page</option>
            </select>
          </div>

          {/* Content Editor */}
          <div style={styles.field}>
            <label style={styles.label}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={15}
              style={styles.textarea}
            />
            <div style={styles.contentStats}>
              <span>{getWordCount()} words</span>
              <span>{getReadingTime()} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div style={styles.field}>
            <label style={styles.label}>Tags</label>
            <div style={styles.tagContainer}>
              {tags.map(tag => (
                <span key={tag} style={styles.tag}>
                  {tag}
                  <button
                    style={styles.tagRemove}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <div style={styles.tagInput}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  style={styles.tagInputField}
                />
                <button
                  style={styles.tagAddButton}
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={styles.field}>
            <label style={styles.label}>Categories</label>
            <div style={styles.categoryContainer}>
              {categories.map(category => (
                <span key={category} style={styles.tag}>
                  {category}
                  <button
                    style={styles.tagRemove}
                    onClick={() => handleRemoveCategory(category)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <div style={styles.tagInput}>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Add category..."
                  style={styles.tagInputField}
                />
                <button
                  style={styles.tagAddButton}
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div style={styles.field}>
            <label style={styles.label}>Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              style={styles.select}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
        </div>
      ) : (
        <div style={styles.preview}>
          <h1 style={styles.previewTitle}>{title}</h1>
          <div style={styles.previewContent}>
            {content.split('\n').map((paragraph, index) => (
              <p key={index} style={styles.previewParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <div style={styles.previewMeta}>
            <span style={styles.previewTag}>
              Type: {contentType}
            </span>
            <span style={styles.previewTag}>
              Visibility: {visibility}
            </span>
            {tags.map(tag => (
              <span key={tag} style={styles.previewTag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => handleSave('draft')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => handleSave('published')}
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default ContentEditor;
