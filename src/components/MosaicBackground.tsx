import React, { useEffect, useState } from 'react';

export const MosaicBackground: React.FC = () => {
  const [tiles, setTiles] = useState<number[]>([]);

  useEffect(() => {
    // Generate enough tiles to cover screen roughly
    // 24 for desktop, 12 for mobile logic simulated by just generating 30
    const count = 30; 
    setTiles(Array.from({ length: count }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
      {/* Background Image Layer - darkened */}
      <div className="absolute inset-0 bg-primary-dark opacity-90 z-0"></div>
      
      {/* Mosaic Grid */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-6 grid-rows-4 md:grid-rows-4 gap-0 opacity-20">
        {tiles.map((i) => (
          <MosaicTile key={i} index={i} />
        ))}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-secondary-dark/80 to-primary-dark/95 z-10 backdrop-blur-[1px]"></div>
    </div>
  );
};

const MosaicTile: React.FC<{ index: number }> = ({ index }) => {
  const [opacity, setOpacity] = useState(0);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    // Assign a random image from picsum to simulate church photos
    // Use index as seed base to be consistent but varied
    const seed = 500 + index;
    setBgImage(`https://picsum.photos/id/${seed}/400/400`);
    
    const animate = () => {
      // Randomly toggle opacity
      const randomDelay = Math.random() * 5000;
      setTimeout(() => {
        setOpacity(prev => prev === 0 ? Math.random() * 0.5 + 0.2 : 0);
        animate();
      }, 2000 + randomDelay);
    };

    animate();
  }, [index]);

  return (
    <div 
      className="w-full h-full bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        opacity: opacity 
      }}
    />
  );
};
