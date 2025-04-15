// frontend/utils/preloadAssets.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useEffect } from 'react'; // Need useEffect for the hook
import { useLoading } from '../contexts/LoadingContext'; // Import context hook

let cityPromise = null;
let dracoLoader = null;
let isPreloadInitiated = false; // Flag to prevent multiple initializations

// The core preload function (mostly unchanged)
export function preloadCityModel(onLoad, onError) { // Pass callbacks
    if (cityPromise) {
        console.log("Preload already in progress or completed.");
        return cityPromise;
    }
     isPreloadInitiated = true;
     console.log("Initiating city model preload...");

     if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        dracoLoader.setDecoderConfig({ type: 'js' });
    }

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const modelUrl = `${import.meta.env.VITE_ENVIRONMENT === "development" ? "../" : import.meta.env.VITE_BACKEND_URL}assets/localassets/vanderbilt.glb`;

    console.log('Preloading city model URL:', modelUrl);

    cityPromise = new Promise((resolve, reject) => {
        loader.load(
            modelUrl,
            (gltf) => {
                console.log('City model preloaded and parsed successfully.');
                 gltf.scene.position.set(384, -30, 226); // Set position *once* here
                if (onLoad) onLoad(gltf.scene); // Pass scene to callback
                resolve(gltf.scene); // Resolve the promise with the scene
            },
            undefined,
            (error) => {
                console.error('City model preload/parse error:', error);
                cityPromise = null;
                isPreloadInitiated = false;
                if (onError) onError(error);
                reject(error);
            }
        );
    });

    return cityPromise;
}

// Modified hook to store the parsed scene
export function usePreloadCity() {
    // Get setters and state from context
    const { isCityDownloaded, setCityDownloaded, parsedCityScene, setParsedCityScene } = useLoading();

    useEffect(() => {
        // Only start if not already initiated and not already downloaded/parsed
        if (!isPreloadInitiated && !isCityDownloaded) {
            preloadCityModel(
                (scene) => { // Success callback receives the scene
                    setParsedCityScene(scene); // Store the parsed scene in context
                    setCityDownloaded(true); // Mark as downloaded/parsed
                },
                (error) => {
                    console.error("Preload error in hook callback:", error);
                    // Optionally set an error state in context here
                }
            ).catch(err => {
                // Catch promise rejection if not handled by onError
                console.error("Caught preload promise rejection in hook:", err);
            });
        } else if (isCityDownloaded && parsedCityScene) {
             console.log("City already marked as preloaded/parsed in context.");
        } else if (isPreloadInitiated) {
            console.log("Preload initiated but not yet complete.");
             // Optional: You could check the promise status if needed,
             // but usually the context state update handles it.
        }
    }, [isCityDownloaded, setCityDownloaded, parsedCityScene, setParsedCityScene]); // Dependencies
}