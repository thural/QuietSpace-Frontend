import * as React from 'react';
import { useContentDI } from '../application/services/ContentServiceDI';
import { styles } from './MediaUpload.styles';

interface MediaUploadProps {
  authorId: string;
  onUpload?: (files: any[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ 
  authorId, 
  onUpload,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  className = '' 
}) => {
  const { uploadMedia } = useContentDI(authorId);
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).slice(0, maxFiles);
    setFiles(newFiles);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => uploadMedia(file));
      const uploadedFiles = await Promise.all(uploadPromises);
      
      setFiles([]);
      onUpload?.(uploadedFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    return '📎';
  };

  return (
    <div className={`media-upload ${className}`} style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Upload Media</h3>
        <span style={styles.subtitle}>
          Max {maxFiles} files • {acceptedTypes.join(', ')}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        style={{
          ...styles.uploadArea,
          ...(dragActive ? styles.uploadAreaActive : {})
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={styles.uploadContent}>
          <div style={styles.uploadIcon}>📁</div>
          <div style={styles.uploadText}>
            <div style={styles.uploadTitle}>
              {dragActive ? 'Drop files here' : 'Drag & drop files here'}
            </div>
            <div style={styles.uploadSubtitle}>
              or click to browse
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={styles.fileInput}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div style={styles.fileList}>
          <h4 style={styles.fileListTitle}>Selected Files</h4>
          {files.map((file, index) => (
            <div key={index} style={styles.fileItem}>
              <div style={styles.fileIcon}>
                {getFileIcon(file.type)}
              </div>
              <div style={styles.fileInfo}>
                <div style={styles.fileName}>{file.name}</div>
                <div style={styles.fileSize}>{formatFileSize(file.size)}</div>
              </div>
              <button
                style={styles.removeButton}
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div style={styles.actions}>
          <button
            style={{
              ...styles.button,
              ...(uploading ? styles.buttonDisabled : {})
            }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <div style={styles.progressText}>Uploading files...</div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
