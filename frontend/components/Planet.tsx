import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { useEffect, useState } from "react";

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
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isTabletH, _] = useState(false);

    useEffect(() => {
        // Detect mobile screen
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 425);
            setIsTablet(window.innerWidth <= 768)
            setIsTablet(window.innerWidth <= 1080)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={{ height: isMobile? "350px": isTablet? "500px": isTabletH? "750px" : "100%", width: isMobile? "350px": isTablet? "500px": isTabletH? "750px" : "100%", position: 'relative' }}>
            <Canvas
                camera={{ position: isMobile ? [0, 0, 9] : isTablet?[0,0,12]: [0, 0, 10] , fov: isMobile ? 18 : 15 }}
                style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }}
                gl={{ alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight intensity={1} position={[5, 5, 5]} />
                <Planet />
                <OrbitControls enableZoom={false} enableRotate={true} enablePan={false} />
            </Canvas>
        </div>
    );
};

export default RotatingPlanet;

