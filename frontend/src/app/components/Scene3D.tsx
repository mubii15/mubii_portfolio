import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create abstract 3D objects
    const geometry1 = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const geometry2 = new THREE.IcosahedronGeometry(1.5, 0);
    const geometry3 = new THREE.OctahedronGeometry(1.2, 0);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      emissive: 0x666666,
    });

    const torus = new THREE.Mesh(geometry1, material);
    const icosahedron = new THREE.Mesh(geometry2, material);
    const octahedron = new THREE.Mesh(geometry3, material);

    torus.position.set(0, 0, 0);
    icosahedron.position.set(3, 1, -2);
    octahedron.position.set(-3, -1, -1);

    scene.add(torus);
    scene.add(icosahedron);
    scene.add(octahedron);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);

    scene.add(ambientLight);
    scene.add(pointLight);

    camera.position.z = 8;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.005;
      torus.rotation.y += 0.005;

      icosahedron.rotation.x += 0.01;
      icosahedron.rotation.y += 0.01;

      octahedron.rotation.x -= 0.008;
      octahedron.rotation.y -= 0.008;

      // Mouse influence
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 opacity-20" />;
}
