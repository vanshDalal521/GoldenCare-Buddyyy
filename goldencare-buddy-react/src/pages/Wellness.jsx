import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { patientAPI } from '../services/apiService';

const WellnessSection = styled.section`
  padding: 40px 0;
  min-height: calc(100vh - 144px);
`;

const WellnessGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const WellnessCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
  
  h3 {
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
    font-size: 1.5em;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  text-align: center;
  
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

const HydrationTracker = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  
  .icon {
    font-size: 2em;
  }
  
  .progress {
    flex: 1;
    height: 12px;
    background: ${props => props.theme.colors.bg};
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    
    .fill {
      height: 100%;
      background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
      transition: width 0.5s ease;
      border-radius: 6px;
    }
    
    .markers {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      
      .marker {
        width: 2px;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
`;

const WaterButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    background: #2d7bb8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
    transform: none;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ExerciseCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.cardHover};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .icon {
    font-size: 1.8em;
  }
  
  div {
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
  }
`;

const StartBtn = styled.button`
  padding: 8px 16px;
  background: ${props => props.completed ? props.theme.colors.success : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.completed ? '#3ca866' : '#2d7bb8'};
    transform: translateY(-1px);
  }
`;

const BreathingExercise = styled.div`
  text-align: center;
  padding: 32px;
  background: linear-gradient(135deg, #f8fbff, #f4fbf8);
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: 600;
    transition: all 4s ease-in-out;
    box-shadow: 0 8px 24px rgba(49, 130, 206, 0.3);
  }
  
  .breathing {
    animation: breathe 4s ease-in-out infinite;
  }
  
  .instructions {
    margin: 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  .timer {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin: 10px 0;
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const MoodTracker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .mood-options {
    display: flex;
    justify-content: space-around;
    gap: 8px;
  }
  
  .mood-btn {
    flex: 1;
    padding: 12px;
    background: ${props => props.theme.colors.bg};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.selected {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primary}10;
      transform: scale(1.1);
    }
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

const TipsSection = styled.div`
  .tip {
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;
    gap: 12px;
    
    &:last-child {
      border-bottom: none;
    }
    
    .icon {
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
    }
  }
`;

const Wellness = () => {
  const { t } = useLanguage();
  
  // Get patient ID from localStorage
  const getPatientId = () => {
    const patientSession = localStorage.getItem('gc_patient_session');
    if (patientSession) {
      try {
        const patient = JSON.parse(patientSession);
        return patient.patientId;
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  // Load state from localStorage or use defaults
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(`wellness_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };
  
  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(`wellness_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };
  
  const [hydration, setHydration] = useState(() => loadFromLocalStorage('hydration', 0));
  const [exercises, setExercises] = useState(() => loadFromLocalStorage('exercises', [
    {
      id: 1,
      name: 'gentle_stretching',
      description: '5 minutes',
      icon: '🧘',
      completed: false
    },
    {
      id: 2,
      name: 'walking',
      description: '10 minutes',
      icon: '🚶',
      completed: false
    },
    {
      id: 3,
      name: 'balance_exercise',
      description: '3 minutes',
      icon: '⚖️',
      completed: false
    }
  ]));
  const [mood, setMood] = useState(() => loadFromLocalStorage('mood', ''));
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingTime, setBreathingTime] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [breathingCompleted, setBreathingCompleted] = useState(false);

  const maxHydration = 8;
  
  // Save state to localStorage and backend whenever it changes
  useEffect(() => {
    saveToLocalStorage('hydration', hydration);
    saveWellnessDataToBackend();
  }, [hydration]);
  
  useEffect(() => {
    saveToLocalStorage('exercises', exercises);
    saveWellnessDataToBackend();
  }, [exercises]);
  
  useEffect(() => {
    saveToLocalStorage('mood', mood);
    saveWellnessDataToBackend();
  }, [mood]);
  
  useEffect(() => {
    if (!isBreathing && breathingTime > 0) {
      setBreathingCompleted(true);
      saveWellnessDataToBackend();
    }
  }, [isBreathing, breathingTime]);
  
  // Save wellness data to backend
  const saveWellnessDataToBackend = async () => {
    const patientId = getPatientId();
    if (!patientId) return;
    
    try {
      const wellnessData = {
        hydration: {
          glasses: hydration,
          goal: maxHydration
        },
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          completed: ex.completed
        })),
        breathing: {
          completed: breathingCompleted,
          duration: breathingTime
        },
        mood: mood
      };
      
      await patientAPI.updateWellnessData(patientId, wellnessData);
    } catch (error) {
      console.error('Failed to save wellness data to backend:', error);
    }
  };
  
  // Breathing exercise timer
  useEffect(() => {
    let interval;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTime(prev => {
          const newTime = prev + 1;
          // Update breathing phase every 4 seconds
          if (newTime % 12 === 0) {
            setBreathingPhase('inhale');
          } else if (newTime % 12 === 4) {
            setBreathingPhase('hold');
          } else if (newTime % 12 === 8) {
            setBreathingPhase('exhale');
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);
  
  const handleHydration = () => {
    if (hydration < maxHydration) {
      setHydration(prev => prev + 1);
    }
  };
  
  const resetHydration = () => {
    setHydration(0);
  };
  
  const handleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathingTime(0);
      setBreathingPhase('inhale');
      setBreathingCompleted(true);
    } else {
      setIsBreathing(true);
      setBreathingCompleted(false);
    }
  };
  
  const toggleExercise = (id) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id 
        ? { ...exercise, completed: !exercise.completed } 
        : exercise
    ));
  };
  
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };
  
  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return t('breathing_inhale');
      case 'hold': return t('breathing_hold');
      case 'exhale': return t('breathing_exhale');
      default: return t('breathing_inhale');
    }
  };
  
  const getBreathingTimeDisplay = () => {
    const seconds = breathingTime % 60;
    const minutes = Math.floor(breathingTime / 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const completedExercises = exercises.filter(e => e.completed).length;
  
  return (
    <WellnessSection>
      <div className="wrap">
        <h1>{t('wellness')}</h1>
        <p className="muted">{t('wellness_description')}</p>
        
        <WellnessGrid>
          <div>
            <WellnessCard>
              <CardHeader>
                <h3>💧 {t('hydration_tracker')}</h3>
                <button className="btn ghost sm" onClick={resetHydration}>
                  {t('reset')}
                </button>
              </CardHeader>
              <StatsGrid>
                <StatCard>
                  <div className="value">{hydration}</div>
                  <div className="label">{t('glasses')}</div>
                </StatCard>
                <StatCard>
                  <div className="value">{maxHydration - hydration}</div>
                  <div className="label">{t('remaining')}</div>
                </StatCard>
                <StatCard>
                  <div className="value">{Math.round((hydration / maxHydration) * 100)}%</div>
                  <div className="label">{t('goal')}</div>
                </StatCard>
              </StatsGrid>
              <HydrationTracker>
                <div className="icon">💧</div>
                <div className="progress">
                  <div 
                    className="fill" 
                    style={{ width: `${(hydration / maxHydration) * 100}%` }}
                  ></div>
                  <div className="markers">
                    {[...Array(maxHydration)].map((_, i) => (
                      <div key={i} className="marker"></div>
                    ))}
                  </div>
                </div>
                <span>{hydration}/{maxHydration}</span>
              </HydrationTracker>
              <WaterButton 
                onClick={handleHydration}
                disabled={hydration >= maxHydration}
              >
                <span>+</span> {t('add_glass')}
              </WaterButton>
            </WellnessCard>
            
            <WellnessCard>
              <h3>🧘 {t('breathing_exercise')}</h3>
              <BreathingExercise>
                <div className={`circle ${isBreathing ? 'breathing' : ''}`}>
                  {isBreathing ? getBreathingInstruction() : t('breathing_ready')}
                </div>
                {isBreathing && (
                  <div className="timer">{getBreathingTimeDisplay()}</div>
                )}
                <p>{t('breathing_description')}</p>
                <button 
                  className="btn primary" 
                  onClick={handleBreathing}
                >
                  {isBreathing ? t('stop_breathing') : t('start_breathing')}
                </button>
              </BreathingExercise>
            </WellnessCard>
            
            <WellnessCard>
              <h3>💪 {t('daily_exercises')}</h3>
              {exercises.map(exercise => (
                <ExerciseCard key={exercise.id}>
                  <ExerciseInfo>
                    <div className="icon">{exercise.icon}</div>
                    <div>
                      <h4>{t(exercise.name)}</h4>
                      <p>{exercise.description}</p>
                    </div>
                  </ExerciseInfo>
                  <StartBtn 
                    completed={exercise.completed}
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    {exercise.completed ? '✓ ' + t('done') : t('start')}
                  </StartBtn>
                </ExerciseCard>
              ))}
            </WellnessCard>
            
            <WellnessCard>
              <h3>😊 {t('mood_tracker')}</h3>
              <MoodTracker>
                <p>{t('how_are_you_feeling')}</p>
                <div className="mood-options">
                  {['😄', '🙂', '😐', '😔', '😢'].map((emoji) => (
                    <button
                      key={emoji}
                      className={`mood-btn ${mood === emoji ? 'selected' : ''}`}
                      onClick={() => handleMoodSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {mood && (
                  <p>{t('mood_selected')}: {mood}</p>
                )}
              </MoodTracker>
            </WellnessCard>
          </div>
          
          <div>
            <WellnessCard>
              <h3>📊 {t('todays_progress')}</h3>
              <ProgressSection>
                <div className="progress-item">
                  <span>{t('hydration')}</span>
                  <span className={`status ${hydration > 0 ? 'completed' : ''}`}>
                    {hydration}/{maxHydration} {t('glasses')}
                  </span>
                </div>
                <div className="progress-item">
                  <span>{t('breathing_exercise')}</span>
                  <span className={`status ${isBreathing ? 'in-progress' : (breathingTime > 0 ? 'completed' : '')}`}>
                    {isBreathing ? t('in_progress') : (breathingTime > 0 ? t('completed') : t('not_started'))}
                  </span>
                </div>
                <div className="progress-item">
                  <span>{t('exercises')}</span>
                  <span className={`status ${completedExercises > 0 ? 'completed' : ''}`}>
                    {completedExercises}/3 {t('completed')}
                  </span>
                </div>
                <div className="progress-item">
                  <span>{t('mood')}</span>
                  <span className="status">
                    {mood || t('not_recorded')}
                  </span>
                </div>
              </ProgressSection>
            </WellnessCard>
            
            <WellnessCard>
              <h3>💡 {t('wellness_tips')}</h3>
              <TipsSection>
                <div className="tip">
                  <span className="icon">1.</span>
                  <span>{t('tip_drink_water')}</span>
                </div>
                <div className="tip">
                  <span className="icon">2.</span>
                  <span>{t('tip_deep_breaths')}</span>
                </div>
                <div className="tip">
                  <span className="icon">3.</span>
                  <span>{t('tip_move_gently')}</span>
                </div>
                <div className="tip">
                  <span className="icon">4.</span>
                  <span>{t('tip_listen_body')}</span>
                </div>
                <div className="tip">
                  <span className="icon">5.</span>
                  <span>{t('tip_consistent_sleep')}</span>
                </div>
              </TipsSection>
            </WellnessCard>
          </div>
        </WellnessGrid>
      </div>
    </WellnessSection>
  );
};

export default Wellness;