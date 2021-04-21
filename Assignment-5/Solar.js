/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;

var Planets = {
  centerWheel: undefined,
  Mercury: undefined,
  Venus: undefined,
  Earth: undefined,
  Moon: undefined,
  Mars: undefined,
  Jupiter: undefined,
  Saturn: undefined,
  Uranus: undefined,
  Neptune: undefined,
  Pluto: undefined //not a planet btw
};

// Viewing transformation parameters
var V; // matrix storing the viewing transformation

// Projection transformation parameters
var P; // matrix storing the projection transformation
var near = 10; // near clipping plane's distance
var far = 120 * 4000; // far clipping plane's distance and multiplied by 4000 so that we can render more planets

// Animation variables
var time = 0.0; // time, our global time constant, which is 
// incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

//Given code from oginal file
function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL initialization failed");
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  for (var name in Planets) {
    var planet = Planets[name] = new Sphere();

    planet.uniforms = {
      color: gl.getUniformLocation(planet.program, "color"),
      MV: gl.getUniformLocation(planet.program, "MV"),
      P: gl.getUniformLocation(planet.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);
}

// For the cam position
var X = 0.0,
  Y = 0.0,
  Z = 1.0; 

// Given from orginal file
// Renders the animation on screen. Or slideshow
function render() {
  time += timeDelta;
  var ms = new MatrixStack(); // builds the stack to store the plaents
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  V = translate(-5.5, 2.0, -0.7 * (near + far)/4000); //Controls the render area
  ms.load(V);

  //Builds the centerWheel
  var centerWheel = Planets["centerWheel"];
  var data = SolarSystem["centerWheel"];

  centerWheel.PointMode = false; // turns the centerWheel on

  ms.push();
  ms.scale(data.radius);
  gl.useProgram(centerWheel.program);
  gl.uniformMatrix4fv(centerWheel.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(centerWheel.uniforms.P, false, flatten(P));
  gl.uniform4fv(centerWheel.uniforms.color, flatten(data.color));
  centerWheel.render();

  //Makes the planets 
  createWheelPartPos("Mercury" ,ms);
  createWheelPartPos("Venus" ,ms);
  createWheelPartPos("Earth" ,ms, ["Moon"]);
  createWheelPartPos("Mars" ,ms)
  createWheelPartPos("Jupiter", ms)
  createWheelPartPos("Saturn" , ms)
  createWheelPartPos("Uranus" ,ms)
  createWheelPartPos("Neptune" ,ms)
  createWheelPartPos("Pluto" ,ms)

  ms.pop();
  window.requestAnimationFrame(render);
}

//Builds the planets
//Most of the code was provided from the orginal file
function createWheelPartPos(name, ms, moons) {
  var planet = Planets[name];
  var data = SolarSystem[name];
  planet.PointMode = false;
  ms.push();
  ms.rotate((1.0 / data.year) * time, [X, Y, Z]);
  ms.translate(data.distance, 0, 0);
  ms.scale(data.radius);
  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));
  planet.render();

  //checks to see if a mood has been added or not
  //if yes then it builds a moon or moons
  //if no then nothing we just skip it
  if (moons) {
    for (var i = 0; i < moons.length; i++) {
      buildTheMoon(ms, moons[i]);
    }
  }
  ms.pop();
}

// Mainly the same as createWheelPartPos() but this just builds
function buildTheMoon(ms, name) {
  var moon = Planets[name];
  var data = SolarSystem[name];
  moon.PointMode = false;
  ms.push();
  ms.rotate((1.0 / data.year) * time, [X, Y, Z]);
  ms.translate(data.distance, 0, 0);
  ms.scale(data.radius);
  gl.useProgram(moon.program);
  gl.uniformMatrix4fv(moon.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(moon.uniforms.P, false, flatten(P));
  gl.uniform4fv(moon.uniforms.color, flatten(data.color));
  moon.render();
  ms.pop();
}

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  gl.viewport(0, 0, w, h);
  var fovy = 110.0; // degrees
  var aspect = w / h;
  P = perspective(fovy, aspect, near, far);
}

window.onload = init;
window.onresize = resize;