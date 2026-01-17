import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '600px',
    margin: '0 auto'
  } as CSSProperties,

  header: {
    padding: '20px',
    borderBottom: '1px solid #e1e4e8',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  title: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  error: {
    padding: '16px',
    backgroundColor: '#ffeaea',
    border: '1px solid #d73a49',
    borderRadius: '6px',
    margin: '16px',
    color: '#d73a49'
  } as CSSProperties,

  uploadArea: {
    border: '2px dashed #e1e4e8',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fafbfc'
  } as CSSProperties,

  uploadAreaActive: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff'
  } as CSSProperties,

  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  } as CSSProperties,

  uploadIcon: {
    fontSize: '48px',
    marginBottom: '8px'
  } as CSSProperties,

  uploadText: {
    textAlign: 'center'
  } as CSSProperties,

  uploadTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  uploadSubtitle: {
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  fileInput: {
    display: 'none'
  } as CSSProperties,

  fileList: {
    padding: '20px',
    borderTop: '1px solid #e1e4e8'
  } as CSSProperties,

  fileListTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '8px'
  } as CSSProperties,

  fileIcon: {
    fontSize: '24px',
    width: '32px',
    textAlign: 'center'
  } as CSSProperties,

  fileInfo: {
    flex: 1,
    minWidth: 0
  } as CSSProperties,

  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292e',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  } as CSSProperties,

  fileSize: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  removeButton: {
    background: 'none',
    border: 'none',
    color: '#d73a49',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  actions: {
    padding: '20px',
    borderTop: '1px solid #e1e4e8',
    textAlign: 'center'
  } as CSSProperties,

  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  } as CSSProperties,

  progress: {
    padding: '20px',
    borderTop: '1px solid #e1e4e8'
  } as CSSProperties,

  progressBar: {
    height: '4px',
    backgroundColor: '#e1e4e8',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '12px'
  } as CSSProperties,

  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    width: '60%',
    animation: 'progress 2s ease-in-out infinite'
  } as CSSProperties,

  progressText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties
};
