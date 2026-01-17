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

  chartButton: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  chartButtonActive: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderColor: '#007bff'
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

  chartArea: {
    padding: '24px'
  } as CSSProperties,

  chartContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    overflow: 'hidden'
  } as CSSProperties,

  chartHeader: {
    padding: '20px',
    borderBottom: '1px solid #e1e4e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as CSSProperties,

  chartTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  chartActions: {
    display: 'flex',
    gap: '8px'
  } as CSSProperties,

  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  chartPlaceholder: {
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  } as CSSProperties,

  mockChart: {
    width: '100%',
    height: '100%'
  } as CSSProperties,

  chartLegend: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '20px',
    textAlign: 'center'
  } as CSSProperties,

  lineChart: {
    width: '100%'
  } as CSSProperties,

  dataPoints: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '200px'
  } as CSSProperties,

  dataPoint: {
    width: '20px',
    height: '20px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 'bold'
  } as CSSProperties,

  barChart: {
    width: '100%'
  } as CSSProperties,

  barContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '200px'
  } as CSSProperties,

  barItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  barLabel: {
    fontSize: '12px',
    color: '#586069',
    textAlign: 'center'
  } as CSSProperties,

  barValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  pieChart: {
    width: '100%'
  } as CSSProperties,

  pieContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    height: '200px'
  } as CSSProperties,

  pieSlice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  pieSegment: {
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  } as CSSProperties,

  pieLabel: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  statistics: {
    padding: '24px',
    borderTop: '1px solid #e1e4e8'
  } as CSSProperties,

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  statCard: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    padding: '16px',
    textAlign: 'center'
  } as CSSProperties,

  statLabel: {
    fontSize: '12px',
    color: '#586069',
    marginBottom: '8px'
  } as CSSProperties,

  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties
};
