import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    TextureLoader,
    Triangle
} from 'three'


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

const twoPi = Math.PI * 2;

const geometry = new THREE.SphereGeometry(.5, 64, 64);
const icosahedronGeo = new THREE.TorusGeometry(12, 3, 16, 100);
const ConeGeometry = new THREE.ConeGeometry(5, 15, 64);
const TorusKnot = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
const RingGeometryShape = new THREE.RingGeometry( 1, 5, 32 );


// Loading 
const texturesLoader = new THREE.TextureLoader();
const normalTextue = texturesLoader.load('/textures/NormalMap.png');
const normalTextueForCone = texturesLoader.load('/textures/normal_map_blended_bedding.jpg');
const normalTextueForRing = texturesLoader.load('/textures/hex.jpg');

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.8
material.roughness = 0.2
material.normalMap = normalTextue;
material.color = new THREE.Color(0x292929)

const materialForCone = new THREE.MeshStandardMaterial()
materialForCone.metalness = 0.8
materialForCone.roughness = 0.2
materialForCone.normalMap = normalTextueForCone;
materialForCone.color = new THREE.Color(0x292929)

const materialForRing = new THREE.MeshStandardMaterial()
materialForRing.metalness = 0.8
materialForRing.roughness = 0.2
materialForRing.normalMap = normalTextueForRing;
materialForRing.color = new THREE.Color(0x292929)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const debug = true

//Notes
//function buildLight(folderName="FOLDER", nameOfLight, sliderValue, sliderStepValue, x=1,y=1,z=1, intensityValue = 1, helperOn = true)

const pointLight2 = buildLight("Light1", "pointLight2", 25, 0.001, -4.206, 5.53, 6.412, 3.014, debug);
const pointLight3 = buildLight("Light2", "pointLight3", 25, 0.001, -2.631, -0.646, 6.412, 3.014, debug);
const pointLight4 = buildLight("Light3", "pointLight4", 25, 0.001, -25, 4.45, 13.82, 3.014, debug);

//
//----------------------------------------------------------------
//

const sphere = new THREE.Mesh(geometry, material)

sphere.position.x = 3
sphere.position.y = 0
sphere.position.z = 0

const sphereFolder = gui.addFolder("Sphere");
sphereFolder.add(sphere.position, "x", -10, 10)
sphereFolder.add(sphere.position, "y", -10, 10)
sphereFolder.add(sphere.position, "z", -10, 10)

//
//----------------------------------------------------------------
//

const icosahedron = new THREE.Mesh(icosahedronGeo, materialForRing)

icosahedron.position.x = 0
icosahedron.position.y = 2
icosahedron.position.z = 0

const icosahedronFolder = gui.addFolder("Icosahedron");
icosahedronFolder.add(icosahedron.position, "x", -20, 20)
icosahedronFolder.add(icosahedron.position, "y", -20, 20)
icosahedronFolder.add(icosahedron.position, "z", -20, 20)

//
//----------------------------------------------------------------
//

const cone = new THREE.Mesh(ConeGeometry, materialForCone)
cone.position.x = -12.3
cone.position.y = -0.4
cone.position.z = 10

const coneFolder = gui.addFolder("Cone");
coneFolder.add(cone.position, "x", -20, 20)
coneFolder.add(cone.position, "y", -20, 20)
coneFolder.add(cone.position, "z", -20, 20)

//
//----------------------------------------------------------------
//
const knot = new THREE.Mesh(TorusKnot, material)
knot.position.x = -10.3
knot.position.y = -0.4
knot.position.z = -10

const knotFolder = gui.addFolder("TorusKnot");
knotFolder.add(knot.position, "x", -20, 20)
knotFolder.add(knot.position, "y", -20, 20)
knotFolder.add(knot.position, "z", -20, 20)


//
//----------------------------------------------------------------
//

const flatRing = new THREE.Mesh(RingGeometryShape, material)
flatRing.position.x = -10.3
flatRing.position.y = -0.4
flatRing.position.z = -10

const flatRingFolder = gui.addFolder("Flat Ring");
flatRingFolder.add(flatRing.position, "x", -20, 20)
flatRingFolder.add(flatRing.position, "y", -20, 20)
flatRingFolder.add(flatRing.position, "z", -20, 20)

RingGeometryShape

//
//----------------------------------------------------------------
//


scene.add(sphere)
scene.add(icosahedron)
scene.add(cone)
scene.add(knot)
scene.add(flatRing)

//
//----------------------------------------------------------------
//

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    camera.add(pointLight2)
    camera.add(pointLight3)
    camera.add(pointLight4)

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera oginal
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.update();


/**
 * Renderer
 */
//Orginal 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    // targetX = mouseX * .001
    // targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .10 * elapsedTime
    icosahedron.rotation.y = .10 * elapsedTime
    icosahedron.rotation.y = .15 * elapsedTime
    cone.rotation.x = .10 * elapsedTime
    knot.rotation.x = .10 * elapsedTime
    knot.rotation.y = .10 * elapsedTime
    // sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick();


//const nameOfLight = new THREE.PointLight(0xff0000, 2)

function buildLight(folderName = "FOLDER", nameOfLight, sliderValue, sliderStepValue, x = 1, y = 1, z = 1, intensityValue = 1, helperOn = true) {

    const light = (nameOfLight = new THREE.PointLight(0xff0000, 2));

    nameOfLight.position.set(x, y, z)
    nameOfLight.intensity = intensityValue

    scene.add(nameOfLight)

    //buildGuiFolder(folderName, nameOfLight,sliderValue,sliderStepValue)

    const folder = gui.addFolder(folderName)

    folder.add(nameOfLight.position, 'x').min(-sliderValue).max(sliderValue).step(sliderStepValue)
    folder.add(nameOfLight.position, 'y').min(-sliderValue).max(sliderValue).step(sliderStepValue)
    folder.add(nameOfLight.position, 'z').min(-sliderValue).max(sliderValue).step(sliderStepValue)
    folder.add(nameOfLight, 'intensity').min(0).max(sliderValue).step(sliderStepValue)

    const lightToColor = {
        color: 0xff0000
    }

    folder.addColor(lightToColor, 'color')
        .onChange(() => {
            nameOfLight.color.set(lightToColor.color)
        })

    if (helperOn == true) {
        const pointLightHelper = new THREE.PointLightHelper(nameOfLight, 1);
        scene.add(pointLightHelper);
    } else {
        console.log("Light helper is off btw");
    }

    return light;
}