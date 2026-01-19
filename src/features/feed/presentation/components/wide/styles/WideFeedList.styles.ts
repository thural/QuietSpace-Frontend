import styled from 'styled-components';

// Wide Feed List Styles
export const WideFeedContainer = styled.div`
  padding: 32px;
  background: #F8F9FA;
  min-height: 100vh;
  
  // Wide display optimizations
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
  align-content: center;
`;

export const WideFeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #1A1A1A;
  }
`;

export const WideFeedActions = styled.div`
  display: flex;
  gap: 16px;
  
  button {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background: #007AFF;
    color: white;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 140px;
    
    &:hover {
      background: #0056CC;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;

export const WideFeedContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
  align-content: center;
`;

export const WideLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007AFF;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const WideEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  h2 {
    margin: 0 0 24px 0;
    color: #666;
    font-size: 24px;
    font-weight: 500;
  }
  
  p {
    margin: 0 0 16px 0;
    color: #999;
    font-size: 16px;
    line-height: 1.5;
    max-width: 400px;
  }
  
  button {
    margin-top: 24px;
    padding: 16px 32px;
    border-radius: 8px;
    border: none;
    background: #007AFF;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #0056CC;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;
