import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import React from "react";

const Planet: React.FC = () => {
    const planetRef = useRef<Mesh | null>(null);

    const { scene } = useGLTF("/Fractured_Cosmos_0912191635.glb");

    useFrame(() => {
        if (planetRef.current) {
            planetRef.current.rotation.y += 0.01;
        }
    });

    return <primitive object={scene} ref={planetRef} scale={[1.3, 1.3, 1.3]} position={[0, 0, 0]} />;
};

const RotatingPlanet: React.FC = () => {
    return (

        <div style={{ height: "100%", width: "100%", position: 'relative' }}> {/* Ensure div is sized */}
            <Canvas
                camera={{ position: [0, 0, 10], fov: 15 }}
                style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} // Ensure canvas fills parent
                gl={{ alpha: true }} // Transparent background
            >
                <ambientLight intensity={0.5} />
                <directionalLight intensity={1} position={[5, 5, 5]} />
                <Planet />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>

    );
};

export default RotatingPlanet;
