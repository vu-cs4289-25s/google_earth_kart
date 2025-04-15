import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import { usePreloadCity } from '../utils/preloadAssets';
import BackgroundMusic from './BackgroundMusic';

const HideGlobalBackground = () => (
    <style>
        {`
      .earth-background {
        display: none !important;
      }
    `}
    </style>
);

const LandingPage = () => {
    const navigate = useNavigate();
    usePreloadCity();

    const handleStartClick = () => {
        navigate('/kart-select');
    };
    

    return (
        <>
            <BackgroundMusic src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" volume={0.5} playOnStart={true} />

            <HideGlobalBackground />

            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundImage: 'url("/landing-background-figma.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'hidden',
                    color: 'white',
                    textAlign: 'center',

                    '@keyframes carZoomAndPath': {
                        '0%': {
                            transform: 'translateX(-60%) translateY(-40%) scale(0.02) rotate(-10deg)',
                        },
                        '7%': {
                            transform: 'translateX(-60%) translateY(-30%) scale(0.05) rotate(-7deg)',
                            opacity: 0.05, 
                        },
                        '30%': {
                            transform: 'translateX(-57%) translateY(-25%) scale(0.09) rotate(-5deg)',
                            opacity: 0.3,
                        },
                         '45%': {
                            transform: 'translateX(-40%)  translateY(5%) scale(0.2)',
                            opacity: 0.7,
                        },
                        '65%': {
                            transform: 'translateX(-35%)  translateY(10%) scale(0.4)',
                            opacity: 0.9,
                        },
                        '100%': {
                            transform: 'translateX(-25%) translateY(20%) scale(0.8) rotate(0deg)',
                            opacity: 1,
                        },
                    },

                     '@keyframes pulse': {
                         '0%': {
                             boxShadow: '0 4px 10px rgba(0,0,0,0.25), 0 0 0 0 rgba(255, 255, 255, 0.6)',
                        },
                         '70%': {
                             boxShadow: '0 4px 10px rgba(0,0,0,0.25), 0 0 0 12px rgba(255, 255, 255, 0)',
                        },
                         '100%': {
                             boxShadow: '0 4px 10px rgba(0,0,0,0.25), 0 0 0 0 rgba(255, 255, 255, 0)',
                        },
                    },
                '@keyframes logoFloat': {
                        '0%': {
                            transform: 'translateY(0px) scale(1) rotate(-7deg)', 
                        },
                        '50%': {
                            transform: 'translateY(0px) scale(1.03) rotate(-6deg)',
                        },
                        '100%': {
                            transform: 'translateY(0px) scale(1) rotate(-7deg)',
                        },
                    }
                }}
            >
                <Box
                    component="img"
                    src="/google-earth-kart-logo.png"
                    alt="Google Earth Kart Logo"
                    sx={{
                        position: 'absolute',
                        top: { xs: '8%', sm: '10%', md: '12%' },
                        left: { xs: '5%', sm: '10%', md: '8%' },
                        transform: 'rotate(-7deg)',
                        maxWidth: { xs: '35%', sm: '35%', md: '40%', lg: '42%' },
                        height: 'auto',
                        zIndex: 2,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        animation: 'logoFloat 4s ease-in-out infinite alternate',
                    }}
                />

                <Box
                    component="img"
                    src="/landing-placeholder.png"
                    alt="Google Earth Kart Characters"
                    sx={{
                        position: 'absolute',
                        bottom: { xs: '8%', sm: '5%', md: '3%', lg: '10%' },
                        left: '50%',
                        left: { xs: '45%', sm: '45%', md: '50%', lg: '60%' },

                        opacity: 0,
                        transform: 'translateX(-60%) translateY(40%) scale(0.15) rotate(-10deg)',

                        maxWidth: { xs: '65%', sm: '70%', md: '60%', lg: '45%' },
                        height: 'auto',
                        zIndex: 1,
                        pointerEvents: 'none',

                        animation: `carZoomAndPath 0.9s cubic-bezier(0, 0.2, 0.7, 1) forwards`,
                    }}
                />

                <Button
                    onClick={handleStartClick}
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        bottom: '5vh',
                        right: '3vw',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        padding: { xs: '10px 15px', sm: '12px 20px', md: '15px 25px', lg: '18px 30px' },
                        borderRadius: '45px',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.6rem', lg: '1.8rem' }, 
                        fontWeight: 'bold',
                        borderWidth: { xs: '6px', sm: '8px', md: '10px', lg: '10px' }, 
                        borderStyle: 'solid',
                        borderColor: 'white',
                        minWidth: { xs: '150px', sm: '180px', md: '220px', lg: '240px' }, 
                        minHeight: { xs: '65px', sm: '75px', md: '85px', lg: '95px' }, 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                        transition: 'transform 0.2s ease-in-out, background-color 0.2s',
                        zIndex: 3,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#357ABD',
                            transform: 'scale(1.05)',
                        },
                        animation: 'pulse 2s infinite',
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <span>Click to Start</span>
                </Button>
            </Box>
        </>
    );
};

export default LandingPage;