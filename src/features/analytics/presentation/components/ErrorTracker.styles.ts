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

  toggleButton: {
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

  toggleButtonActive: {
    backgroundColor: '#dc3545'
  } as CSSProperties,

  controls: {
    padding: '20px 24px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  } as CSSProperties,

  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  } as CSSProperties,

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292e',
    marginBottom: '8px'
  } as CSSProperties,

  buttonGroup: {
    display: 'flex',
    gap: '8px'
  } as CSSProperties,

  timeframeButton: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  timeframeButtonActive: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderColor: '#007bff'
  } as CSSProperties,

  levelButton: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  levelButtonActive: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderColor: '#007bff'
  } as CSSProperties,

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  statsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  statLabel: {
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  statIcon: {
    fontSize: '20px'
  } as CSSProperties,

  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  statDescription: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  trendSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  trendChart: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px'
  } as CSSProperties,

  trendBars: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    height: '150px'
  } as CSSProperties,

  trendBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  trendBarFill: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease'
  } as CSSProperties,

  trendLabel: {
    fontSize: '12px',
    color: '#586069',
    textAlign: 'center'
  } as CSSProperties,

  eventsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  } as CSSProperties,

  eventCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '16px'
  } as CSSProperties,

  eventLevel: {
    display: 'flex',
    alignItems: 'center'
  } as CSSProperties,

  levelBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  } as CSSProperties,

  eventMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'right'
  } as CSSProperties,

  eventTime: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  eventFeature: {
    fontSize: '12px',
    color: '#586069',
    fontWeight: '500'
  } as CSSProperties,

  eventMessage: {
    fontSize: '14px',
    color: '#24292e',
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontFamily: 'monospace'
  } as CSSProperties,

  eventDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
    marginBottom: '12px'
  } as CSSProperties,

  eventDetail: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px'
  } as CSSProperties,

  detailLabel: {
    color: '#586069',
    minWidth: '60px'
  } as CSSProperties,

  detailValue: {
    color: '#24292e',
    fontFamily: 'monospace',
    fontSize: '11px'
  } as CSSProperties,

  eventResolution: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '8px'
  } as CSSProperties,

  resolutionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  } as CSSProperties,

  resolutionIcon: {
    fontSize: '16px'
  } as CSSProperties,

  resolutionText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#155724'
  } as CSSProperties,

  recoveryAction: {
    fontSize: '12px',
    color: '#155724',
    fontStyle: 'italic'
  } as CSSProperties,

  resolutionTime: {
    fontSize: '11px',
    color: '#155724'
  } as CSSProperties,

  eventActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  } as CSSProperties,

  resolveButton: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  investigateButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  recoverySection: {
    padding: '24px'
  } as CSSProperties,

  strategiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  strategyCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  strategyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  strategyName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  strategyToggle: {
    display: 'flex',
    alignItems: 'center'
  } as CSSProperties,

  toggleCheckbox: {
    width: '16px',
    height: '16px'
  } as CSSProperties,

  strategyDescription: {
    fontSize: '14px',
    color: '#586069',
    lineHeight: '1.4',
    marginBottom: '16px'
  } as CSSProperties,

  strategyConfig: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  } as CSSProperties,

  configItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  } as CSSProperties,

  configInput: {
    padding: '6px 8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%'
  } as CSSProperties
};
