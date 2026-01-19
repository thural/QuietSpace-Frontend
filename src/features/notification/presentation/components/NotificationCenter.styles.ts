import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '400px',
    maxHeight: '600px',
    display: 'flex',
    flexDirection: 'column'
  } as CSSProperties,

  header: {
    padding: '16px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  headerRight: {
    display: 'flex',
    gap: '8px'
  } as CSSProperties,

  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  badge: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold'
  } as CSSProperties,

  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  dropdown: {
    position: 'absolute',
    top: '60px',
    right: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '16px',
    zIndex: 1000,
    minWidth: '200px'
  } as CSSProperties,

  dropdownTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  dropdownButton: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    margin: '4px 0',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  filters: {
    padding: '16px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  } as CSSProperties,

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '120px'
  } as CSSProperties,

  filterLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#586069'
  } as CSSProperties,

  select: {
    padding: '6px 8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#ffffff'
  } as CSSProperties,

  loading: {
    padding: '32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  } as CSSProperties,

  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid #e1e4e8',
    borderTop: '2px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as CSSProperties,

  error: {
    padding: '16px',
    backgroundColor: '#ffeaea',
    border: '1px solid #d73a49',
    borderRadius: '6px',
    margin: '16px',
    color: '#d73a49',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as CSSProperties,

  retryButton: {
    backgroundColor: '#d73a49',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer'
  } as CSSProperties,

  notificationsList: {
    flex: 1,
    overflowY: 'auto'
  } as CSSProperties,

  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: '#586069',
    fontSize: '16px'
  } as CSSProperties,

  notificationItem: {
    padding: '16px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  notificationContent: {
    flex: 1,
    minWidth: 0
  } as CSSProperties,

  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  } as CSSProperties,

  notificationIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center'
  } as CSSProperties,

  notificationTitle: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e',
    lineHeight: '1.3'
  } as CSSProperties,

  notificationTime: {
    fontSize: '12px',
    color: '#586069',
    whiteSpace: 'nowrap'
  } as CSSProperties,

  notificationMessage: {
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.4',
    marginBottom: '8px'
  } as CSSProperties,

  notificationActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  } as CSSProperties,

  actionButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  deleteButton: {
    backgroundColor: 'transparent',
    color: '#586069',
    border: 'none',
    borderRadius: '4px',
    padding: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  } as CSSProperties
};
