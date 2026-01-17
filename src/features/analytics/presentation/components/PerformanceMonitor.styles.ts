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
    backgroundColor: '#28a745'
  } as CSSProperties,

  controls: {
    padding: '20px 24px',
    borderBottom: '1px solid #e1e4e8'
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

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  metricsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    transition: 'box-shadow 0.2s ease'
  } as CSSProperties,

  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  metricName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#586069'
  } as CSSProperties,

  metricTrend: {
    fontSize: '16px'
  } as CSSProperties,

  metricValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '8px'
  } as CSSProperties,

  metricNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  metricUnit: {
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  metricStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  } as CSSProperties,

  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  } as CSSProperties,

  statusText: {
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase'
  } as CSSProperties,

  metricChart: {
    height: '40px',
    marginTop: '8px'
  } as CSSProperties,

  featureSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  featureCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  featureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  } as CSSProperties,

  featureName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  featureStatus: {
    display: 'flex',
    alignItems: 'center'
  } as CSSProperties,

  featureMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  } as CSSProperties,

  featureMetric: {
    textAlign: 'center'
  } as CSSProperties,

  metricLabel: {
    fontSize: '12px',
    color: '#586069',
    marginBottom: '4px'
  } as CSSProperties,

  alertsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  } as CSSProperties,

  alertCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  alertHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  } as CSSProperties,

  alertIcon: {
    fontSize: '20px',
    marginTop: '2px'
  } as CSSProperties,

  alertInfo: {
    flex: 1
  } as CSSProperties,

  alertTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  alertDescription: {
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.4'
  } as CSSProperties,

  alertMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'right'
  } as CSSProperties,

  alertFeature: {
    fontSize: '12px',
    color: '#586069',
    fontWeight: '500'
  } as CSSProperties,

  alertTime: {
    fontSize: '11px',
    color: '#586069'
  } as CSSProperties,

  alertActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  } as CSSProperties,

  alertAction: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  recommendationsSection: {
    padding: '24px'
  } as CSSProperties,

  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  recommendationCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  } as CSSProperties,

  recommendationIcon: {
    fontSize: '24px'
  } as CSSProperties,

  recommendationTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  recommendationDescription: {
    fontSize: '14px',
    color: '#586069',
    lineHeight: '1.4',
    marginBottom: '12px'
  } as CSSProperties,

  recommendationImpact: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  impactLabel: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  impactValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties
};
