import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '1400px',
    margin: '0 auto'
  } as CSSProperties,

  header: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as CSSProperties,

  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  } as CSSProperties,

  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center'
  } as CSSProperties,

  button: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  buttonActive: {
    backgroundColor: '#007bff'
  } as CSSProperties,

  templateSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  templateCard: {
    border: '2px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  } as CSSProperties,

  templateCardActive: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff'
  } as CSSProperties,

  templateIcon: {
    fontSize: '32px'
  } as CSSProperties,

  templateContent: {
    flex: 1
  } as CSSProperties,

  templateName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  templateDescription: {
    fontSize: '14px',
    color: '#586069',
    lineHeight: '1.4'
  } as CSSProperties,

  configSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  configGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  } as CSSProperties,

  configColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  } as CSSProperties,

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  } as CSSProperties,

  fieldLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292e'
  } as CSSProperties,

  input: {
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  textarea: {
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  select: {
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  timeInput: {
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  scheduleGroup: {
    display: 'flex',
    gap: '12px'
  } as CSSProperties,

  sectionsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  sectionsBuilder: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  } as CSSProperties,

  sectionsPanel: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  panelTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  sectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  } as CSSProperties,

  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  sectionIcon: {
    fontSize: '20px'
  } as CSSProperties,

  sectionInfo: {
    flex: 1,
    minWidth: 0
  } as CSSProperties,

  sectionName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292e',
    marginBottom: '2px'
  } as CSSProperties,

  sectionDescription: {
    fontSize: '12px',
    color: '#586069',
    lineHeight: '1.3'
  } as CSSProperties,

  selectedSections: {
    minHeight: '200px',
    backgroundColor: '#ffffff',
    border: '2px dashed #007bff',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#586069'
  } as CSSProperties,

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  } as CSSProperties,

  emptyText: {
    fontSize: '14px',
    textAlign: 'center'
  } as CSSProperties,

  selectedSection: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px'
  } as CSSProperties,

  selectedSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  } as CSSProperties,

  selectedSectionTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  removeButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  sectionOrder: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  actionsSection: {
    padding: '24px',
    borderTop: '1px solid #e1e4e8'
  } as CSSProperties,

  actionsGrid: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  } as CSSProperties,

  primaryButton: {
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

  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  tertiaryButton: {
    padding: '12px 24px',
    backgroundColor: '#f8f9fa',
    color: '#24292e',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  existingReports: {
    padding: '24px'
  } as CSSProperties,

  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  reportCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  reportTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  reportStatus: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  reportDescription: {
    fontSize: '14px',
    color: '#586069',
    marginBottom: '12px',
    lineHeight: '1.4'
  } as CSSProperties,

  reportMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#586069',
    flexWrap: 'wrap'
  } as CSSProperties
};
