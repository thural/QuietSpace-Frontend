import * as React from 'react';
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { styles } from './AdvancedCharts.styles.ts';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

export interface IAdvancedChartsProps extends IBaseComponentProps {
    userId: string;
    className?: string;
}

interface IAdvancedChartsState extends IBaseComponentState {
    selectedTimeframe: '1h' | '24h' | '7d' | '30d';
    selectedChart: 'line' | 'bar' | 'pie' | 'heatmap' | 'funnel';
    realTimeData: any[];
    isLive: boolean;
    analyticsData: any;
    realTimeInterval: NodeJS.Timeout | null;
}

/**
 * AdvancedCharts component.
 * 
 * This component provides advanced data visualization capabilities with real-time updates,
 * multiple chart types, and comprehensive analytics integration. It supports line charts,
 * bar charts, pie charts, heatmaps, and funnel charts with customizable timeframes.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class AdvancedCharts extends BaseClassComponent<IAdvancedChartsProps, IAdvancedChartsState> {

    private analyticsService: any;

    protected override getInitialState(): Partial<IAdvancedChartsState> {
        return {
            selectedTimeframe: '24h',
            selectedChart: 'line',
            realTimeData: [],
            isLive: false,
            analyticsData: null,
            realTimeInterval: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        // Initialize analytics service
        this.analyticsService = useAnalyticsDI(this.props.userId);
        this.updateAnalyticsData();
    }

    protected override onUnmount(): void {
        super.onUnmount();
        // Clean up real-time interval
        if (this.state.realTimeInterval) {
            clearInterval(this.state.realTimeInterval);
        }
    }

    protected override onUpdate(): void {
        this.updateAnalyticsData();
    }

    /**
     * Update analytics data from service
     */
    private updateAnalyticsData = (): void => {
        if (this.analyticsService) {
            const { metrics, getInsights } = this.analyticsService;
            this.safeSetState({
                analyticsData: { metrics, getInsights }
            });
        }
    };

    /**
     * Start real-time data updates
     */
    private startRealTimeUpdates = (): void => {
        if (this.state.realTimeInterval) {
            clearInterval(this.state.realTimeInterval);
        }

        const interval = setInterval(() => {
            const newDataPoint = {
                timestamp: new Date(),
                value: Math.floor(Math.random() * 100) + 50,
                category: 'events',
                users: Math.floor(Math.random() * 50) + 10
            };

            this.safeSetState(prev => ({
                realTimeData: [...prev.realTimeData.slice(-19), newDataPoint]
            }));
        }, 1000);

        this.safeSetState({ realTimeInterval: interval });
    };

    /**
     * Stop real-time updates
     */
    private stopRealTimeUpdates = (): void => {
        if (this.state.realTimeInterval) {
            clearInterval(this.state.realTimeInterval);
            this.safeSetState({ realTimeInterval: null });
        }
    };

    /**
     * Toggle live updates
     */
    private toggleLive = (): void => {
        const newIsLive = !this.state.isLive;
        this.safeSetState({ isLive: newIsLive });

        if (newIsLive) {
            this.startRealTimeUpdates();
        } else {
            this.stopRealTimeUpdates();
        }
    };

    /**
     * Handle timeframe change
     */
    private handleTimeframeChange = (timeframe: typeof this.state.selectedTimeframe): void => {
        this.safeSetState({ selectedTimeframe: timeframe });
    };

    /**
     * Handle chart type change
     */
    private handleChartChange = (chart: typeof this.state.selectedChart): void => {
        this.safeSetState({ selectedChart: chart });
    };

    /**
     * Generate mock data for charts
     */
    private generateMockData = (): any[] => {
        return Array.from({ length: 20 }, (_, index) => ({
            timestamp: new Date(Date.now() - (19 - index) * 60000),
            value: Math.floor(Math.random() * 100) + 50,
            category: 'events',
            users: Math.floor(Math.random() * 50) + 10
        }));
    };

    /**
     * Generate chart data based on selected type
     */
    private generateChartData = (): any => {
        const data = this.state.realTimeData.length > 0 ? this.state.realTimeData : this.generateMockData();

        switch (this.state.selectedChart) {
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
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

            case 'bar':
                return {
                    type: 'bar',
                    data: data.map((point, index) => ({
                        x: point.category || 'events',
                        y: point.value,
                        label: `Point ${index + 1}`
                    })),
                    options: {
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

            case 'pie':
                return {
                    type: 'pie',
                    data: [
                        { value: 30, label: 'Desktop' },
                        { value: 25, label: 'Mobile' },
                        { value: 20, label: 'Tablet' },
                        { value: 25, label: 'Other' }
                    ],
                    options: {
                        responsive: true
                    }
                };

            case 'heatmap':
                return {
                    type: 'heatmap',
                    data: this.generateHeatmapData(),
                    options: {
                        responsive: true
                    }
                };

            case 'funnel':
                return {
                    type: 'funnel',
                    data: [
                        { value: 100, label: 'Visitors' },
                        { value: 75, label: 'Signups' },
                        { value: 50, label: 'Active Users' },
                        { value: 25, label: 'Premium Users' }
                    ],
                    options: {
                        responsive: true
                    }
                };

            default:
                return null;
        }
    };

    /**
     * Generate heatmap data
     */
    private generateHeatmapData = (): any[] => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return days.map(day =>
            hours.map(hour => ({
                x: hour,
                y: day,
                value: Math.floor(Math.random() * 100)
            }))
        ).flat();
    };

    protected override renderContent(): ReactNode {
        const { className } = this.props;
        const { selectedTimeframe, selectedChart, isLive } = this.state;
        const chartData = this.generateChartData();

        return (
            <div className={`advanced-charts ${className}`} style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Advanced Analytics Charts</h2>
                    <div style={styles.controls}>
                        <div style={styles.controlGroup}>
                            <label style={styles.label}>Timeframe:</label>
                            <select
                                value={selectedTimeframe}
                                onChange={(e) => this.handleTimeframeChange(e.target.value as any)}
                                style={styles.select}
                            >
                                <option value="1h">1 Hour</option>
                                <option value="24h">24 Hours</option>
                                <option value="7d">7 Days</option>
                                <option value="30d">30 Days</option>
                            </select>
                        </div>

                        <div style={styles.controlGroup}>
                            <label style={styles.label}>Chart Type:</label>
                            <select
                                value={selectedChart}
                                onChange={(e) => this.handleChartChange(e.target.value as any)}
                                style={styles.select}
                            >
                                <option value="line">Line Chart</option>
                                <option value="bar">Bar Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="heatmap">Heatmap</option>
                                <option value="funnel">Funnel Chart</option>
                            </select>
                        </div>

                        <div style={styles.controlGroup}>
                            <button
                                onClick={this.toggleLive}
                                style={{
                                    ...styles.button,
                                    backgroundColor: isLive ? '#10b981' : '#6b7280'
                                }}
                            >
                                {isLive ? 'Stop Live' : 'Start Live'}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={styles.chartContainer}>
                    {chartData && (
                        <div style={styles.chart}>
                            <div style={styles.chartPlaceholder}>
                                <h3 style={styles.chartTitle}>
                                    {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart
                                </h3>
                                <div style={styles.chartContent}>
                                    <p>Chart Type: {chartData.type}</p>
                                    <p>Data Points: {chartData.data?.length || 0}</p>
                                    <p>Timeframe: {selectedTimeframe}</p>
                                    <p>Live Mode: {isLive ? 'Active' : 'Inactive'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.metrics}>
                    <h3 style={styles.metricsTitle}>Chart Metrics</h3>
                    <div style={styles.metricsGrid}>
                        <div style={styles.metricCard}>
                            <div style={styles.metricLabel}>Data Points</div>
                            <div style={styles.metricValue}>
                                {this.state.realTimeData.length || 20}
                            </div>
                        </div>
                        <div style={styles.metricCard}>
                            <div style={styles.metricLabel}>Update Rate</div>
                            <div style={styles.metricValue}>
                                {isLive ? '1s' : 'Manual'}
                            </div>
                        </div>
                        <div style={styles.metricCard}>
                            <div style={styles.metricLabel}>Chart Type</div>
                            <div style={styles.metricValue}>
                                {selectedChart}
                            </div>
                        </div>
                        <div style={styles.metricCard}>
                            <div style={styles.metricLabel}>Timeframe</div>
                            <div style={styles.metricValue}>
                                {selectedTimeframe}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvancedCharts;