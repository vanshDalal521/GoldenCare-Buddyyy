import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart } from 'chart.js';

const FamilySection = styled.section`
  padding: 40px 0;
`;

const FamilyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const FamilyCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: 24px;
  margin-bottom: 24px;
  
  h3 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
    font-size: 1.25em;
    font-weight: 700;
  }
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MemberAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const MemberInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    color: ${props => props.theme.colors.text};
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.colors.muted};
    font-size: 14px;
  }
`;

const AdherenceBadge = styled.div`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  
  &.high {
    background: rgba(16, 185, 129, 0.1);
    color: ${props => props.theme.colors.success};
  }
  
  &.medium {
    background: rgba(245, 158, 11, 0.1);
    color: ${props => props.theme.colors.warning};
  }
  
  &.low {
    background: rgba(239, 68, 68, 0.1);
    color: ${props => props.theme.colors.error};
  }
`;

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: 24px;
  height: 300px;
  
  h3 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
    font-size: 1.25em;
    font-weight: 700;
  }
`;

const Family = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Taken', 'Missed'],
          datasets: [{
            data: [88, 12],
            backgroundColor: [
              '#3b93d0',
              '#e8e8e8'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }, []);

  const familyMembers = [
    { id: 1, name: 'Mr. Vansh', adherence: 95, status: 'high' },
    { id: 2, name: 'Mrs. Sushma', adherence: 78, status: 'medium' },
    { id: 3, name: 'Mr. Rohan', adherence: 45, status: 'low' }
  ];

  const getAdherenceStatus = (adherence) => {
    if (adherence >= 90) return 'high';
    if (adherence >= 70) return 'medium';
    return 'low';
  };

  return (
    <FamilySection>
      <div className="wrap">
        <h1>Family Dashboard</h1>
        <p className="muted">Monitor adherence and wellness for your family members.</p>

        <FamilyGrid>
          <div>
            <FamilyCard>
              <h3>Family Members</h3>
              {familyMembers.map(member => (
                <MemberCard key={member.id}>
                  <MemberAvatar>
                    {member.name.split(' ')[1].charAt(0)}
                  </MemberAvatar>
                  <MemberInfo>
                    <h4>{member.name}</h4>
                    <p>Last active: 2 hours ago</p>
                  </MemberInfo>
                  <AdherenceBadge className={getAdherenceStatus(member.adherence)}>
                    {member.adherence}%
                  </AdherenceBadge>
                </MemberCard>
              ))}
            </FamilyCard>

            <FamilyCard>
              <h3>Recent Activity</h3>
              <div>
                <p>• Mr. Vansh took morning medication</p>
                <p>• Mrs. Sushma missed afternoon dose</p>
                <p>• Mr. Rohan completed breathing exercise</p>
              </div>
            </FamilyCard>
          </div>

          <div>
            <ChartContainer>
              <h3>Overall Adherence</h3>
              <canvas ref={chartRef}></canvas>
            </ChartContainer>

            <FamilyCard>
              <h3>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn primary">Send Reminder</button>
                <button className="btn secondary">View Reports</button>
                <button className="btn ghost">Add Family Member</button>
              </div>
            </FamilyCard>
          </div>
        </FamilyGrid>
      </div>
    </FamilySection>
  );
};

export default Family;
