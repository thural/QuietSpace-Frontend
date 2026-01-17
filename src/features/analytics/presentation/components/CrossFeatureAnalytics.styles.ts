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
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  title: {
    margin: '0 0 4px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  realTimeSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  } as CSSProperties,

  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '20px',
    transition: 'box-shadow 0.2s ease'
  } as CSSProperties,

  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#586069'
  } as CSSProperties,

  statIcon: {
    fontSize: '20px'
  } as CSSProperties,

  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '8px'
  } as CSSProperties,

  statChange: {
    fontSize: '12px',
    color: '#28a745',
    fontWeight: '500'
  } as CSSProperties,

  integrationSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  matrixGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  matrixCard: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  } as CSSProperties,

  matrixHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px'
  } as CSSProperties,

  matrixIcon: {
    fontSize: '24px'
  } as CSSProperties,

  matrixTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  matrixValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '4px'
  } as CSSProperties,

  matrixDescription: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  metricsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  } as CSSProperties,

  metricTitle: {
    fontSize: '12px',
    color: '#586069',
    marginBottom: '8px'
  } as CSSProperties,

  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  metricDescription: {
    fontSize: '11px',
    color: '#586069'
  } as CSSProperties,

  healthSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  } as CSSProperties,

  healthCard: {
    backgroundColor: '#ffffff',
    border: '2px solid',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  healthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  healthTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  healthStatus: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  healthMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  insightsSection: {
    padding: '24px'
  } as CSSProperties,

  insightsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  insightCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  } as CSSProperties,

  insightTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  insightImpact: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  insightDescription: {
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.4',
    marginBottom: '12px'
  } as CSSProperties,

  insightRecommendation: {
    fontSize: '12px',
    color: '#007bff',
    fontStyle: 'italic',
    padding: '8px',
    backgroundColor: '#f0f8ff',
    borderRadius: '4px',
    borderLeft: '3px solid #007bff'
  } as CSSProperties
};
