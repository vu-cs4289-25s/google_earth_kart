import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';

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

    const handleStartClick = () => {
        navigate('/kart-select');
    };
    

    return (
        <>
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
                            transform: 'translateX(-40%) translateY(-50%) scale(0.02) rotate(-10deg)',
                        },
                        '7%': {
                            transform: 'translateX(-40%) translateY(-45%) scale(0.05) rotate(-7deg)',
                            opacity: 0.4, 
                        },
                         '50%': {
                            opacity: 0.8,
                        },
                        '100%': {
                            transform: 'translateX(-10%) translateY(15%) scale(0.8) rotate(0deg)',
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
                        top: { xs: '8%', sm: '10%', md: '17%' },
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
                        bottom: { xs: '8%', sm: '5%' },
                        left: '50%',

                        opacity: 0,
                        transform: 'translateX(-70%) translateY(150%) scale(0.15) rotate(-10deg)',

                        maxWidth: { xs: '85%', sm: '70%', md: '60%', lg: '45%' },
                        height: 'auto',
                        zIndex: 1,
                        pointerEvents: 'none',

                        animation: `carZoomAndPath 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                    }}
                />

                <Button
                    onClick={handleStartClick}
                    variant="contained"
                     sx={{
                        height: '15vh',
                        width: '22vw',
                        position: 'absolute',
                        bottom: '5vh',
                        right: '3vw',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        padding: '10px 25px',
                        borderRadius: '45px',
                        fontSize: { xs: '0.8rem', sm: '1.2rem', md: '2.0rem', lg: '2.3rem' },
                        fontWeight: 'bold',
                        border: '12px solid white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                        transition: 'transform 0.2s ease-in-out, background-color 0.2s',
                        zIndex: 3,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#357ABD',
                            transform: 'scale(1.05)',
                        },
                        animation: 'pulse 2s infinite',
                    }}
                >
                    Click to Start
                </Button>
            </Box>
        </>
    );
};

export default LandingPage;