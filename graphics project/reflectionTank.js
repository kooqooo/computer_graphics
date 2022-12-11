"use strict";

var canvas;
var gl;
var program;

var cubes = 6;
var numVertices  = 36 * 7;

var texSize = 4;
var numChecks = 2;

var flag = true;

var black = new Uint8Array([0, 0, 0, 255]);
var brown = new Uint8Array([50, 50, 0, 255]);
var green1 = new Uint8Array([0, 50, 0, 255]);
var green2 = new Uint8Array([0, 100, 0, 255]);
var green3 = new Uint8Array([0, 70, 0, 255]);
var green4 = new Uint8Array([0, 120, 0, 255]);

var cubeMap;

var pointsArray = [];
var normalsArray = [];

var vertices = [
  /***         몸체         ***/
  vec4( -0.5, -0.4,  0.8, 1.0 ),
  vec4( -0.5,  0.0,  0.8, 1.0 ),
  vec4( 0.5,  0.0,  0.8, 1.0 ),
  vec4( 0.5, -0.4,  0.8, 1.0 ),
  vec4( -0.5, -0.4,  -0.8, 1.0 ),
  vec4( -0.5,  0.0,  -0.8, 1.0 ),
  vec4( 0.5,  0.0,  -0.8, 1.0 ),
  vec4( 0.5, -0.4,  -0.8, 1.0 ),

  /***         앞 범퍼        ***/
  vec4( -0.5, -0.35,  0.85, 1.0 ),
  vec4( -0.5, -0.15,  0.9, 1.0 ),
  vec4( 0.5,  -0.15,  0.9, 1.0 ),
  vec4( 0.5, -0.35,  0.85, 1.0 ),
  vec4( -0.5, -0.4,  0.8, 1.0 ),
  vec4( -0.5,  0.0,  0.8, 1.0 ),
  vec4( 0.5,  0.0,  0.8, 1.0 ),
  vec4( 0.5, -0.4,  0.8, 1.0 ),

  /***         뒷 범퍼        ***/
  vec4( -0.5, -0.4,  -0.8, 1.0 ),
  vec4( -0.5,  0.0,  -0.8, 1.0 ),
  vec4( 0.5,  0.0,  -0.8, 1.0 ),
  vec4( 0.5, -0.4,  -0.8, 1.0 ),
  vec4( -0.5, -0.35,  -0.85, 1.0 ),
  vec4( -0.5,  -0.0,  -1.0, 1.0 ),
  vec4( 0.5,  -0.0,  -1.0, 1.0 ),
  vec4( 0.5, -0.35,  -0.85, 1.0 ),

  /***         윗 범퍼         ***/
  vec4( -0.5, 0.0,  -0.7, 1.0 ),
  vec4( -0.5,  0.15,  -0.8, 1.0 ),
  vec4( 0.5,  0.15,  -0.8, 1.0 ),
  vec4( 0.5, 0.0,  -0.7, 1.0 ),
  vec4( -0.5, 0.0,  -1.0, 1.0 ),
  vec4( -0.5,  0.15,  -1.0, 1.0 ),
  vec4( 0.5,  0.15,  -1.0, 1.0 ),
  vec4( 0.5, 0.0,  -1.0, 1.0 ),

  /***         터렛         ***/
  vec4( -0.4, 0.0,  0.4, 1.0 ),
  vec4( -0.4,  0.2,  0.3, 1.0 ),
  vec4( 0.4,  0.2,  0.3, 1.0 ),
  vec4( 0.4, 0.0,  0.4, 1.0 ),
  vec4( -0.4, 0.0,  -0.8, 1.0 ),
  vec4( -0.4,  0.2,  -0.7, 1.0 ),
  vec4( 0.4,  0.2,  -0.7, 1.0 ),
  vec4( 0.4, 0.0,  -0.8, 1.0 ),

  /***         포신        ***/
  vec4( -0.05, 0.2,  1.4, 1.0 ),
  vec4( -0.05,  0.3,  1.4, 1.0 ),
  vec4( 0.05,  0.3,  1.4, 1.0 ),
  vec4( 0.05, 0.2,  1.4, 1.0 ),
  vec4( -0.05, 0.1,  0.3, 1.0 ),
  vec4( -0.05,  0.2,  0.3, 1.0 ),
  vec4( 0.05,  0.2,  0.3, 1.0 ),
  vec4( 0.05, 0.1,  0.3, 1.0 ),

  /***        해치         ***/
  vec4( -0.2, 0.2,  0.2, 1.0 ),
  vec4( -0.1,  0.25,  0.15, 1.0 ),
  vec4( 0.1,  0.25,  0.15, 1.0 ),
  vec4( 0.2, 0.2,  0.2, 1.0 ),
  vec4( -0.2, 0.2,  -0.4, 1.0 ),
  vec4( -0.1,  0.25,  -0.35, 1.0 ),
  vec4( 0.1,  0.25,  -0.35, 1.0 ),
  vec4( 0.2, 0.2,  -0.4, 1.0 )
];


window.onload = init;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = yAxis;

var theta = [0.0, 0.0, 0.0];

function configureCubeMap() {

    cubeMap = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, black);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, brown);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, green1);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, green2);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, green3);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ,0,gl.RGBA,
       1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, green4);


    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
}

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal[3] = 0.0;

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);;
}

function colorCube()
{
   quad( 1, 0, 3, 2 );
   quad( 2, 3, 7, 6 );
   quad( 3, 0, 4, 7 );
   quad( 6, 5, 1, 2 );
   quad( 4, 5, 6, 7 );
   quad( 5, 4, 0, 1 );

   quad( 1+8, 0+8, 3+8, 2+8 );
   quad( 2+8, 3+8, 7+8, 6+8 );
   quad( 3+8, 0+8, 4+8, 7+8 );
   quad( 6+8, 5+8, 1+8, 2+8 );
   quad( 4+8, 5+8, 6+8, 7+8 );
   quad( 5+8, 4+8, 0+8, 1+8 );

   quad( 1+16, 0+16, 3+16, 2+16 );
   quad( 2+16, 3+16, 7+16, 6+16 );
   quad( 3+16, 0+16, 4+16, 7+16 );
   quad( 6+16, 5+16, 1+16, 2+16 );
   quad( 4+16, 5+16, 6+16, 7+16 );
   quad( 5+16, 4+16, 0+16, 1+16 );

   quad( 1+24, 0+24, 3+24, 2+24 );
   quad( 2+24, 3+24, 7+24, 6+24 );
   quad( 3+24, 0+24, 4+24, 7+24 );
   quad( 6+24, 5+24, 1+24, 2+24 );
   quad( 4+24, 5+24, 6+24, 7+24 );
   quad( 5+24, 4+24, 0+24, 1+24 );
   
   quad( 1+32, 0+32, 3+32, 2+32 );
   quad( 2+32, 3+32, 7+32, 6+32 );
   quad( 3+32, 0+32, 4+32, 7+32 );
   quad( 6+32, 5+32, 1+32, 2+32 );
   quad( 4+32, 5+32, 6+32, 7+32 );
   quad( 5+32, 4+32, 0+32, 1+32 );

   quad( 1+40, 0+40, 3+40, 2+40 );
   quad( 2+40, 3+40, 7+40, 6+40 );
   quad( 3+40, 0+40, 4+40, 7+40 );
   quad( 6+40, 5+40, 1+40, 2+40 );
   quad( 4+40, 5+40, 6+40, 7+40 );
   quad( 5+40, 4+40, 0+40, 1+40 );

   quad( 1+48, 0+48, 3+48, 2+48 );
   quad( 2+48, 3+48, 7+48, 6+48 );
   quad( 3+48, 0+48, 4+48, 7+48 );
   quad( 6+48, 5+48, 1+48, 2+48 );
   quad( 4+48, 5+48, 6+48, 7+48 );
   quad( 5+48, 4+48, 0+48, 1+48 );

}

function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var projectionMatrix = ortho(-2, 2, -2, 2, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix" ), false, flatten(projectionMatrix) );

    configureCubeMap();
    gl.activeTexture( gl.TEXTURE0 );
    gl.uniform1i(gl.getUniformLocation(program, "texMap"),0);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;}
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;

    var eye = vec3(0.0, 0.5, 1.0);
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    var modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix) );

    var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}