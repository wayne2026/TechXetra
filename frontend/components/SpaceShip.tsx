import { useRef, useState,useEffect} from "react";
import { Canvas, useFrame  } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import React from "react";

const Planet: React.FC = () => {
    const planetRef = useRef<Mesh | null>(null);

    const { scene } = useGLTF("/Drone.glb");
    const [floatingOffset, setFloatingOffset] = useState(0);
    

    useFrame((_, delta) => {
        setFloatingOffset(floatingOffset + delta);
        if (planetRef.current) {
            planetRef.current.position.y = Math.sin(floatingOffset) * 0.05;
        }
    });

    return <primitive object={scene} ref={planetRef} scale={[1.3, 1.3, 1.3]} position={[0, -0.4, 0]} />;
};

const SpaceShip: React.FC = () => {
    const [isTablet, setIsTablet] = useState(false);
    useEffect(() => {
        // Detect mobile screen
        const handleResize = () => {
            setIsTablet(window.innerWidth <= 1080)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (

        <div style={{ height: isTablet? "500px" : "550px", width: isTablet? "500px" : "550px", position: 'relative' }}>
            <Canvas
                camera={{ position: [5, 0, 9], fov: isTablet? 20: 23}}
                style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} 
                gl={{ alpha: true }} 
            >
                <ambientLight intensity={1} />
                <directionalLight intensity={1} position={[5, 0, 5]} />
                <Planet />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>

    );
};

export default SpaceShip;
