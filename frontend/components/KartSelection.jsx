import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Chassis } from './Chassis';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BeetlePreview = () => {
  return (
    <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Chassis />
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={4}
      />
    </Canvas>
  );
};

const KartSelection = () => {
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [selectedKart, setSelectedKart] = useState(null);
    const navigate = useNavigate();
  
    return (
      <div className="h-screen w-screen bg-[url('/path/to/background.jpg')] bg-cover bg-center">
        <div className="w-full h-full p-6">
          {/* Header */}
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: '#ff8c00',
              color: 'white',
              '&:hover': { backgroundColor: '#ff7000' },
              padding: '8px 16px',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ArrowBackIcon />
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>RETURN</Typography>
          </IconButton>
  
          <Typography variant="h4" sx={{ color: '#4a90e2', textAlign: 'center', marginY: 4, fontWeight: 'bold' }}>
            Character/Kart Select
          </Typography>
  
          {/* Main Content - Fixed Grid Layout */}
          <div className="flex justify-center gap-12 w-full">
            {/* Characters Section */}
            <div className="w-1/2">
              <Box sx={{ backgroundColor: '#ff8c00', padding: 4, borderRadius: '20px', height: '100%' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }}>
                  CHARACTERS
                </Typography>
                <div className="grid grid-cols-2 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <button 
                      key={i}
                      className={`h-48 rounded-xl border-4 gap-2
                        ${selectedCharacter === i ? 'border-blue-400 ring-4 ring-blue-300' : 'border-orange-300'} 
                        bg-orange-100 hover:border-blue-400 overflow-hidden transition-all duration-200 relative`}
                      onClick={() => setSelectedCharacter(selectedCharacter === i ? null : i)}
                    >
                      <div className="w-full h-full flex items-center justify-center text-orange-800 font-bold text-7xl">
                        ? <br />
                        Coming Soon
                      </div>
                      {selectedCharacter === i && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Box>
            </div>
  
            {/* Karts Section */}
            <div className="w-1/2">
              <Box sx={{ backgroundColor: '#ff8c00', padding: 4, borderRadius: '20px', height: '100%' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: 3 }}>
                  KARTS
                </Typography>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    className={`h-48 rounded-xl border-4
                      ${selectedKart === 0 ? 'border-blue-400 ring-4 ring-blue-300' : 'border-orange-300'} 
                      bg-orange-100 hover:border-blue-400 overflow-hidden transition-all duration-200 relative`}
                    onClick={() => setSelectedKart(selectedKart === 0 ? null : 0)}
                  >
                    <div className="w-full h-full">
                      <BeetlePreview />
                    </div>
                    {selectedKart === 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Selected
                      </div>
                    )}
                  </button>
                  
                  {[...Array(4)].map((_, i) => (
                    <button 
                      key={i}
                      className="h-48 rounded-xl border-4 border-orange-300 
                        bg-orange-100 overflow-hidden transition-all duration-200 relative
                        cursor-not-allowed"
                    >
                      <div className="w-full h-full flex items-center justify-center text-orange-800 font-bold text-7xl">
                        ? <br />
                        Coming Soon
                      </div>
                    </button>
                  ))}
                </div>
              </Box>
            </div>
          </div>
  
          {/* Footer Buttons */}
          <div className="flex justify-between mt-8">
            <IconButton
              onClick={() => navigate('/settings')}
              sx={{
                backgroundColor: '#ff8c00',
                color: 'white',
                '&:hover': { backgroundColor: '#ff7000' },
                padding: '8px 16px',
                borderRadius: '25px'
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Settings</Typography>
            </IconButton>
            
            <IconButton
              onClick={() => selectedKart !== null && navigate('/game')}
              sx={{
                backgroundColor: '#4a90e2',
                color: 'white',
                '&:hover': { backgroundColor: '#357ABD' },
                padding: '8px 16px',
                borderRadius: '25px',
                opacity: selectedKart === null ? 0.5 : 1,
                cursor: selectedKart === null ? 'not-allowed' : 'pointer'
              }}
              disabled={selectedKart === null}
            >
              <Typography sx={{ color: 'white', fontWeight: 'bold' }}>NEXT</Typography>
              <span className="text-2xl">→</span>
            </IconButton>
          </div>
        </div>
      </div>
    );
  };
  
  export default KartSelection;