import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ExploreContainer = styled.div`
  background: ${props => props.theme.colors.bg};
`;

const ExploreHeader = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0 ${props => props.theme.spacing['4xl']};
  text-align: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}08 50%, 
    ${props => props.theme.colors.accentLight}08 100%
  );
  
  h1 {
    font-size: ${props => props.theme.fontSizes['5xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    
    .highlight {
      background: linear-gradient(120deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['4xl']};
    }
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    max-width: 600px;
    margin: 0 auto ${props => props.theme.spacing['2xl']};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const FeatureSection = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  
  &:nth-child(even) {
    background: ${props => props.theme.colors.card};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing['4xl']};
  align-items: center;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: ${props => props.reverse ? '1fr 1fr' : '1fr 1fr'};
  }
  
  .feature-content {
    order: ${props => props.reverse ? 2 : 1};
    
    @media (min-width: ${props => props.theme.breakpoints.tablet}) {
      order: ${props => props.reverse ? 2 : 1};
    }
  }
  
  .feature-visual {
    order: ${props => props.reverse ? 1 : 2};
    
    @media (min-width: ${props => props.theme.breakpoints.tablet}) {
      order: ${props => props.reverse ? 1 : 2};
    }
  }
`;

const FeatureContent = styled.div`
  .feature-badge {
    display: inline-block;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    background: ${props => props.theme.colors.primaryLight}20;
    color: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: ${props => props.theme.fontSizes.sm};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  h2 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    line-height: ${props => props.theme.lineHeights.tight};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
    }
  }
  
  .description {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${props => props.theme.spacing['2xl']} 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    .check {
      color: ${props => props.theme.colors.success};
      font-weight: bold;
      font-size: ${props => props.theme.fontSizes.lg};
      margin-top: 2px;
    }
    
    .text {
      font-size: ${props => props.theme.fontSizes.md};
      color: ${props => props.theme.colors.text};
      font-weight: ${props => props.theme.fontWeights.medium};
    }
  }
`;

const FeatureVisual = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing['3xl']};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, ${props => props.theme.colors.primaryLight}10, transparent);
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  }
  
  .demo-interface {
    background: ${props => props.theme.colors.bg};
    border-radius: ${props => props.theme.borderRadius.xl};
    padding: ${props => props.theme.spacing['2xl']};
    border: 2px solid ${props => props.theme.colors.border};
    position: relative;
    z-index: 1;
    
    .demo-header {
      display: flex;
      align-items: center;
      gap: ${props => props.theme.spacing.md};
      margin-bottom: ${props => props.theme.spacing.lg};
      padding-bottom: ${props => props.theme.spacing.md};
      border-bottom: 1px solid ${props => props.theme.colors.border};
      
      .demo-icon {
        font-size: ${props => props.theme.fontSizes['2xl']};
      }
      
      .demo-title {
        font-size: ${props => props.theme.fontSizes.lg};
        font-weight: ${props => props.theme.fontWeights.bold};
        color: ${props => props.theme.colors.text};
      }
    }
    
    .demo-content {
      text-align: center;
      color: ${props => props.theme.colors.muted};
    }
  }
`;

const DemoButton = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin: ${props => props.theme.spacing.md} 0;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const StatsBanner = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  text-align: center;
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing['2xl']};
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${props => props.theme.spacing['2xl']};
    margin-top: ${props => props.theme.spacing['2xl']};
    
    .stat {
      .number {
        font-size: ${props => props.theme.fontSizes['4xl']};
        font-weight: ${props => props.theme.fontWeights.black};
        margin-bottom: ${props => props.theme.spacing.sm};
      }
      
      .label {
        font-size: ${props => props.theme.fontSizes.lg};
        opacity: 0.9;
      }
    }
  }
`;

const FinalCTA = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  text-align: center;
  background: ${props => props.theme.colors.card};
  
  h2 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
    }
  }
  
  .cta-description {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
  
  .cta-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing.lg};
    justify-content: center;
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      flex-direction: column;
      align-items: center;
    }
  }
`;

const Explore = () => {
  useEffect(() => {
    // Scroll-triggered animations
    gsap.utils.toArray('.animate-on-scroll').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Feature content stagger animation
    gsap.utils.toArray('.feature-content').forEach((el) => {
      gsap.from(el.children, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    });
  }, []);

  const features = [
    {
      badge: "Core Feature",
      title: "Smart Digital Pillbox",
      description: "Experience medication management designed specifically for seniors with large, clear buttons and intuitive navigation.",
      benefits: [
        "Extra-large buttons for easy interaction",
        "Clear medication images and descriptions", 
        "Voice reminders and audio instructions",
        "Simple one-tap medication logging"
      ],
      demoIcon: "💊",
      demoTitle: "Daily Medication Tracker",
      demoContent: "Mark medications as taken with a simple tap"
    },
    {
      badge: "Family Care",
      title: "Real-time Family Dashboard", 
      description: "Keep your loved ones connected and informed with instant updates on medication adherence and health progress.",
      benefits: [
        "Live medication compliance tracking",
        "Instant alerts for missed doses",
        "Health progress summaries",
        "Emergency contact integration"
      ],
      demoIcon: "👨‍👩‍👦",
      demoTitle: "Family Monitor",
      demoContent: "Real-time updates on your loved one's health"
    },
    {
      badge: "Wellness Support",
      title: "Comprehensive Wellness Tracking",
      description: "Gentle reminders and tracking for hydration, exercise, and mindfulness activities to promote overall wellbeing.",
      benefits: [
        "Hydration reminders with easy logging",
        "Simple exercise routines for seniors", 
        "Guided meditation and breathing exercises",
        "Daily wellness score tracking"
      ],
      demoIcon: "🧘",
      demoTitle: "Wellness Hub",
      demoContent: "Track daily wellness activities"
    },
    {
      badge: "AI Intelligence",
      title: "Predictive Health Insights",
      description: "Advanced AI analyzes patterns to predict potential health issues and provide personalized recommendations.",
      benefits: [
        "Medication adherence pattern analysis",
        "Early warning system for health risks",
        "Personalized health recommendations",
        "Integration with healthcare providers"
      ],
      demoIcon: "🤖",
      demoTitle: "AI Health Assistant",
      demoContent: "Get personalized health insights"
    }
  ];

  return (
    <ExploreContainer>
      <ExploreHeader className="animate-on-scroll">
        <div className="wrap">
          <h1>
            Discover the <span className="highlight">Complete</span> Healthcare Solution
          </h1>
          <p className="subtitle">
            Explore every feature designed to make senior care simple, effective, and compassionate.
            See how GoldenCare Buddy transforms daily health management.
          </p>
        </div>
      </ExploreHeader>

      {features.map((feature, index) => (
        <FeatureSection key={index}>
          <div className="wrap">
            <FeatureGrid reverse={index % 2 === 1}>
              <FeatureContent className="feature-content">
                <div className="feature-badge">{feature.badge}</div>
                <h2>{feature.title}</h2>
                <p className="description">{feature.description}</p>
                <FeatureList>
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>
                      <span className="check">✓</span>
                      <span className="text">{benefit}</span>
                    </li>
                  ))}
                </FeatureList>
                <Link className="btn primary lg" to="/login">
                  Try This Feature
                </Link>
              </FeatureContent>
              
              <FeatureVisual className="feature-visual animate-on-scroll">
                <div className="demo-interface">
                  <div className="demo-header">
                    <span className="demo-icon">{feature.demoIcon}</span>
                    <span className="demo-title">{feature.demoTitle}</span>
                  </div>
                  <div className="demo-content">
                    <p>{feature.demoContent}</p>
                    <DemoButton>Interactive Demo Available</DemoButton>
                  </div>
                </div>
              </FeatureVisual>
            </FeatureGrid>
          </div>
        </FeatureSection>
      ))}

      <StatsBanner className="animate-on-scroll">
        <div className="wrap">
          <h2>Trusted by Families Worldwide</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="number">10,000+</div>
              <div className="label">Active Users</div>
            </div>
            <div className="stat">
              <div className="number">95%</div>
              <div className="label">Medication Adherence</div>
            </div>
            <div className="stat">
              <div className="number">50M+</div>
              <div className="label">Doses Tracked</div>
            </div>
            <div className="stat">
              <div className="number">24/7</div>
              <div className="label">Support Available</div>
            </div>
          </div>
        </div>
      </StatsBanner>

      <FinalCTA className="animate-on-scroll">
        <div className="wrap">
          <h2>Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of families who trust GoldenCare Buddy to keep their seniors 
            healthy, connected, and independent. Start your free trial today.
          </p>
          <div className="cta-buttons">
            <Link className="btn primary lg" to="/login">
              Start Free Trial
            </Link>
            <Link className="btn outline lg" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </FinalCTA>
    </ExploreContainer>
  );
};

export default Explore;