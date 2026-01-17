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
    backgroundColor: '#007bff'
  } as CSSProperties,

  cacheSelection: {
    padding: '20px 24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  cacheTabs: {
    display: 'flex',
    gap: '8px'
  } as CSSProperties,

  cacheTab: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  cacheTabActive: {
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

  entriesSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  entriesTable: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    overflow: 'hidden'
  } as CSSProperties,

  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
    backgroundColor: '#f8f9fa',
    padding: '12px 16px',
    borderBottom: '1px solid #e1e4e8',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
    padding: '12px 16px',
    borderBottom: '1px solid #e1e4e8',
    alignItems: 'center'
  } as CSSProperties,

  tableCell: {
    display: 'flex',
    alignItems: 'center'
  } as CSSProperties,

  cacheKey: {
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #e1e4e8'
  } as CSSProperties,

  cacheType: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  } as CSSProperties,

  hitMissRatio: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  } as CSSProperties,

  hits: {
    color: '#28a745',
    fontWeight: 'bold'
  } as CSSProperties,

  misses: {
    color: '#dc3545'
  } as CSSProperties,

  separator: {
    color: '#586069'
  } as CSSProperties,

  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'uppercase'
  } as CSSProperties,

  actionButton: {
    padding: '4px 8px',
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as CSSProperties,

  policiesSection: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8'
  } as CSSProperties,

  policiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  policyCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px'
  } as CSSProperties,

  policyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  } as CSSProperties,

  policyName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e'
  } as CSSProperties,

  policyType: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#586069'
  } as CSSProperties,

  policySettings: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  } as CSSProperties,

  setting: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  } as CSSProperties,

  settingLabel: {
    fontSize: '14px',
    color: '#24292e',
    minWidth: '80px'
  } as CSSProperties,

  settingInput: {
    padding: '6px 8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '14px',
    width: '80px'
  } as CSSProperties,

  settingSelect: {
    padding: '6px 8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100px'
  } as CSSProperties,

  settingCheckbox: {
    width: '16px',
    height: '16px'
  } as CSSProperties,

  settingUnit: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties,

  actionsSection: {
    padding: '24px'
  } as CSSProperties,

  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  } as CSSProperties,

  actionCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  } as CSSProperties,

  actionIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  } as CSSProperties,

  actionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#24292e',
    marginBottom: '4px'
  } as CSSProperties,

  actionDescription: {
    fontSize: '12px',
    color: '#586069'
  } as CSSProperties
};
