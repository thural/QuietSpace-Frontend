import styled from 'styled-components';

// Mobile Feed List Styles
export const MobileFeedContainer = styled.div`
  padding: 16px;
  background: #F8F9FA;
  min-height: 100vh;
  
  // Mobile optimizations
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
`;

export const MobileFeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #E1E4E8;
  position: sticky;
  top: 0;
  z-index: 10;
  
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1A1A1A;
  }
`;

export const MobileFeedActions = styled.div`
  display: flex;
  gap: 8px;
  
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

export const MobileFeedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MobileLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007AFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const MobileEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  h2 {
    margin: 0 0 16px 0;
    color: #666;
    font-size: 18px;
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: #999;
    font-size: 14px;
    line-height: 1.4;
  }
  
  button {
    margin-top: 16px;
    padding: 12px 24px;
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
  }
`;
