console.log("Game - Module - Cube");
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

THREE.ColorManagement.enabled = false; // TODO: Consider enabling color management.

let container;
let camera, scene, renderer, effect;
let particleLight;

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.set(400, 400, 400 * 3);

    //

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444488);

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Materials

    const cubeWidth = 400;
    const numberOfSphersPerSide = 5;
    const sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5;
    const stepSize = 1.0 / numberOfSphersPerSide;
    const format = (renderer.capabilities.isWebGL2) ? THREE.RedFormat : THREE.LuminanceFormat;

    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 16);

    for (let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex++) {

        const colors = new Uint8Array(alphaIndex + 2);

        for (let c = 0; c <= colors.length; c++) {

            colors[c] = (c / colors.length) * 256;

        }

        const gradientMap = new THREE.DataTexture(colors, colors.length, 1, format);
        gradientMap.needsUpdate = true;

        for (let beta = 0; beta <= 1.0; beta += stepSize) {

            for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {

                // basic monochromatic energy preservation
                const diffuseColor = new THREE.Color().setHSL(alpha, 0.5, gamma * 0.5 + 0.1).multiplyScalar(1 - beta * 0.2);

                const material = new THREE.MeshToonMaterial({
                    color: diffuseColor,
                    gradientMap: gradientMap
                });

                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.x = alpha * 400 - 200;
                mesh.position.y = beta * 400 - 200;
                mesh.position.z = gamma * 400 - 200;

                scene.add(mesh);

            }

        }

    }
    // Particle
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry(8, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    particleLight.position.x = -100;
    particleLight.position.y = 200;
    particleLight.position.z = -100;
    scene.add(particleLight);
    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 800);
    particleLight.add(pointLight);
    scene.add(new THREE.AmbientLight(0x888888, 2));
    //
    effect = new OutlineEffect(renderer);
    //
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 800;
    controls.maxDistance = 1600;
    controls.enablePan = false;
    //
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // const timer = Date.now() * 0.00025;
    //
    // particleLight.position.x = Math.sin(timer * 7) * 300;
    // particleLight.position.y = Math.cos(timer * 5) * 400;
    // particleLight.position.z = Math.cos(timer * 3) * 300;
    //
    effect.render(scene, camera);
}
//
init();
animate();