/* Comprehensive Security Analytics Dashboard Styles */

.security-analytics-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Loading and Error States */
.security-analytics-dashboard.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.security-analytics-dashboard.error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.error-message {
  text-align: center;
  padding: 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
}

.error-icon {
  font-size: 24px;
  margin-right: 10px;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #2980b9;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-left h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.header-left p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.timeframe-selector {
  display: flex;
  gap: 5px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 8px;
}

.timeframe-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.timeframe-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.timeframe-btn.active {
  background: #3498db;
  color: white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.auto-refresh-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
}

.auto-refresh-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.details-toggle {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.details-toggle:hover {
  background: #5a6268;
}

/* Security Metrics Grid */
.security-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid transparent;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-card.threat-level {
  border-left-color: #dc3545;
}

.metric-card.health-score {
  border-left-color: #28a745;
}

.metric-card.blocked-ips {
  border-left-color: #fd7e14;
}

.metric-card.failed-attempts {
  border-left-color: #dc3545;
}

.metric-card.security-events {
  border-left-color: #17a2b8;
}

.metric-card.rate-limits {
  border-left-color: #6f42c1;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metric-header h3 {
  margin: 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}

.metric-icon {
  font-size: 24px;
  opacity: 0.7;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1;
}

.metric-description {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

/* Security Status Overview */
.security-status-overview {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.security-status-overview h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-label {
  font-weight: 500;
  color: #495057;
}

.status-value {
  font-weight: 600;
  color: #2c3e50;
}

.status-value.risk-critical {
  color: #dc3545;
}

.status-value.risk-high {
  color: #fd7e14;
}

.status-value.risk-medium {
  color: #ffc107;
}

.status-value.risk-low {
  color: #28a745;
}

/* Recent Security Events */
.recent-events {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.recent-events h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.events-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 150px 120px 80px 1fr 100px;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.event-row {
  display: grid;
  grid-template-columns: 150px 120px 80px 1fr 100px;
  gap: 15px;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.3s;
}

.event-row:hover {
  background: #f8f9fa;
}

.event-type {
  font-weight: 500;
  color: #495057;
}

.severity-critical {
  color: #dc3545;
  font-weight: 600;
}

.severity-high {
  color: #fd7e14;
  font-weight: 600;
}

.severity-medium {
  color: #ffc107;
  font-weight: 600;
}

.severity-low {
  color: #28a745;
  font-weight: 600;
}

.event-description {
  color: #6c757d;
  font-size: 14px;
}

.event-status {
  font-weight: 500;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.event-status.resolved {
  background: #d4edda;
  color: #155724;
}

.event-status.active {
  background: #f8d7da;
  color: #721c24;
}

/* Login Attempts Analysis */
.login-attempts-analysis {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.login-attempts-analysis h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.attempts-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.attempt-stat {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.attempt-stat:hover {
  transform: translateY(-2px);
}

.attempt-stat.success {
  background: #d4edda;
  color: #155724;
}

.attempt-stat.failed {
  background: #f8d7da;
  color: #721c24;
}

.attempt-stat h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.attempt-stat .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: inherit;
}

/* IP Blocking Management */
.ip-blocking-management {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.ip-blocking-management h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.blocked-ips-list {
  overflow-x: auto;
}

.list-header {
  display: grid;
  grid-template-columns: 200px 150px 1fr 100px;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
}

.blocked-ip-row {
  display: grid;
  grid-template-columns: 200px 150px 1fr 100px;
  gap: 15px;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
}

.ip-address {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
}

.blocked-time {
  color: #6c757d;
  font-size: 14px;
}

.block-reason {
  color: #6c757d;
  font-size: 14px;
}

.unblock-btn {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 12px;
  font-weight: 500;
}

.unblock-btn:hover {
  background: #218838;
}

/* Security Actions Panel */
.security-actions-panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.security-actions-panel h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.actions-grid {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 14px;
}

.action-btn:not(.danger) {
  background: #3498db;
  color: white;
}

.action-btn:not(.danger):hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.action-btn.danger {
  background: #dc3545;
  color: white;
}

.action-btn.danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Detailed Security Settings */
.detailed-settings {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.detailed-settings h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #6c757d;
}

.setting-label {
  font-weight: 500;
  color: #495057;
}

.setting-value {
  font-weight: 600;
  color: #2c3e50;
}

.setting-value.enabled {
  color: #28a745;
}

.setting-value.disabled {
  color: #dc3545;
}

/* Responsive Design */
@media (max-width: 768px) {
  .security-analytics-dashboard {
    padding: 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .header-controls {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  
  .timeframe-selector {
    order: -1;
  }
  
  .security-metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .event-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }
  
  .list-header,
  .blocked-ip-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }
  
  .actions-grid {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* Animation and Transitions */
.metric-card,
.status-item,
.event-row,
.blocked-ip-row,
.attempt-stat {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar */
.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
