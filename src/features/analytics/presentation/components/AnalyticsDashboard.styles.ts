import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '1200px',
    margin: '0 auto'
  } as CSSProperties,

  loading: {
    padding: '60px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  } as CSSProperties,

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e1e4e8',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as CSSProperties,

  error: {
    padding: '20px',
    backgroundColor: '#ffeaea',
    border: '1px solid #d73a49',
    borderRadius: '8px',
    margin: '20px',
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
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  } as CSSProperties,

  header: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
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
    alignItems: 'center',
    gap: '16px'
  } as CSSProperties,

  switch: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#586069',
    cursor: 'pointer'
  } as CSSProperties,

  timeframeSelector: {
    padding: '20px 24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  timeframeButtons: {
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

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '24px'
  } as CSSProperties,

  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '20px',
    transition: 'box-shadow 0.2s ease'
  } as CSSProperties,

  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  metricTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#586069'
  } as CSSProperties,

  metricIcon: {
    fontSize: '20px'
  } as CSSProperties,

  metricValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '8px'
  } as CSSProperties,

  metricChange: {
    fontSize: '12px',
    color: '#28a745',
    fontWeight: '500'
  } as CSSProperties,

  chartsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    padding: '0 24px 24px'
  } as CSSProperties,

  chartContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '20px'
  } as CSSProperties,

  chartTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  chartPlaceholder: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#586069',
    border: '1px dashed #e1e4e8'
  } as CSSProperties,

  insightsSection: {
    padding: '0 24px 24px'
  } as CSSProperties,

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  insightCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    transition: 'box-shadow 0.2s ease'
  } as CSSProperties,

  insightHeader: {
    marginBottom: '12px'
  } as CSSProperties,

  insightTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  } as CSSProperties,

  insightTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  insightImpact: {
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase'
  } as CSSProperties,

  insightMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  insightDescription: {
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.4',
    marginBottom: '12px'
  } as CSSProperties,

  insightRecommendations: {
    borderTop: '1px solid #e1e4e8',
    paddingTop: '12px'
  } as CSSProperties,

  recommendationsTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '8px'
  } as CSSProperties,

  recommendationsList: {
    margin: 0,
    paddingLeft: '16px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  performanceSection: {
    padding: '0 24px 24px'
  } as CSSProperties,

  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  performanceCard: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  } as CSSProperties,

  performanceTitle: {
    fontSize: '12px',
    color: '#586069',
    marginBottom: '8px'
  } as CSSProperties,

  performanceValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties
};
