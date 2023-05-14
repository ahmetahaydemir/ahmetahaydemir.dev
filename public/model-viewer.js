import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
//
let camera, scene, renderer, effect;
//
function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 150, 300);
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2A2A2A);
    scene.fog = new THREE.Fog(0x2A2A2A, 200, 1000);
    // LIGHT
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    //
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);
    // GROUND
    // const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x2A2A2A, depthWrite: false }));
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);
    // GRID
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    scene.add(grid);
    //
    const loader = new FBXLoader();
    loader.load('models/Bighorn.fbx', function (object) {
        //
        object.traverse(function (child) {

            if (child.isMesh) {

                // switch the material here - you'll need to take the settings from the 
                //original material, or create your own new settings, something like:
                const oldMat = child.material;

                child.material = new THREE.MeshLambertMaterial({
                    color: oldMat.color,
                    map: oldMat.map,
                });

            }

        });
        //
        scene.add(object);
    });
    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    //
    effect = new OutlineEffect(renderer);
    //
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 75, 0);
    controls.minDistance = 150;
    controls.maxDistance = 350;
    controls.enablePan = false;
    controls.update();
    //
    window.addEventListener('resize', onWindowResize);
}
//
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function animate() {
    requestAnimationFrame(animate);
    //
    effect.render(scene, camera);
}
//
init();
animate();