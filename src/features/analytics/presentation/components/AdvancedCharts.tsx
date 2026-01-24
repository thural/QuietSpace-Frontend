import * as React from 'react';
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { styles } from './AdvancedCharts.styles.ts';

interface AdvancedChartsProps {
  userId: string;
  className?: string;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, getInsights } = useAnalyticsDI(userId);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedChart, setSelectedChart] = React.useState<'line' | 'bar' | 'pie' | 'heatmap' | 'funnel'>('line');
  const [realTimeData, setRealTimeData] = React.useState<any[]>([]);
  const [isLive, setIsLive] = React.useState(false);

  // Simulate real-time data updates
  React.useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newDataPoint = {
        timestamp: new Date(),
        value: Math.floor(Math.random() * 100) + 50,
        category: 'events',
        users: Math.floor(Math.random() * 50) + 10
      };

      setRealTimeData(prev => [...prev.slice(-19), newDataPoint]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Generate chart data based on selected type
  const generateChartData = React.useCallback(() => {
    const data = realTimeData.length > 0 ? realTimeData : generateMockData();

    switch (selectedChart) {
      case 'line':
        return {
          type: 'line',
          data: data.map((point, index) => ({
            x: point.timestamp || new Date(Date.now() - (19 - index) * 60000),
            y: point.value,
            label: new Date(point.timestamp || Date.now() - (19 - index) * 60000).toLocaleTimeString()
          })),
          options: {
            responsive: true,
            animation: { duration: 750 },
            scales: {
              x: { type: 'time' },
              y: { beginAtZero: true }
            }
          }
        };

      case 'bar':
        return {
          type: 'bar',
          data: [
            { x: 'Page Views', y: metrics?.pageViews || 0 },
            { x: 'Content Views', y: metrics?.contentViews || 0 },
            { x: 'Unique Users', y: metrics?.uniqueUsers || 0 },
            { x: 'Sessions', y: metrics?.totalSessions || 0 }
          ],
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            }
          }
        };

      case 'pie':
        return {
          type: 'pie',
          data: [
            { x: 'Desktop', y: 65, color: '#007bff' },
            { x: 'Mobile', y: 25, color: '#28a745' },
            { x: 'Tablet', y: 10, color: '#ffc107' }
          ],
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        };

      case 'heatmap':
        return {
          type: 'heatmap',
          data: generateHeatmapData(),
          options: {
            responsive: true,
            scales: {
              x: { type: 'category' },
              y: { type: 'category' }
            }
          }
        };

      case 'funnel':
        return {
          type: 'funnel',
          data: [
            { x: 'Visitors', y: 1000 },
            { x: 'Sign-ups', y: 250 },
            { x: 'Active Users', y: 180 },
            { x: 'Premium', y: 45 }
          ],
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                formatter: (value: number) => `${value} (${((value / 1000) * 100).toFixed(1)}%)`
              }
            }
          }
        };

      default:
        return { type: 'line', data: [], options: {} };
    }
  }, [selectedChart, realTimeData, metrics]);

  const generateMockData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000),
      value: Math.floor(Math.random() * 100) + 50,
      category: 'events',
      users: Math.floor(Math.random() * 50) + 10
    }));
  };

  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return days.flatMap(day => 
      hours.map(hour => ({
        x: hour,
        y: day,
        v: Math.floor(Math.random() * 100)
      }))
    );
  };

  const chartData = generateChartData();

  return (
    <div className={`advanced-charts ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Advanced Analytics Dashboard</h2>
          <span style={styles.subtitle}>
            Real-time data visualization and insights
          </span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isLive ? styles.toggleButtonActive : {})
            }}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Chart Type:</label>
          <div style={styles.buttonGroup}>
            {(['line', 'bar', 'pie', 'heatmap', 'funnel'] as const).map(type => (
              <button
                key={type}
                style={{
                  ...styles.chartButton,
                  ...(selectedChart === type ? styles.chartButtonActive : {})
                }}
                onClick={() => setSelectedChart(type)}
              >
                {type === 'line' && '📈 Line'}
                {type === 'bar' && '📊 Bar'}
                {type === 'pie' && '🥧 Pie'}
                {type === 'heatmap' && '🔥 Heatmap'}
                {type === 'funnel' && '🔽 Funnel'}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Timeframe:</label>
          <div style={styles.buttonGroup}>
            {(['1h', '24h', '7d', '30d'] as const).map(timeframe => (
              <button
                key={timeframe}
                style={{
                  ...styles.timeframeButton,
                  ...(selectedTimeframe === timeframe ? styles.timeframeButtonActive : {})
                }}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe === '1h' && '1 Hour'}
                {timeframe === '24h' && '24 Hours'}
                {timeframe === '7d' && '7 Days'}
                {timeframe === '30d' && '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={styles.chartArea}>
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>
              {selectedChart === 'line' && 'Real-time Events'}
              {selectedChart === 'bar' && 'Performance Metrics'}
              {selectedChart === 'pie' && 'Device Distribution'}
              {selectedChart === 'heatmap' && 'Activity Heatmap'}
              {selectedChart === 'funnel' && 'Conversion Funnel'}
            </h3>
            <div style={styles.chartActions}>
              <button style={styles.actionButton}>📥 Export</button>
              <button style={styles.actionButton}>🔧 Configure</button>
              <button style={styles.actionButton}>📊 Fullscreen</button>
            </div>
          </div>
          
          {/* Chart Placeholder - In real app, would use charting library */}
          <div style={styles.chartPlaceholder}>
            <div style={styles.mockChart}>
              {selectedChart === 'line' && (
                <div style={styles.lineChart}>
                  <div style={styles.chartLegend}>📈 Real-time Events</div>
                  <div style={styles.dataPoints}>
                    {chartData.data.slice(-10).map((point: any, index: number) => (
                      <div key={index} style={styles.dataPoint} title={`${point.label}: ${point.y}`}>
                        {point.y}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedChart === 'bar' && (
                <div style={styles.barChart}>
                  <div style={styles.chartLegend}>📊 Performance Metrics</div>
                  <div style={styles.barContainer}>
                    {chartData.data.map((item: any, index: number) => (
                      <div key={index} style={styles.barItem}>
                        <div style={styles.barLabel}>{item.x}</div>
                        <div style={styles.barValue}>{item.y}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedChart === 'pie' && (
                <div style={styles.pieChart}>
                  <div style={styles.chartLegend}>🥧 Device Distribution</div>
                  <div style={styles.pieContainer}>
                    {chartData.data.map((item: any, index: number) => (
                      <div key={index} style={styles.pieSlice}>
                        <div style={{ ...styles.pieSegment, backgroundColor: item.color }}></div>
                        <div style={styles.pieLabel}>{item.x}: {item.y}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Statistics */}
      <div style={styles.statistics}>
        <h3 style={styles.sectionTitle}>Chart Statistics</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Data Points</div>
            <div style={styles.statValue}>{chartData.data.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Update Rate</div>
            <div style={styles.statValue}>{isLive ? '1s' : 'Manual'}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Time Range</div>
            <div style={styles.statValue}>{selectedTimeframe}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Chart Type</div>
            <div style={styles.statValue}>{selectedChart}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
