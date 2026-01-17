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

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  modelSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  modelControls: {
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

  modelButton: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  modelButtonActive: {
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

  predictionSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  predictionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    gap: '24px'
  } as CSSProperties,

  predictionInfo: {
    flex: 1
  } as CSSProperties,

  currentValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px'
  } as CSSProperties,

  currentLabel: {
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  currentNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  accuracy: {
    textAlign: 'right'
  } as CSSProperties,

  accuracyLabel: {
    fontSize: '14px',
    color: '#586069',
    marginRight: '8px'
  } as CSSProperties,

  accuracyValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa'
  } as CSSProperties,

  predictionDescription: {
    fontSize: '14px',
    color: '#586069',
    lineHeight: '1.4',
    maxWidth: '400px'
  } as CSSProperties,

  predictionChart: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px'
  } as CSSProperties,

  chartLegend: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px'
  } as CSSProperties,

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px'
  } as CSSProperties,

  chartArea: {
    display: 'flex',
    gap: '4px',
    height: '200px',
    alignItems: 'flex-end'
  } as CSSProperties,

  barContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative'
  } as CSSProperties,

  predictionBar: {
    width: '100%',
    backgroundColor: '#007bff',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease'
  } as CSSProperties,

  confidenceBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as CSSProperties,

  bandUpper: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    borderRadius: '4px 4px 0 0'
  } as CSSProperties,

  bandLower: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    borderRadius: '0 0 4px 4px'
  } as CSSProperties,

  barLabel: {
    position: 'absolute',
    bottom: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '12px',
    color: '#586069',
    whiteSpace: 'nowrap'
  } as CSSProperties,

  factorsSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  factorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  } as CSSProperties,

  factorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px'
  } as CSSProperties,

  factorIcon: {
    fontSize: '20px'
  } as CSSProperties,

  factorName: {
    fontSize: '14px',
    color: '#24292e'
  } as CSSProperties,

  abTestSection: {
    padding: '24px'
  } as CSSProperties,

  subsectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  testCreation: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  } as CSSProperties,

  testForm: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end'
  } as CSSProperties,

  formRow: {
    display: 'flex',
    gap: '16px',
    flex: 1
  } as CSSProperties,

  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
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

  select: {
    padding: '12px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease'
  } as CSSProperties,

  createButton: {
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

  activeTests: {
    backgroundColor: '#ffffff'
  } as CSSProperties,

  testsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  testCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  } as CSSProperties,

  testName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  testStatus: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#ffffff'
  } as CSSProperties,

  testVariants: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  } as CSSProperties,

  variant: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px'
  } as CSSProperties,

  variantName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '8px'
  } as CSSProperties,

  variantMetrics: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  testResults: {
    borderTop: '1px solid #e1e4e8',
    paddingTop: '12px'
  } as CSSProperties,

  winnerAnnouncement: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px'
  } as CSSProperties,

  winnerLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: '4px'
  } as CSSProperties,

  winnerName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#155724'
  } as CSSProperties,

  winnerConfidence: {
    fontSize: '12px',
    color: '#155724'
  } as CSSProperties,

  runningStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties
};
