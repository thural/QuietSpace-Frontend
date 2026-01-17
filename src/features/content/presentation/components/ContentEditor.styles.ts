import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '800px',
    margin: '0 auto'
  } as CSSProperties,

  header: {
    padding: '20px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  headerActions: {
    display: 'flex',
    gap: '8px'
  } as CSSProperties,

  error: {
    padding: '16px',
    backgroundColor: '#ffeaea',
    border: '1px solid #d73a49',
    borderRadius: '6px',
    margin: '16px',
    color: '#d73a49'
  } as CSSProperties,

  editor: {
    padding: '20px'
  } as CSSProperties,

  field: {
    marginBottom: '20px'
  } as CSSProperties,

  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  contentStats: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center'
  } as CSSProperties,

  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#e1e4e8',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#24292e'
  } as CSSProperties,

  tagRemove: {
    background: 'none',
    border: 'none',
    color: '#586069',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    lineHeight: '1'
  } as CSSProperties,

  tagInput: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  } as CSSProperties,

  tagInputField: {
    padding: '6px 8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '12px',
    outline: 'none',
    minWidth: '120px'
  } as CSSProperties,

  tagAddButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  categoryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center'
  } as CSSProperties,

  preview: {
    padding: '20px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  previewTitle: {
    margin: '0 0 20px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#24292e',
    lineHeight: '1.2'
  } as CSSProperties,

  previewContent: {
    marginBottom: '20px',
    lineHeight: '1.6',
    color: '#24292e'
  } as CSSProperties,

  previewParagraph: {
    margin: '0 0 16px 0',
    lineHeight: '1.6'
  } as CSSProperties,

  previewMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    paddingTop: '20px',
    borderTop: '1px solid #e1e4e8'
  } as CSSProperties,

  previewTag: {
    padding: '4px 8px',
    backgroundColor: '#e1e4e8',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  actions: {
    padding: '20px',
    borderTop: '1px solid #e1e4e8',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  } as CSSProperties,

  button: {
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none'
  } as CSSProperties,

  primaryButton: {
    backgroundColor: '#007bff',
    color: '#ffffff'
  } as CSSProperties,

  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#ffffff'
  } as CSSProperties
};
