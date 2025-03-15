import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Minimap({ target }) {
  const { gl, scene, size, camera: mainCamera } = useThree();
  const minimapCamera = useRef(null);

  // Create minimap camera once
  useEffect(() => {
    // Calculate aspect ratio and define a constant for view size.
    const aspect = size.width / size.height;
    const d = 18; // adjust 'd' to control the scale of the view
  
    minimapCamera.current = new THREE.OrthographicCamera(
      -d * aspect, // left
      d * aspect,  // right
      d,           // top
      -d,          // bottom
      0.1,         // near
      1000         // far
    );
    minimapCamera.current.position.set(0, 20, 0);
    minimapCamera.current.lookAt(0, 0, 0);
  }, [size]);
  

  // We will save the old viewport/scissor values here
  const oldViewport = useRef(new THREE.Vector4());
  const oldScissor = useRef(new THREE.Vector4());
  const oldScissorTest = useRef(false);

  useFrame(() => {
    // 0) Render the main scene manually first.
    // This ensures the main scene fills the entire canvas.
    gl.autoClear = true; // make sure canvas is cleared
    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissorTest(false);
    gl.render(scene, mainCamera);

    // If the minimap camera or target isn't ready, skip rendering
    if (!minimapCamera.current || !target.current) return;

    // 1) Make the minimap camera follow the player
    const playerPos = target.current.getWorldPosition(new THREE.Vector3());
    minimapCamera.current.position.set(playerPos.x, playerPos.y + 50, playerPos.z);
    minimapCamera.current.lookAt(playerPos.x, playerPos.y, playerPos.z);

    // 2) Save the current viewport/scissor
    gl.getViewport(oldViewport.current);
    gl.getScissor(oldScissor.current);
    oldScissorTest.current = gl.getScissorTest();

    // 3) Define the minimap's region (top-right corner)
    const mapWidth = size.width / 5;
    const mapHeight = size.height / 5;
    const x = size.width - mapWidth;
    const y = size.height - mapHeight;

    // 4) Set up the viewport and scissor for the minimap.
    gl.autoClear = false;    // Don't clear color buffer so main scene remains.
    gl.clearDepth();         // Clear depth so the minimap scene draws correctly.
    gl.setViewport(x, y, mapWidth, mapHeight);
    gl.setScissor(x, y, mapWidth, mapHeight);
    gl.setScissorTest(true);

    // 5) Render the minimap (scene from the minimap camera).
    gl.render(scene, minimapCamera.current);

    // 6) Restore old viewport/scissor so subsequent frames are unaffected
    gl.setViewport(
      oldViewport.current.x,
      oldViewport.current.y,
      oldViewport.current.z,
      oldViewport.current.w
    );
    gl.setScissor(
      oldScissor.current.x,
      oldScissor.current.y,
      oldScissor.current.z,
      oldScissor.current.w
    );
    gl.setScissorTest(oldScissorTest.current);

    gl.autoClear = true; // ensure autoClear is re-enabled for subsequent frames
  }, 1); // Priority 1 => after main scene (priority 0)

  return null;
}
