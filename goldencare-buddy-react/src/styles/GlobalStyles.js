import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Modern CSS Reset */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.primary};
    font-size: var(--base-font-size, ${props => props.theme.fontSizes.md});
    font-weight: ${props => props.theme.fontWeights.normal};
    line-height: ${props => props.theme.lineHeights.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Layout wrapper */
  .wrap {
    width: min(95%, 1200px);
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.lg};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      padding: 0 ${props => props.theme.spacing.md};
    }
  }

  /* Accessibility improvements */
  .large-text {
    font-size: 1.25em;
    
    h1, h2, h3, h4, h5, h6 {
      font-size: 1.2em;
    }
    
    .btn {
      font-size: 1.1em;
      padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
      min-height: 56px;
    }
    
    .form-input {
      font-size: 1.1em;
      padding: ${props => props.theme.spacing.xl};
    }
  }

  .high-contrast {
    filter: contrast(1.3);
    
    .btn {
      border-width: 3px;
    }
    
    input, textarea, select {
      border-width: 3px;
    }
  }

  /* Dark Mode */
  body.dark-mode {
    --bg: #1a202c;
    --card: #2d3748;
    --text: #e2e8f0;
    --muted: #a0aec0;
    --border: #4a5568;
    background: #1a202c;
    color: #e2e8f0;
  }

  body.dark-mode .btn.primary {
    background: #4299e1;
    border-color: #4299e1;
  }

  body.dark-mode .btn.secondary {
    background: #48bb78;
    border-color: #48bb78;
  }

  body.dark-mode .card,
  body.dark-mode .form-input,
  body.dark-mode header,
  body.dark-mode footer {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }

  body.dark-mode .form-input {
    color: #e2e8f0;
  }

  body.dark-mode .text-muted {
    color: #a0aec0;
  }

  /* Reduced Motion */
  body.reduced-motion *,
  body.reduced-motion *::before,
  body.reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .show-focus *:focus {
    outline: 4px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  /* Improved focus visibility */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Skip link for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: ${props => props.theme.colors.primary};
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: ${props => props.theme.zIndex.skipLink};
    
    &:focus {
      top: 6px;
    }
  }

  /* Modern button styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
    border: 2px solid transparent;
    border-radius: ${props => props.theme.borderRadius.lg};
    font-family: inherit;
    font-weight: ${props => props.theme.fontWeights.semibold};
    font-size: ${props => props.theme.fontSizes.md};
    text-decoration: none;
    cursor: pointer;
    transition: all ${props => props.theme.transitions.normal};
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    min-height: 48px;
    box-sizing: border-box;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    
    &:not(:disabled):hover {
      transform: translateY(-2px);
    }
    
    &:not(:disabled):active {
      transform: translateY(0);
    }
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      width: 100%;
      margin-bottom: ${props => props.theme.spacing.md};
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .btn.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.primaryDark};
      border-color: ${props => props.theme.colors.primaryDark};
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }

  .btn.secondary {
    background: ${props => props.theme.colors.accent};
    color: white;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: ${props => props.theme.shadows.sm};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.accentDark};
      border-color: ${props => props.theme.colors.accentDark};
      box-shadow: ${props => props.theme.shadows.md};
    }
  }

  .btn.outline {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.primary};
      color: white;
    }
  }

  .btn.ghost {
    background: transparent;
    color: ${props => props.theme.colors.muted};
    border-color: ${props => props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.cardHover};
      color: ${props => props.theme.colors.text};
      border-color: ${props => props.theme.colors.borderDark};
    }
  }

  .btn.danger {
    background: ${props => props.theme.colors.error};
    color: white;
    border-color: ${props => props.theme.colors.error};
    
    &:hover:not(:disabled) {
      background: #c53030;
      border-color: #c53030;
    }
  }

  .btn.sm {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSizes.sm};
    min-height: 36px;
  }

  .btn.lg {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
    font-size: ${props => props.theme.fontSizes.lg};
    min-height: 56px;
  }

  .btn.tiny {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSizes.sm};
    min-height: 32px;
    border-radius: ${props => props.theme.borderRadius.md};
  }

  /* Modern card styles */
  .card {
    background: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.xl};
    box-shadow: ${props => props.theme.shadows.md};
    padding: ${props => props.theme.spacing.xl};
    border: 1px solid ${props => props.theme.colors.border};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      box-shadow: ${props => props.theme.shadows.lg};
      transform: translateY(-2px);
    }
  }

  .card.elevated {
    box-shadow: ${props => props.theme.shadows.xl};
    
    &:hover {
      box-shadow: ${props => props.theme.shadows['2xl']};
    }
  }

  .card.bordered {
    border: 2px solid ${props => props.theme.colors.border};
  }

  /* Typography utilities */
  .text-muted {
    color: ${props => props.theme.colors.muted};
  }

  .text-muted-light {
    color: ${props => props.theme.colors.mutedLight};
  }

  .text-primary {
    color: ${props => props.theme.colors.primary};
  }

  .text-accent {
    color: ${props => props.theme.colors.accent};
  }

  .text-success {
    color: ${props => props.theme.colors.success};
  }

  .text-warning {
    color: ${props => props.theme.colors.warning};
  }

  .text-error {
    color: ${props => props.theme.colors.error};
  }

  .lead {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.normal};
    line-height: ${props => props.theme.lineHeights.relaxed};
    color: ${props => props.theme.colors.muted};
  }

  .section-title {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    line-height: ${props => props.theme.lineHeights.tight};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
  }

  .subtitle {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: ${props => props.theme.fontWeights.medium};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  /* Grid layouts */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing['2xl']};
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    .grid-2 {
      grid-template-columns: 1fr 1fr;
    }
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xl};
  }

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    .grid-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    .grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .grid-4 {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xl};
  }

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    .grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    .grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Form styles */
  .form-group {
    margin-bottom: ${props => props.theme.spacing.xl};
  }

  .form-label {
    display: block;
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.fontSizes.md};
  }

  .form-input {
    width: 100%;
    padding: ${props => props.theme.spacing.lg};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    font-size: ${props => props.theme.fontSizes.md};
    font-family: inherit;
    transition: all ${props => props.theme.transitions.normal};
    background: ${props => props.theme.colors.card};
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.outline};
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.mutedLight};
    }
    
    &:invalid {
      border-color: ${props => props.theme.colors.error};
    }
  }

  /* Badge/Status styles */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: ${props => props.theme.fontSizes.sm};
    font-weight: ${props => props.theme.fontWeights.semibold};
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .badge.success {
    background: ${props => props.theme.colors.successLight};
    color: ${props => props.theme.colors.success};
  }

  .badge.warning {
    background: ${props => props.theme.colors.warningLight};
    color: ${props => props.theme.colors.warning};
  }

  .badge.error {
    background: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.error};
  }

  .badge.info {
    background: ${props => props.theme.colors.infoLight};
    color: ${props => props.theme.colors.info};
  }

  /* Loading states */
  .loading {
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: currentColor;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive design improvements */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .section-title {
      font-size: ${props => props.theme.fontSizes['3xl']};
      text-align: center;
    }
    
    .lead {
      font-size: ${props => props.theme.fontSizes.lg};
      text-align: center;
    }
    
    .grid-2, .grid-3, .grid-4 {
      grid-template-columns: 1fr;
      gap: ${props => props.theme.spacing.lg};
    }
    
    /* Improve touch targets */
    .btn {
      min-height: 48px;
      font-size: ${props => props.theme.fontSizes.lg};
    }
    
    .form-input {
      min-height: 48px;
      font-size: ${props => props.theme.fontSizes.lg};
    }
  }
  
  /* Extra small screens */
  @media (max-width: 480px) {
    .wrap {
      padding: 0 ${props => props.theme.spacing.md};
    }
    
    .btn {
      padding: ${props => props.theme.spacing.lg};
      font-size: ${props => props.theme.fontSizes.md};
    }
  }

  /* Dark mode support preparation */
  @media (prefers-color-scheme: dark) {
    .auto-dark {
      background: #1a202c;
      color: #e2e8f0;
    }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    .btn {
      border: 1px solid black;
      text-decoration: none;
    }
  }
  
  /* Blur effect for popup backgrounds */
  .blurred {
    filter: blur(8px);
    transition: filter 0.3s ease;
  }
`;