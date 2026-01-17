import styled from 'styled-components';

// Mobile Post Card Styles
export const MobileCard = styled.div`
  padding: 16px;
  margin: 8px 0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  // Mobile optimizations
  touch-action: manipulation;
  min-height: 44px; // Minimum touch target
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
`;

export const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const MobileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

export const MobileContent = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    color: #666;
  }
`;

export const MobileActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  
  button {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background: #007AFF;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #0056CC;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;
