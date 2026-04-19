import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import TranslationButton from './TranslationButton';

// Keyframes
const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  z-index: ${props => props.theme.zIndex.sticky};
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  &.scrolled {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.85);
  }
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg} 0;
  height: 90px;
  position: relative;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  text-decoration: none;
  z-index: 2001;
  
  .logo-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
    font-weight: 800;
    box-shadow: 0 8px 16px ${props => props.theme.colors.primary}40;
    transition: transform 0.3s ease;
  }
  
  &:hover .logo-icon {
    transform: rotate(-5deg) scale(1.05);
  }
  
  .logo-text {
    .brand {
      font-size: ${props => props.theme.fontSizes.xl};
      font-weight: 800;
      color: ${props => props.theme.colors.text};
      line-height: 1.1;
      letter-spacing: -0.5px;
      
      .accent {
        color: ${props => props.theme.colors.primary};
        background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .logo-text {
      display: none;
    }
  }
`;

const DesktopNav = styled.nav`
  display: none;
  
  @media (min-width: 1100px) {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.3);
    padding: 8px;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.02),
      inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  }

  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    padding: 10px 18px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    position: relative;
    
    .nav-icon {
      font-size: 1.1rem;
      opacity: 0.8;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: ${props => props.theme.colors.primary};
      background: rgba(255, 255, 255, 0.6);
      transform: translateY(-1px);
      
      .nav-icon {
        transform: scale(1.1) rotate(-5deg);
      }
    }

    &.active {
      color: white;
      background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
      box-shadow: 0 4px 15px ${props => props.theme.colors.primary}40;
      
      .nav-icon {
        filter: brightness(0) invert(1);
      }
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  z-index: 2001;
`;

const MenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primaryDark};
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;

  @media (max-width: 1099px) { 
    display: flex;
  }
  
  &:hover {
    background: white;
    transform: translateY(-2px);
  }
`;

const MobileNavOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 100px 24px 24px;
  animation: ${slideDown} 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  overflow-y: auto;

  @media (min-width: 1100px) {
    display: none;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    background: rgba(255, 255, 255, 0.4);
    margin-bottom: 8px;
    border-radius: 16px;
    
    .nav-icon {
      font-size: 1.5rem;
      background: white;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    &.active {
      color: ${props => props.theme.colors.primaryDark};
      background: linear-gradient(135deg, ${props => props.theme.colors.primary}15, ${props => props.theme.colors.accent}15);
      border: 1px solid rgba(255,255,255,0.6);
      
      .nav-icon {
        color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const ProfileButtonWrapper = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 6px 20px 6px 6px;
  border-radius: 100px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.9);
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 16px;
    box-shadow: 0 4px 10px ${props => props.theme.colors.primary}30;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .name {
      font-size: 15px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      line-height:1;
    }
    
    .role {
      font-size: 10px;
      font-weight: 600;
      color: ${props => props.theme.colors.primary};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
  }
  
  .chevron {
    color: ${props => props.theme.colors.muted};
    font-size: 10px;
    margin-left: 4px;
    transition: transform 0.3s ease;
    ${props => props.$isOpen && `transform: rotate(180deg);`}
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 6px;
    .user-info, .chevron {
      display: none;
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  min-width: 240px;
  z-index: 2000;
  overflow: hidden;
  animation: ${dropIn} 0.3s cubic-bezier(0.19, 1, 0.22, 1);
`;

const DropdownHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.accent}10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  text-align: center;

  .large-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin: 0 auto 12px;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .name {
    font-weight: 800;
    color: ${props => props.theme.colors.primaryDark};
    font-size: 16px;
  }
  .email {
    font-size: 12px;
    color: ${props => props.theme.colors.muted};
    margin-top: 4px;
    background: white;
    padding: 2px 8px;
    border-radius: 100px;
    display: inline-block;
  }
`;

const DropdownContent = styled.div`
  padding: 8px;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  }

  .item-icon { 
    font-size: 1.1rem;
    width: 28px;
    height: 28px;
    background: ${props => props.theme.colors.bg};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DropdownSeparator = styled.div`
  height: 1px;
  background: rgba(0,0,0,0.05);
  margin: 8px;
`;

const DropdownLogout = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 700;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #fff5f5;
    transform: translateX(4px);
  }

  .item-icon { 
    font-size: 1.1rem;
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(229, 62, 62, 0.1);
  }
`;

const AuthButton = styled(Link)`
  padding: 10px 24px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  text-decoration: none;
  border-radius: 100px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}40;
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}50;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const patientLinks = [
    { to: '/profile', icon: '👤', label: 'My Profile' },
    { to: '/patient-dashboard', icon: '📊', label: 'My Dashboard' }
  ];

  const doctorLinks = [
    { to: '/doctor-profile', icon: '🩺', label: 'Doctor Profile' },
    { to: '/doctor-dashboard', icon: '📊', label: 'My Dashboard' },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', icon: '⚙️', label: 'System Admin' },
  ];

  const links = user.role === 'patient' ? patientLinks : user.role === 'doctor' ? doctorLinks : adminLinks;

  const firstName = user.name.split(' ')[0];
  const avatarContent = user.profilePic ? <img src={user.profilePic} alt={user.name} /> : firstName.charAt(0);

  return (
    <ProfileButtonWrapper ref={ref}>
      <UserButton onClick={() => setOpen(!open)} $isOpen={open}>
        <div className="avatar">
          {avatarContent}
        </div>
        <div className="user-info">
          <span className="name">{firstName}</span>
          <span className="role">{user.role}</span>
        </div>
        <span className="chevron">▼</span>
      </UserButton>

      {open && (
        <DropdownMenu>
          <DropdownHeader>
            <div className="large-avatar">
              {avatarContent}
            </div>
            <div className="name">{user.name}</div>
            <div className="email">{user.email || (user.role === 'patient' ? 'Patient Account' : 'Staff Account')}</div>
          </DropdownHeader>
          <DropdownContent>
            {links.map(link => (
              <DropdownItem key={link.to} to={link.to} onClick={() => setOpen(false)}>
                <span className="item-icon">{link.icon}</span>
                {link.label}
              </DropdownItem>
            ))}
            <DropdownSeparator />
            <DropdownLogout onClick={() => { setOpen(false); onLogout(); }}>
              <span className="item-icon">🚪</span>
              Secure Logout
            </DropdownLogout>
          </DropdownContent>
        </DropdownMenu>
      )}
    </ProfileButtonWrapper>
  );
};

const Header = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const checkSession = () => {
      const adminSession = localStorage.getItem('gc_admin_session');
      const patientSession = localStorage.getItem('gc_patient_session');
      const doctorSession = localStorage.getItem('gc_doctor_session');

      if (adminSession) setUser({ ...JSON.parse(adminSession), role: 'admin' });
      else if (doctorSession) setUser({ ...JSON.parse(doctorSession), role: 'doctor' });
      else if (patientSession) setUser({ ...JSON.parse(patientSession), role: 'patient' });
      else setUser(null);
    };

    window.addEventListener('scroll', handleScroll);
    checkSession();
    window.addEventListener('storage', checkSession);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkSession);
    };
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('gc_admin_session');
    localStorage.removeItem('gc_patient_session');
    localStorage.removeItem('gc_doctor_session');
    setUser(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const DesktopNavigationLinks = () => {
    if (user?.role === 'patient') {
      return (
        <>
          <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
          <Link to="/patient-dashboard" className={isActive('/patient-dashboard') ? 'active' : ''}><span className="nav-icon">📊</span> Dashboard</Link>
        </>
      );
    }
    
    if (user?.role === 'doctor') {
      return (
        <>
          <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
          <Link to="/doctor-dashboard" className={isActive('/doctor-dashboard') ? 'active' : ''}><span className="nav-icon">📊</span> Dashboard</Link>
        </>
      );
    }

    return (
      <>
        <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
        <Link to="/explore" className={isActive('/explore') ? 'active' : ''}><span className="nav-icon">🔍</span> {t('explore') || 'Explore'}</Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}><span className="nav-icon">🌟</span> {t('about') || 'About'}</Link>
      </>
    );
  };

  const MobileNavigationLinks = () => {
    if (user?.role === 'patient') {
      return (
        <>
          <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
          <Link to="/patient-dashboard" className={isActive('/patient-dashboard') ? 'active' : ''}><span className="nav-icon">📊</span> Dashboard</Link>
          <Link to="/pillbox" className={isActive('/pillbox') ? 'active' : ''}><span className="nav-icon">💊</span> Pillbox</Link>
          <Link to="/wellness" className={isActive('/wellness') ? 'active' : ''}><span className="nav-icon">🧘</span> Wellness</Link>
          <Link to="/ai" className={isActive('/ai') ? 'active' : ''}><span className="nav-icon">🤖</span> AI Care</Link>
          <Link to="/family" className={isActive('/family') ? 'active' : ''}><span className="nav-icon">👨‍👩‍👧</span> Family</Link>
        </>
      );
    }
    
    if (user?.role === 'doctor') {
      return (
        <>
          <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
          <Link to="/doctor-dashboard" className={isActive('/doctor-dashboard') ? 'active' : ''}><span className="nav-icon">📊</span> Dashboard</Link>
        </>
      );
    }

    return (
      <>
        <Link to="/home" className={isActive('/home') ? 'active' : ''}><span className="nav-icon">🏠</span> {t('home') || 'Home'}</Link>
        <Link to="/explore" className={isActive('/explore') ? 'active' : ''}><span className="nav-icon">🔍</span> {t('explore') || 'Explore'}</Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}><span className="nav-icon">🌟</span> {t('about') || 'About'}</Link>
        <Link to="/help-center" className={isActive('/help-center') ? 'active' : ''}><span className="nav-icon">❓</span> {t('help') || 'Help'}</Link>
      </>
    );
  };

  return (
    <HeaderWrapper className={scrolled ? 'scrolled' : ''}>
      <div className="wrap">
        <HeaderInner>
          <Logo to="/">
            <div className="logo-icon">GC</div>
            <div className="logo-text">
              <div className="brand">
                GoldenCare <span className="accent">Buddy</span>
              </div>
            </div>
          </Logo>

          <DesktopNav>
            <DesktopNavigationLinks />
          </DesktopNav>

          <HeaderActions>
            <TranslationButton />
            
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <AuthButton to="/login">
                {t('login') || 'Login'}
              </AuthButton>
            )}

            <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? '✖' : '☰'}
            </MenuButton>
          </HeaderActions>
        </HeaderInner>
      </div>

      {mobileMenuOpen && (
        <MobileNavOverlay>
          <MobileNavigationLinks />
        </MobileNavOverlay>
      )}
    </HeaderWrapper>
  );
};

export default Header;
