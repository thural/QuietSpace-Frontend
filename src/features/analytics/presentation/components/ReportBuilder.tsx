import * as React from 'react';
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { styles } from './ReportBuilder.styles.ts';

interface ReportBuilderProps {
  userId: string;
  className?: string;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { generateReportData, getReportsByUser } = useAnalyticsDI(userId);
  const [reports, setReports] = React.useState<any[]>([]);
  const [isBuilding, setIsBuilding] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('summary');
  const [reportConfig, setReportConfig] = React.useState({
    name: '',
    description: '',
    type: 'summary' as 'summary' | 'detailed' | 'trend' | 'custom',
    schedule: {
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'on_demand',
      time: '09:00',
      timezone: 'UTC'
    },
    recipients: [],
    sections: []
  });

  // Load existing reports
  React.useEffect(() => {
    const loadReports = async () => {
      try {
        const userReports = await getReportsByUser();
        setReports(userReports);
      } catch (err) {
        console.error('Failed to load reports:', err);
      }
    };

    loadReports();
  }, [getReportsByUser]);

  const reportTemplates = [
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level overview with key metrics and insights',
      icon: '📊',
      sections: ['overview', 'metrics', 'insights', 'recommendations']
    },
    {
      id: 'detailed',
      name: 'Detailed Analytics',
      description: 'Comprehensive analysis with all available data',
      icon: '📈',
      sections: ['traffic', 'engagement', 'performance', 'errors']
    },
    {
      id: 'trend',
      name: 'Trend Analysis',
      description: 'Historical trends and predictive analytics',
      icon: '📉',
      sections: ['trends', 'forecasts', 'comparisons', 'anomalies']
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build your own custom report',
      icon: '🔧',
      sections: []
    }
  ];

  const availableSections = [
    { id: 'overview', name: 'Overview', icon: '👁️', description: 'System overview and health status' },
    { id: 'metrics', name: 'Key Metrics', icon: '📊', description: 'Core performance indicators' },
    { id: 'insights', name: 'AI Insights', icon: '💡', description: 'Machine learning insights' },
    { id: 'recommendations', name: 'Recommendations', icon: '🎯', description: 'Actionable recommendations' },
    { id: 'traffic', name: 'Traffic Analysis', icon: '🚦', description: 'User traffic patterns' },
    { id: 'engagement', name: 'Engagement Metrics', icon: '💬', description: 'User engagement data' },
    { id: 'performance', name: 'Performance', icon: '⚡', description: 'System performance metrics' },
    { id: 'errors', name: 'Error Analysis', icon: '⚠️', description: 'Error patterns and rates' },
    { id: 'trends', name: 'Trends', icon: '📈', description: 'Historical trend analysis' },
    { id: 'forecasts', name: 'Forecasts', icon: '🔮', description: 'Predictive analytics' },
    { id: 'comparisons', name: 'Comparisons', icon: '⚖️', description: 'Period-over-period comparisons' },
    { id: 'anomalies', name: 'Anomalies', icon: '🚨', description: 'Anomaly detection results' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportConfig(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        sections: template.sections.map(sectionId => ({
          id: sectionId,
          type: 'auto',
          title: availableSections.find(s => s.id === sectionId)?.name || sectionId,
          order: template.sections.indexOf(sectionId)
        }))
      }));
    }
  };

  const handleAddSection = (sectionId: string) => {
    const section = availableSections.find(s => s.id === sectionId);
    if (section) {
      setReportConfig(prev => ({
        ...prev,
        sections: [...prev.sections, {
          id: sectionId,
          type: 'manual',
          title: section.name,
          order: prev.sections.length
        }]
      }));
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const handleSaveReport = async () => {
    try {
      // In a real implementation, this would save the report configuration
      console.log('Saving report configuration:', reportConfig);
      
      // Generate preview
      const reportData = await generateReportData({
        id: 'temp',
        userId,
        name: reportConfig.name,
        description: reportConfig.description,
        type: reportConfig.type,
        schedule: reportConfig.schedule,
        recipients: reportConfig.recipients,
        template: {
          sections: reportConfig.sections,
          branding: {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            fontFamily: 'Inter',
            includeWatermark: false
          }
        },
        filters: {
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date()
          },
          dimensions: [],
          metrics: [],
          segments: []
        },
        format: 'pdf' as 'pdf' | 'excel' | 'csv' | 'json',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Generated report data:', reportData);
    } catch (err) {
      console.error('Failed to save report:', err);
    }
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report:', reportConfig);
    // In a real implementation, this would set up the scheduling
  };

  return (
    <div className={`report-builder ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Advanced Report Builder</h2>
          <span style={styles.subtitle}>
            Create custom reports with drag-and-drop interface
          </span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.button,
              ...(isBuilding ? styles.buttonActive : {})
            }}
            onClick={() => setIsBuilding(!isBuilding)}
          >
            {isBuilding ? '🔧 Building' : '📝 Build Mode'}
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div style={styles.templateSection}>
        <h3 style={styles.sectionTitle}>Choose Template</h3>
        <div style={styles.templateGrid}>
          {reportTemplates.map(template => (
            <div
              key={template.id}
              style={{
                ...styles.templateCard,
                ...(selectedTemplate === template.id ? styles.templateCardActive : {})
              }}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div style={styles.templateIcon}>{template.icon}</div>
              <div style={styles.templateContent}>
                <div style={styles.templateName}>{template.name}</div>
                <div style={styles.templateDescription}>{template.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Configuration */}
      <div style={styles.configSection}>
        <h3 style={styles.sectionTitle}>Report Configuration</h3>
        <div style={styles.configGrid}>
          <div style={styles.configColumn}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Report Name</label>
              <input
                type="text"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                style={styles.input}
                placeholder="Enter report name..."
              />
            </div>
            
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Description</label>
              <textarea
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                style={styles.textarea}
                placeholder="Describe your report..."
                rows={3}
              />
            </div>
          </div>

          <div style={styles.configColumn}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Schedule</label>
              <div style={styles.scheduleGroup}>
                <select
                  value={reportConfig.schedule.frequency}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, frequency: e.target.value as any }
                  }))}
                  style={styles.select}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="on_demand">On Demand</option>
                </select>
                
                <input
                  type="time"
                  value={reportConfig.schedule.time}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, time: e.target.value }
                  }))}
                  style={styles.timeInput}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.fieldLabel}>Recipients</label>
              <input
                type="email"
                value={reportConfig.recipients.join(', ')}
                onChange={(e) => setReportConfig(prev => ({
                  ...prev,
                  recipients: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                }))}
                style={styles.input}
                placeholder="Enter email addresses (comma separated)..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Sections Builder */}
      <div style={styles.sectionsSection}>
        <h3 style={styles.sectionTitle}>Report Sections</h3>
        <div style={styles.sectionsBuilder}>
          <div style={styles.sectionsPanel}>
            <h4 style={styles.panelTitle}>Available Sections</h4>
            <div style={styles.sectionsList}>
              {availableSections.map(section => (
                <div
                  key={section.id}
                  style={styles.sectionItem}
                  onClick={() => handleAddSection(section.id)}
                >
                  <span style={styles.sectionIcon}>{section.icon}</span>
                  <div style={styles.sectionInfo}>
                    <div style={styles.sectionName}>{section.name}</div>
                    <div style={styles.sectionDescription}>{section.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.sectionsPanel}>
            <h4 style={styles.panelTitle}>Selected Sections</h4>
            <div style={styles.selectedSections}>
              {reportConfig.sections.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📋</div>
                  <div style={styles.emptyText}>
                    Drag sections here or click to add them
                  </div>
                </div>
              ) : (
                reportConfig.sections.map((section, index) => (
                  <div key={section.id} style={styles.selectedSection}>
                    <div style={styles.selectedSectionHeader}>
                      <span style={styles.selectedSectionTitle}>
                        {availableSections.find(s => s.id === section.id)?.icon} {section.title}
                      </span>
                      <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveSection(section.id)}
                      >
                        ×
                      </button>
                    </div>
                    <div style={styles.sectionOrder}>Order: {index + 1}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsSection}>
        <div style={styles.actionsGrid}>
          <button
            style={styles.primaryButton}
            onClick={handleSaveReport}
          >
            💾 Save Report
          </button>
          
          <button
            style={styles.secondaryButton}
            onClick={handleScheduleReport}
          >
            ⏰ Schedule Report
          </button>
          
          <button
            style={styles.tertiaryButton}
          >
            👁️ Preview Report
          </button>
          
          <button
            style={styles.tertiaryButton}
          >
            📥 Export Template
          </button>
        </div>
      </div>

      {/* Existing Reports */}
      {reports.length > 0 && (
        <div style={styles.existingReports}>
          <h3 style={styles.sectionTitle}>Existing Reports</h3>
          <div style={styles.reportsGrid}>
            {reports.map(report => (
              <div key={report.id} style={styles.reportCard}>
                <div style={styles.reportHeader}>
                  <div style={styles.reportTitle}>{report.name}</div>
                  <div style={styles.reportStatus}>
                    {report.isActive ? '🟢 Active' : '⏸️ Inactive'}
                  </div>
                </div>
                <div style={styles.reportDescription}>{report.description}</div>
                <div style={styles.reportMeta}>
                  <span>Type: {report.type}</span>
                  <span>Schedule: {report.schedule?.frequency || 'Manual'}</span>
                  <span>Last run: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
