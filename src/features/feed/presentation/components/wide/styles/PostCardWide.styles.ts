import styled from 'styled-components';

// Wide Post Card Styles
export const WideCard = styled.div`
  padding: 24px;
  margin: 12px 0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  
  // Wide display optimizations
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

export const WideContent = styled.div`
  flex: 1;
  min-width: 0;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: #1A1A1A;
  }
  
  p {
    margin: 0 0 16px 0;
    font-size: 15px;
    line-height: 1.5;
    color: #4A5568;
    flex: 1;
  }
`;

export const WideSidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WideHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const WideAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export const WideActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: #007AFF;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
    
    &:hover {
      background: #0056CC;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;

export const WideStats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  
  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .stat-label {
    font-weight: 500;
    color: #999;
  }
`;
