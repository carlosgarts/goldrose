#include <common>
#include <lights_pars_begin>

#include <beginnormal_vertex>
#include <defaultnormal_vertex>
#include <begin_vertex>
#include <project_vertex>
#include <lights_lambert_vertex>

varying vec3 vPosition;
varying mat4 vModelMatrix;
varying vec3 vWorldNormal;
varying vec3 vLightIntensity;

void main() {
  
  vLightIntensity = vLightFront + ambientLightColor;

  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vPosition = position;
  vModelMatrix = modelMatrix;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}