import React from 'react';
import SegV3 from './components/SegV3';

/**
 * Main application component for Sentience Metaphysics SEG v3
 * Provides the primary interface for narrative organism interactions
 */
function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <SegV3 />
    </div>
  );
}

export default App;