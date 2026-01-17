import * as React from 'react';
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { styles } from './PredictiveAnalytics.styles.ts';

interface PredictiveAnalyticsProps {
  userId: string;
  className?: string;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, getInsights } = useAnalyticsDI(userId);
  const [selectedModel, setSelectedModel] = React.useState<'traffic' | 'engagement' | 'conversion' | 'retention'>('traffic');
  const [timeframe, setTimeframe] = React.useState<'7d' | '30d' | '90d'>('30d');
  const [abTests, setAbTests] = React.useState<any[]>([]);

  // Generate predictive data based on selected model
  const generatePredictions = React.useCallback(() => {
    const baseValue = metrics?.uniqueUsers || 1000;
    const growthRate = 0.05; // 5% growth rate
    const volatility = 0.1; // 10% volatility

    switch (selectedModel) {
      case 'traffic':
        return {
          title: 'Traffic Prediction',
          description: 'Predicted user traffic based on historical data',
          current: baseValue,
          predictions: Array.from({ length: 30 }, (_, i) => {
            const randomFactor = 1 + (Math.random() - 0.5) * volatility;
            const trend = Math.pow(1 + growthRate, i / 30);
            return {
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
              value: Math.floor(baseValue * trend * randomFactor),
              confidence: Math.max(0.5, 1 - (i / 30) * 0.3)
            };
          }),
          accuracy: 87.3,
          factors: ['Historical trends', 'Seasonal patterns', 'Growth rate', 'Market conditions']
        };

      case 'engagement':
        return {
          title: 'Engagement Prediction',
          description: 'Predicted user engagement metrics',
          current: metrics?.userEngagement || 65,
          predictions: Array.from({ length: 30 }, (_, i) => {
            const baseEngagement = metrics?.userEngagement || 65;
            const trend = baseEngagement + (Math.random() - 0.5) * 10;
            return {
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
              value: Math.max(0, Math.min(100, trend)),
              confidence: Math.max(0.6, 1 - (i / 30) * 0.2)
            };
          }),
          accuracy: 82.1,
          factors: ['Content quality', 'User behavior', 'Feature adoption', 'Time of day']
        };

      case 'conversion':
        return {
          title: 'Conversion Prediction',
          description: 'Predicted conversion rates and funnel performance',
          current: metrics?.conversionRate || 3.2,
          predictions: Array.from({ length: 30 }, (_, i) => {
            const baseConversion = metrics?.conversionRate || 3.2;
            const trend = baseConversion + (Math.random() - 0.5) * 2;
            return {
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
              value: Math.max(0, trend),
              confidence: Math.max(0.4, 1 - (i / 30) * 0.4)
            };
          }),
          accuracy: 78.5,
          factors: ['Landing page performance', 'User intent', 'Seasonal trends', 'Marketing campaigns']
        };

      case 'retention':
        return {
          title: 'Retention Prediction',
          description: 'Predicted user retention and churn rates',
          current: 85.6,
          predictions: Array.from({ length: 30 }, (_, i) => {
            const baseRetention = 85.6;
            const churnRisk = (i / 30) * 15; // Increasing churn risk over time
            const trend = baseRetention - churnRisk + (Math.random() - 0.5) * 5;
            return {
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
              value: Math.max(0, Math.min(100, trend)),
              confidence: Math.max(0.3, 1 - (i / 30) * 0.5)
            };
          }),
          accuracy: 79.2,
          factors: ['User satisfaction', 'Feature usage', 'Support interactions', 'Competitor activity']
        };

      default:
        return { title: '', description: '', current: 0, predictions: [], accuracy: 0, factors: [] };
    }
  }, [selectedModel, metrics]);

  const predictions = generatePredictions();

  // A/B Test data
  const sampleAbTests = [
    {
      id: 'test-001',
      name: 'Homepage Layout A/B Test',
      status: 'running',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      variants: [
        { name: 'Control', traffic: 45, conversion: 3.2 },
        { name: 'Variant A', traffic: 55, conversion: 4.1 }
      ],
      significance: 0.95,
      winner: null,
      confidence: 87
    },
    {
      id: 'test-002',
      name: 'CTA Button Color Test',
      status: 'completed',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      variants: [
        { name: 'Blue Button', traffic: 50, conversion: 5.2 },
        { name: 'Green Button', traffic: 50, conversion: 6.8 }
      ],
      significance: 0.98,
      winner: 'Green Button',
      confidence: 94
    },
    {
      id: 'test-003',
      name: 'Pricing Display Test',
      status: 'draft',
      startDate: null,
      variants: [
        { name: 'Monthly Price', traffic: 0, conversion: 0 },
        { name: 'Annual Price', traffic: 0, conversion: 0 }
      ],
      significance: 0.95,
      winner: null,
      confidence: 0
    }
  ];

  React.useEffect(() => {
    setAbTests(sampleAbTests);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#28a745';
    if (confidence >= 0.7) return '#ffc107';
    return '#dc3545';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#007bff';
      case 'completed': return '#28a745';
      case 'draft': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatPredictionValue = (value: number, type: string) => {
    switch (type) {
      case 'traffic':
        return value.toLocaleString();
      case 'engagement':
      case 'retention':
        return `${value.toFixed(1)}%`;
      case 'conversion':
        return `${value.toFixed(2)}%`;
      default:
        return value.toString();
    }
  };

  return (
    <div className={`predictive-analytics ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Predictive Analytics & A/B Testing</h2>
          <span style={styles.subtitle}>
            ML-powered predictions and experiment management
          </span>
        </div>
      </div>

      {/* Model Selection */}
      <div style={styles.modelSection}>
        <h3 style={styles.sectionTitle}>Prediction Model</h3>
        <div style={styles.modelControls}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Model Type:</label>
            <div style={styles.buttonGroup}>
              {(['traffic', 'engagement', 'conversion', 'retention'] as const).map(model => (
                <button
                  key={model}
                  style={{
                    ...styles.modelButton,
                    ...(selectedModel === model ? styles.modelButtonActive : {})
                  }}
                  onClick={() => setSelectedModel(model)}
                >
                  {model === 'traffic' && '🚦 Traffic'}
                  {model === 'engagement' && '💬 Engagement'}
                  {model === 'conversion' && '🎯 Conversion'}
                  {model === 'retention' && '🔄 Retention'}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.label}>Timeframe:</label>
            <div style={styles.buttonGroup}>
              {(['7d', '30d', '90d'] as const).map(period => (
                <button
                  key={period}
                  style={{
                    ...styles.timeframeButton,
                    ...(timeframe === period ? styles.timeframeButtonActive : {})
                  }}
                  onClick={() => setTimeframe(period)}
                >
                  {period === '7d' && '7 Days'}
                  {period === '30d' && '30 Days'}
                  {period === '90d' && '90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Results */}
      <div style={styles.predictionSection}>
        <h3 style={styles.sectionTitle}>{predictions.title}</h3>
        <div style={styles.predictionHeader}>
          <div style={styles.predictionInfo}>
            <div style={styles.currentValue}>
              <span style={styles.currentLabel}>Current:</span>
              <span style={styles.currentNumber}>
                {formatPredictionValue(predictions.current, selectedModel)}
              </span>
            </div>
            <div style={styles.accuracy}>
              <span style={styles.accuracyLabel}>Model Accuracy:</span>
              <span style={{ ...styles.accuracyValue, color: getConfidenceColor(predictions.accuracy / 100) }}>
                {predictions.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>
          <div style={styles.predictionDescription}>
            {predictions.description}
          </div>
        </div>

        {/* Prediction Chart */}
        <div style={styles.predictionChart}>
          <div style={styles.chartLegend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#007bff' }}></div>
              <span>Predicted Value</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#28a745' }}></div>
              <span>Confidence Band</span>
            </div>
          </div>
          <div style={styles.chartArea}>
            {predictions.predictions.slice(0, 14).map((prediction, index) => (
              <div key={index} style={styles.barContainer}>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.predictionBar,
                      height: `${(prediction.value / 100) * 150}px`,
                      backgroundColor: `rgba(0, 123, 255, ${prediction.confidence})`
                    }}
                  />
                  <div style={styles.confidenceBand}>
                    <div
                      style={{
                        ...styles.bandUpper,
                        height: `${((prediction.value + 10) / 100) * 150}px`
                      }}
                    />
                    <div
                      style={{
                        ...styles.bandLower,
                        height: `${((prediction.value - 10) / 100) * 150}px`
                      }}
                    />
                  </div>
                </div>
                <div style={styles.barLabel}>
                  {prediction.date.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Influencing Factors */}
      <div style={styles.factorsSection}>
        <h3 style={styles.sectionTitle}>Key Influencing Factors</h3>
        <div style={styles.factorsGrid}>
          {predictions.factors.map((factor, index) => (
            <div key={index} style={styles.factorCard}>
              <div style={styles.factorIcon}>📊</div>
              <div style={styles.factorName}>{factor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Testing Section */}
      <div style={styles.abTestSection}>
        <h3 style={styles.sectionTitle}>A/B Testing</h3>
        
        {/* Test Creation */}
        <div style={styles.testCreation}>
          <h4 style={styles.subsectionTitle}>Create New Test</h4>
          <div style={styles.testForm}>
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.fieldLabel}>Test Name</label>
                <input type="text" style={styles.input} placeholder="Enter test name..." />
              </div>
              <div style={styles.formField}>
                <label style={styles.fieldLabel}>Traffic Split</label>
                <select style={styles.select}>
                  <option value="50/50">50/50</option>
                  <option value="70/30">70/30</option>
                  <option value="80/20">80/20</option>
                </select>
              </div>
            </div>
            <button style={styles.createButton}>🚀 Create Test</button>
          </div>
        </div>

        {/* Active Tests */}
        <div style={styles.activeTests}>
          <h4 style={styles.subsectionTitle}>Active & Completed Tests</h4>
          <div style={styles.testsGrid}>
            {abTests.map(test => (
              <div key={test.id} style={styles.testCard}>
                <div style={styles.testHeader}>
                  <div style={styles.testName}>{test.name}</div>
                  <div style={{ ...styles.testStatus, backgroundColor: getStatusColor(test.status) }}>
                    {test.status === 'running' && '🔄 Running'}
                    {test.status === 'completed' && '✅ Completed'}
                    {test.status === 'draft' && '📝 Draft'}
                  </div>
                </div>
                
                <div style={styles.testVariants}>
                  {test.variants.map((variant: any, index: number) => (
                    <div key={index} style={styles.variant}>
                      <div style={styles.variantName}>{variant.name}</div>
                      <div style={styles.variantMetrics}>
                        <div>Traffic: {variant.traffic}%</div>
                        <div>Conversion: {variant.conversion}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.testResults}>
                  {test.status === 'completed' && test.winner && (
                    <div style={styles.winnerAnnouncement}>
                      <div style={styles.winnerLabel}>🏆 Winner:</div>
                      <div style={styles.winnerName}>{test.winner}</div>
                      <div style={styles.winnerConfidence}>
                        Confidence: {test.confidence}%
                      </div>
                    </div>
                  )}
                  
                  {test.status === 'running' && (
                    <div style={styles.runningStats}>
                      <div>Significance: {test.significance}</div>
                      <div>Confidence: {test.confidence}%</div>
                      <div>Duration: {Math.floor((Date.now() - test.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
