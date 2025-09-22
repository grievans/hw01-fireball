import {vec2, vec3} from 'gl-matrix';
// import * as Stats from 'stats-js';
import * as DAT from 'dat.gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

import Cube from "./geometry/Cube";

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
let controls = {
  tesselations: 6,
  'Load Scene': loadScene, // A function pointer, essentially
  Color: [255,255,255],
  "Lambertian": false,
  Cube:true,
  Sphere:false,
  Square:false,
  "Main Time Scale": 0.7,
  "Color Gradient Time Scale": 0.7,
  "Worley Noise Scale": 1.0,
  "XZ Stretch Amplitude" : 1.0,
  "Reset to Defaults" : function() {}, // Not sure best way to set this up, this feels awkward
  // Color: "#ff0000"
};

let icosphere: Icosphere;
let square: Square;
let prevTesselations: number = 6;

let cube: Cube;

// let frameCount : number;
let time: number = 0;


function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();

  cube = new Cube(vec3.fromValues(0,0,0));
  cube.create();
}


function main() {
  window.addEventListener('keypress', function (e) {
    // console.log(e.key);
    switch(e.key) {
      
      // Use this if you wish
    }
  }, false);

  window.addEventListener('keyup', function (e) {
    switch(e.key) {
      // Use this if you wish
    }
  }, false);
  // Initial display for framerate
  // const stats = Stats();
  // stats.setMode(0);
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.left = '0px';
  // stats.domElement.style.top = '0px';
  // document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI({width:500});
  gui.add(controls, 'tesselations', 0, 8).step(1);
  // gui.add(controls, 'Time Scale', 0, 5.0);
  gui.add(controls, 'Main Time Scale', 0, 5.0).step(0.025);
  gui.add(controls, 'Color Gradient Time Scale', 0, 5.0).step(0.025);
  gui.add(controls, 'Worley Noise Scale', 0, 5.0).step(0.025);
  gui.add(controls, "XZ Stretch Amplitude", 0, 5.0).step(0.025);
  
  function resetToDefaults() {
    controls["tesselations"] = 6;
    controls["Main Time Scale"] = 0.7;
    controls["Color Gradient Time Scale"] = 0.7;
    controls["Worley Noise Scale"] = 1.0;
    controls["XZ Stretch Amplitude"] = 1.0;
    gui.updateDisplay();
  }
  controls["Reset to Defaults"] = resetToDefaults;
  
  gui.add(controls, 'Reset to Defaults');
  // gui.updateDisplay();
  // gui.add(controls, 'Load Scene');
  
  // gui.addColor(controls, "Color");
  // gui.add(controls, 'Lambertian');
  // gui.add(controls, 'Sphere');
  // gui.add(controls, 'Square');
  // gui.add(controls, 'Cube');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, -10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  // renderer.setClearColor(0.2, 0.2, 0.2, 1);
  renderer.setClearColor(164.0 / 255.0, 233.0 / 255.0, 1.0, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const noiseShaderProgram = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/custom-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/custom-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const fireballShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/fireball-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/fireball-frag.glsl')),
  ]);
  const fireroomShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/fireroom-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/fireroom-frag.glsl')),
  ]);

  function processKeyPresses() {
    // Use this if you wish
  }

  let mouseX = 0.5;
  let mouseY = 0.5;

  fireballShader.setMouseCoords(mouseX, mouseY);

  let trailSpheres : Icosphere[] = [];

  function updateMousePos(event: MouseEvent) {
    let newMouseX = event.pageX / window.innerWidth;
    let newMouseY = event.pageY / window.innerHeight;
    mouseX = newMouseX;
    mouseY = newMouseY;
    if (event.altKey) {
    // if (event.altKey && (event.buttons & 1) == 1) {
      // let addedSphere = new Icosphere(vec3.fromValues(3 - newMouseX * 6, 3 - newMouseY * 6, 0), 0.5, 2);
      // addedSphere.create();
      // trailSpheres.push(addedSphere);
      
      // TODO I think I like the idea of moving around the fireball but having some sort of smoky particles trailing
      // so I think making separate spheres (or other shape) for 'clouds' coming out from it? 
      // mouseX += event.movementX;
      // mouseY += event.movementY;
      // console.log(mouseX, mouseY);
      fireballShader.setMouseCoords(mouseX, mouseY);
    }
  }
  // canvas.addEventListener("click", updateMousePos, false);
  canvas.addEventListener("mousemove", updateMousePos, false);

  // frameCount = 0;

  // This function will be called every frame
  function tick() {
    camera.update();
    // stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    processKeyPresses();

    // renderer.render(camera, fireroomShader, [
    //   cube,
    // ], time);
    // time++;
    if(controls.tesselations != prevTesselations)
    {
      prevTesselations = controls.tesselations;
      icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, prevTesselations);
      icosphere.create();


      // for (let sphere of trailSpheres) {
        // sphere = new Icosphere()
        // TODO set tesselations
      // }
    }
    

    let drawArr : any[] = [];
    drawArr.push(icosphere);
    for (let sphere of trailSpheres) {
      drawArr.push(sphere);
    }

    
    renderer.render(camera, fireroomShader, [cube], ++time, 
      controls['Main Time Scale'], controls["Color Gradient Time Scale"], 
      controls["Worley Noise Scale"], controls["XZ Stretch Amplitude"]);
    renderer.render(camera, fireballShader, drawArr, ++time, 
      controls['Main Time Scale'], controls["Color Gradient Time Scale"], 
      controls["Worley Noise Scale"], controls["XZ Stretch Amplitude"]);

    // if (!controls['Lambertian']) {
    //   noiseShaderProgram.setTime(++frameCount);
    // }

    
    // if (controls.Cube) {
    //   drawArr.push(cube);
    // }
    // if (controls.Square) {
    //   drawArr.push(square);
    // }
    // if (controls.Sphere) {
    //   drawArr.push(icosphere);
    // }

    // renderer.render(camera, controls["Lambertian"] ? lambert : noiseShaderProgram, drawArr,
    // controls.Color);
    // stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);

  }
  
  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
