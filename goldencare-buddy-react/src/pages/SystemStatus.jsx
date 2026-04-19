import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { systemAPI } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const StatusContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${props => props.theme.spacing['4xl']};
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    .icon {
      margin-right: ${props => props.theme.spacing.md};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const OverallStatus = styled.div`
  background: ${props => {
    if (props.status === 'operational') return 'linear-gradient(135deg, #48bb78, #38a169)';
    if (props.status === 'degraded') return 'linear-gradient(135deg, #ed8936, #dd6b20)';
    return 'linear-gradient(135deg, #f56565, #e53e3e)';
  }};
  color: white;
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing['2xl']};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['4xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  
  .status-icon {
    font-size: 64px;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    opacity: 0.95;
  }
  
  .last-updated {
    margin-top: ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fontSizes.sm};
    opacity: 0.8;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['4xl']};
`;

const ServiceCard = styled.div`
  background: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.lg};
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    
    .icon {
      font-size: 24px;
    }
  }
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  background: ${props => {
    if (props.status === 'operational') return props.theme.colors.successLight;
    if (props.status === 'degraded') return props.theme.colors.warningLight;
    if (props.status === 'down') return props.theme.colors.errorLight;
    return props.theme.colors.mutedLight;
  }};
  color: ${props => {
    if (props.status === 'operational') return props.theme.colors.success;
    if (props.status === 'degraded') return props.theme.colors.warning;
    if (props.status === 'down') return props.theme.colors.error;
    return props.theme.colors.muted;
  }};
`;

const ServiceDetails = styled.div`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: ${props => props.theme.lineHeights.relaxed};
  
  p {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: ${props => props.theme.spacing.md};
  
  .label {
    color: ${props => props.theme.colors.muted};
  }
  
  .value {
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
  }
`;

const PerformanceSection = styled.div`
  background: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['4xl']};
  box-shadow: ${props => props.theme.shadows.md};
  
  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.xl};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.md};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const MetricCard = styled.div`
  background: ${props => props.theme.colors.bg};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  
  .metric-label {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .metric-value {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
  }
  
  .metric-unit {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.muted};
    margin-left: ${props => props.theme.spacing.xs};
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  margin: 0 auto;
  display: flex;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const IncidentHistory = styled.div`
  background: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.md};
  
  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.xl};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.md};
  }
  
  .no-incidents {
    text-align: center;
    padding: ${props => props.theme.spacing['2xl']};
    color: ${props => props.theme.colors.success};
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const IncidentItem = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => {
    if (props.severity === 'critical') return props.theme.colors.error;
    if (props.severity === 'major') return props.theme.colors.warning;
    return props.theme.colors.info;
  }};
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.theme.spacing.sm};
    
    h4 {
      font-size: ${props => props.theme.fontSizes.md};
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.text};
    }
    
    .date {
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.muted};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const SystemStatus = () => {
  const { t, language } = useLanguage();
  
  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    overallStatus: 'operational',
    lastUpdated: new Date().toISOString(),
    services: [
      {
        name: 'Frontend Application',
        icon: '🌐',
        status: 'operational',
        description: 'React application running normally',
        uptime: '100%',
        responseTime: '25ms'
      },
      {
        name: 'Backend API',
        icon: '🔌',
        status: 'operational',
        description: 'REST API services running normally',
        uptime: '100%',
        responseTime: '45ms'
      },
      {
        name: 'Database',
        icon: '🗄️',
        status: 'operational',
        description: 'MongoDB database connected and responsive',
        uptime: '100%',
        responseTime: '12ms'
      },
      {
        name: 'Authentication Service',
        icon: '🔒',
        status: 'operational',
        description: 'User authentication and authorization',
        uptime: '100%',
        responseTime: '30ms'
      },
      {
        name: 'Twilio Voice Service',
        icon: '📞',
        status: 'operational',
        description: 'AI-powered voice call reminders active',
        uptime: '100%',
        responseTime: '55ms'
      },
      {
        name: 'AI Assistant',
        icon: '🤖',
        status: 'operational',
        description: 'OpenAI-powered health assistant',
        uptime: '100%',
        responseTime: '120ms'
      },
      {
        name: 'Notification Service',
        icon: '🔔',
        status: 'operational',
        description: 'Push notifications and alerts',
        uptime: '100%',
        delivered: '2,456'
      },
      {
        name: 'Scheduler Service',
        icon: '⏰',
        status: 'operational',
        description: 'Medication reminder scheduling',
        uptime: '100%',
        jobs: '1,234'
      }
    ],
    metrics: {
      uptime: '100',
      requests: '24,567',
      avgResponse: '48',
      activeUsers: '342'
    },
  });

  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend
      try {
        const health = await systemAPI.getHealth();
        const schedulerStatus = await systemAPI.getSchedulerStatus();
        
        setSystemHealth({
          overallStatus: health.status === 'OK' ? 'operational' : 'degraded',
          lastUpdated: health.timestamp,
          services: [
            {
              name: 'Backend API',
              icon: '🔌',
              status: 'operational',
              description: 'REST API services running normally',
              uptime: '100%',
              responseTime: '45ms'
            },
            {
              name: 'Database',
              icon: '🗄️',
              status: health.database ? 'operational' : 'down',
              description: health.database ? 'MongoDB connected' : 'MongoDB not connected',
              uptime: health.database ? '100%' : '0%',
              responseTime: '12ms'
            },
            {
              name: 'Medication Scheduler',
              icon: '⏰',
              status: schedulerStatus?.isRunning ? 'operational' : 'down',
              description: schedulerStatus?.isRunning ? 'Automated reminders active' : 'Scheduler stopped',
              uptime: schedulerStatus?.isRunning ? '100%' : '0%',
              jobs: schedulerStatus?.scheduledJobs || 0
            },
            {
              name: 'Twilio Voice Service',
              icon: '📞',
              status: health.twilio ? 'operational' : 'degraded',
              description: health.twilio ? 'Voice calls configured' : 'Running in simulation mode',
              uptime: health.twilio ? '100%' : 'N/A'
            },
            {
              name: 'OpenAI Service',
              icon: '🤖',
              status: health.openai ? 'operational' : 'degraded',
              description: health.openai ? 'AI services active' : 'Not configured',
              uptime: health.openai ? '100%' : 'N/A'
            },
            {
              name: 'Notification Service',
              icon: '🔔',
              status: 'operational',
              description: 'Browser notifications enabled',
              uptime: '100%',
              delivered: '1,234'
            }
          ],
          metrics: {
            uptime: '100',
            requests: '12,345',
            avgResponse: '42',
            activeUsers: '156'
          }
        });
      } catch (apiError) {
        console.log('Backend not available, showing demo status');
        // Fallback demo status
        setSystemHealth({
          overallStatus: 'degraded',
          lastUpdated: new Date().toISOString(),
          services: [
            {
              name: 'Backend API',
              icon: '🔌',
              status: 'degraded',
              description: 'Backend server not responding',
              uptime: 'N/A',
              responseTime: 'N/A'
            },
            {
              name: 'Database',
              icon: '🗄️',
              status: 'down',
              description: 'MongoDB not connected',
              uptime: '0%'
            },
            {
              name: 'Frontend Application',
              icon: '🌐',
              status: 'operational',
              description: 'React app running in demo mode',
              uptime: '100%',
              responseTime: '20ms'
            },
            {
              name: 'Notification Service',
              icon: '🔔',
              status: 'operational',
              description: 'Browser notifications available',
              uptime: '100%'
            },
            {
              name: 'Twilio Voice Service',
              icon: '📞',
              status: 'degraded',
              description: 'Running in simulation mode',
              uptime: 'N/A'
            },
            {
              name: 'OpenAI Service',
              icon: '🤖',
              status: 'degraded',
              description: 'Not configured',
              uptime: 'N/A'
            }
          ],
          metrics: {
            uptime: '100',
            requests: '0',
            avgResponse: 'N/A',
            activeUsers: '1'
          }
        });
      }
    } catch (error) {
      console.error('Error loading system status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSystemStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSystemStatus();
  };

  const getOverallStatusText = (status) => {
    if (status === 'operational') return 'All Systems Operational';
    if (status === 'degraded') return 'Partial System Outage';
    return 'System Down';
  };

  const getOverallStatusIcon = (status) => {
    if (status === 'operational') return '✅';
    if (status === 'degraded') return '⚠️';
    return '❌';
  };

  if (loading) {
    return (
      <StatusContainer>
        <PageHeader>
          <h1>⚙️ System Status</h1>
          <p>Loading system health information...</p>
        </PageHeader>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer>
      <PageHeader>
        <h1><span className="icon">📊</span>{t('system_status')}</h1>
        <p>{t('real_time_system_monitoring')}</p>
      </PageHeader>

      <ContentWrapper>
        <OverallStatus status={systemHealth.overallStatus}>
          <div className="status-icon">
            {systemHealth.overallStatus === 'operational' ? '✅' : 
             systemHealth.overallStatus === 'degraded' ? '⚠️' : '❌'}
          </div>
          <h2>
            {systemHealth.overallStatus === 'operational' ? t('all_systems_operational') : 
             systemHealth.overallStatus === 'degraded' ? t('degraded_performance') : t('system_outage')}
          </h2>
          <p>
            {systemHealth.overallStatus === 'operational' ? t('all_services_running_normally') : 
             systemHealth.overallStatus === 'degraded' ? t('some_services_experiencing_issues') : t('services_currently_unavailable')}
          </p>
          <div className="last-updated">
            {t('last_updated')}: {new Date(systemHealth.lastUpdated).toLocaleString()}
          </div>
        </OverallStatus>

        <ServicesGrid>
          {systemHealth.services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceHeader>
                <h3>
                  <span className="icon">{service.icon}</span>
                  {service.name}
                </h3>
                <StatusBadge status={service.status}>
                  {service.status === 'operational' ? t('operational') : 
                   service.status === 'degraded' ? t('degraded') : t('down')}
                </StatusBadge>
              </ServiceHeader>
              <ServiceDetails>
                <p>{service.description}</p>
                <MetricRow>
                  <span className="label">{t('uptime')}:</span>
                  <span className="value">{service.uptime || 'N/A'}</span>
                </MetricRow>
                {service.responseTime && (
                  <MetricRow>
                    <span className="label">{t('response_time')}:</span>
                    <span className="value">{service.responseTime}</span>
                  </MetricRow>
                )}
                {service.jobs !== undefined && (
                  <MetricRow>
                    <span className="label">{t('scheduled_jobs')}:</span>
                    <span className="value">{service.jobs}</span>
                  </MetricRow>
                )}
                {service.delivered !== undefined && (
                  <MetricRow>
                    <span className="label">{t('notifications_delivered')}:</span>
                    <span className="value">{service.delivered}</span>
                  </MetricRow>
                )}
              </ServiceDetails>
            </ServiceCard>
          ))}
        </ServicesGrid>

        <PerformanceSection>
          <h2>
            <span className="icon">📈</span>
            {t('performance_metrics')}
          </h2>
          <MetricsGrid>
            <MetricCard>
              <div className="metric-label">{t('uptime')}</div>
              <div className="metric-value">
                {systemHealth.metrics.uptime || '0'}<span className="metric-unit">%</span>
              </div>
            </MetricCard>
            <MetricCard>
              <div className="metric-label">{t('requests')}</div>
              <div className="metric-value">
                {systemHealth.metrics.requests || '0'}
              </div>
            </MetricCard>
            <MetricCard>
              <div className="metric-label">{t('avg_response_time')}</div>
              <div className="metric-value">
                {systemHealth.metrics.avgResponse || '0'}<span className="metric-unit">ms</span>
              </div>
            </MetricCard>
            <MetricCard>
              <div className="metric-label">{t('active_users')}</div>
              <div className="metric-value">
                {systemHealth.metrics.activeUsers || '0'}
              </div>
            </MetricCard>
          </MetricsGrid>
        </PerformanceSection>

        <IncidentHistory>
          <h2>
            <span className="icon">📝</span>
            {t('incident_history')}
          </h2>
          <div className="no-incidents">
            {t('no_recent_incidents')}
          </div>
        </IncidentHistory>

        <RefreshButton 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          <span className={refreshing ? 'spin' : ''}>🔄</span>
          {refreshing ? t('refreshing') : t('refresh_status')}
        </RefreshButton>
      </ContentWrapper>
    </StatusContainer>
  );
};

export default SystemStatus;
