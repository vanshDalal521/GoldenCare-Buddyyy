import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { patientAPI } from '../services/apiService';

const WellnessReportContainer = styled.div`
  margin-top: 24px;
  padding: 24px;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  font-size: 1.25em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  
  .value {
    font-size: 1.5em;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
  }
  
  .label {
    font-size: 0.85em;
    color: ${props => props.theme.colors.muted};
    margin-top: 4px;
  }
`;

const ProgressSection = styled.div`
  .progress-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    
    &:last-child {
      border-bottom: none;
    }
    
    .status {
      &.completed {
        color: ${props => props.theme.colors.success};
        font-weight: 600;
      }
      
      &.in-progress {
        color: ${props => props.theme.colors.primary};
        font-weight: 600;
      }
    }
  }
`;

const ExerciseList = styled.div`
  margin-top: 16px;
`;

const ExerciseItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .exercise-name {
    flex: 1;
    font-weight: 500;
  }
  
  .status {
    padding: 4px 12px;
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: 0.85em;
    font-weight: 600;
    
    &.completed {
      background: ${props => props.theme.colors.successLight};
      color: ${props => props.theme.colors.success};
    }
    
    &.pending {
      background: ${props => props.theme.colors.warningLight};
      color: ${props => props.theme.colors.warning};
    }
  }
`;

const MoodDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  
  .mood-emoji {
    font-size: 2em;
  }
  
  .mood-text {
    font-weight: 500;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.colors.muted};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.errorLight};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 16px;
`;

const WellnessReport = ({ patientId }) => {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWellnessData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch wellness data from API
        const response = await patientAPI.getWellnessData(patientId);
        
        if (response.success) {
          setWellnessData(response.wellness);
        } else {
          setError(response.message || 'Failed to fetch wellness data');
        }
      } catch (err) {
        console.error('Error fetching wellness data:', err);
        setError('Failed to load wellness data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchWellnessData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <WellnessReportContainer>
        <SectionTitle>📊 Wellness Report</SectionTitle>
        <LoadingMessage>Loading wellness data...</LoadingMessage>
      </WellnessReportContainer>
    );
  }

  if (error) {
    return (
      <WellnessReportContainer>
        <SectionTitle>📊 Wellness Report</SectionTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </WellnessReportContainer>
    );
  }

  // If no wellness data, show a message
  if (!wellnessData || Object.keys(wellnessData).length === 0) {
    return (
      <WellnessReportContainer>
        <SectionTitle>📊 Wellness Report</SectionTitle>
        <LoadingMessage>No wellness data available yet. Patient hasn't tracked any wellness activities.</LoadingMessage>
      </WellnessReportContainer>
    );
  }

  // Default values if not present in wellness data
  const hydration = wellnessData.hydration || { glasses: 0, goal: 8 };
  const exercises = wellnessData.exercises || [];
  const breathing = wellnessData.breathing || { completed: false, duration: 0 };
  const mood = wellnessData.mood || '';

  const completedExercises = exercises.filter(e => e.completed).length;

  return (
    <WellnessReportContainer>
      <SectionTitle>📊 Wellness Report</SectionTitle>
      
      <StatsGrid>
        <StatCard>
          <div className="value">{hydration.glasses}</div>
          <div className="label">Glasses</div>
        </StatCard>
        <StatCard>
          <div className="value">{hydration.goal - hydration.glasses}</div>
          <div className="label">Remaining</div>
        </StatCard>
        <StatCard>
          <div className="value">{hydration.goal > 0 ? Math.round((hydration.glasses / hydration.goal) * 100) : 0}%</div>
          <div className="label">Hydration</div>
        </StatCard>
      </StatsGrid>
      
      <ProgressSection>
        <div className="progress-item">
          <span>Hydration</span>
          <span className="status completed">
            {hydration.glasses}/{hydration.goal} glasses
          </span>
        </div>
        <div className="progress-item">
          <span>Breathing Exercise</span>
          <span className={`status ${breathing.completed ? 'completed' : ''}`}>
            {breathing.completed ? 'Completed' : 'Not Completed'}
          </span>
        </div>
        <div className="progress-item">
          <span>Exercises</span>
          <span className="status completed">
            {completedExercises}/{exercises.length} Completed
          </span>
        </div>
        <div className="progress-item">
          <span>Mood</span>
          <span className="status">
            {mood || 'Not Recorded'}
          </span>
        </div>
      </ProgressSection>
      
      {exercises.length > 0 && (
        <ExerciseList>
          <h4>Today's Exercises</h4>
          {exercises.map(exercise => (
            <ExerciseItem key={exercise.id}>
              <div className="exercise-name">{exercise.name}</div>
              <div className={`status ${exercise.completed ? 'completed' : 'pending'}`}>
                {exercise.completed ? 'Completed' : 'Pending'}
              </div>
            </ExerciseItem>
          ))}
        </ExerciseList>
      )}
      
      {mood && (
        <MoodDisplay>
          <div className="mood-emoji">{mood}</div>
          <div className="mood-text">Today's Mood</div>
        </MoodDisplay>
      )}
    </WellnessReportContainer>
  );
};

export default WellnessReport;