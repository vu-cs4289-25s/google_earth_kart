// CarRegistry.js - A simple registry of available car models
import { useGLTF } from "@react-three/drei";

// Preload all car models
useGLTF.preload("/2020_kia_soul_ex.glb");
useGLTF.preload("/Beetle.glb");
useGLTF.preload("/vandy-van.glb");
useGLTF.preload("/Model3.glb");
useGLTF.preload("/mario.glb");
useGLTF.preload("/low_poly_tesla-_cyber_truck.glb");
useGLTF.preload("/McQueen.glb");
useGLTF.preload("/toyota_sienna_2016.glb");
// Add here pls

const CAR_MODELS = [
    {
        id: "kia-soul",
        name: "Kia Soul",
        description: "Modern compact crossover",
        modelPath: "/2020_kia_soul_ex.glb",
        unlocked: true,
    },
    {
        id: "beetle",
        name: "VW Beetle",
        description: "Classic Volkswagen Beetle",
        modelPath: "/Beetle.glb",

        unlocked: true,
    },
    {
        id: "vandyVan",
        name: "Vandy Van",
        description: "No one calls it Vandy ride",
        modelPath: "/vandy-van.glb",
        unlocked: true,
    },
    {
        id: "model3",
        name: "Graham Car-d",
        description: "Vroom Vroom",
        modelPath: "/Model3.glb",
        unlocked: true,
    },
    {
        id: "mario-kart",
        name: "Mario", 
        description: "Let's-a go!",
        modelPath: "/mario.glb",
        unlocked: true,
    },
    {
        id: "cybertruck",
        name: "Cybertruck",
        description: "We can only do so much",
        modelPath: "/low_poly_tesla-_cyber_truck.glb",
        unlocked: true,
    },
    {
        id: "mcqueen",
        name: "Lightning McQueen",
        description: "Ka-chow!",
        modelPath: "/McQueen.glb",
        unlocked: true,
    },
    {
        id: "sienna",
        name: "Toyota Sienna",
        description: "Overkill",
        modelPath: "/toyota_sienna_2016.glb",
        unlocked: true,
    },
    // Add here
    {
        id: "coming-soon-1",
        name: "Coming Soon",
        description: "This car will be available soon!",
        modelPath: null,
        thumbnail: "/locked-car.jpg",
        unlocked: false,
    },
];

// Helper func to get car by ID
export const getCarById = (id) => {
    return CAR_MODELS.find((car) => car.id === id) || CAR_MODELS[0];
};

// All available cars
export const getAvailableCars = () => {
    return CAR_MODELS.filter((car) => car.unlocked);
};

// All cars including locked ones
export const getAllCars = () => {
    return CAR_MODELS;
};

export default CAR_MODELS;
