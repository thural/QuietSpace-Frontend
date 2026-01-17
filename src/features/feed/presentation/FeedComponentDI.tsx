import * as React from 'react';
import { DIProvider } from '../../../core/di';
import { Container } from '../../../core/di';
import { FeedService, useFeedDI } from '../application/hooks/useFeedDI';

// DI-enabled Feed Component
const FeedComponentDI: React.FC = () => {
  const { posts, loading, fetchFeed, isOverlayOpen, toggleOverlay } = useFeedDI();
  
  return (
    <div>
      <h2>DI-Enabled Feed</h2>
      <button onClick={fetchFeed} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Feed'}
      </button>
      
      <button onClick={toggleOverlay}>
        {isOverlayOpen ? 'Close Overlay' : 'Open Overlay'}
      </button>
      
      {posts && (
        <div>
          <h3>Posts:</h3>
          <pre>{JSON.stringify(posts, null, 2)}</pre>
        </div>
      )}
      
      {isOverlayOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3>Overlay Content</h3>
            <p>This is managed by DI service!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper component with DI provider
const FeedWithDI: React.FC = () => {
  const container = Container.create();
  container.registerSingleton(FeedService);
  
  return (
    <DIProvider container={container}>
      <FeedComponentDI />
    </DIProvider>
  );
};

export { FeedWithDI, FeedComponentDI };
