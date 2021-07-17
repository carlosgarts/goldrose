uniform vec3 u_color;
uniform vec3 u_light_position;
uniform vec3 u_rim_color;
uniform float u_rim_strength;
uniform float u_rim_width;
uniform samplerCube u_envmap_cube;
uniform float u_envmap_strength;

// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying mat4 vModelMatrix;
varying vec3 vLightIntensity;

void main()
{
  vec3 worldPosition = ( vModelMatrix * vec4( vPosition, 1.0 )).xyz;
  vec3 lightVector = normalize( u_light_position - worldPosition );
  vec3 viewVector = normalize(cameraPosition - worldPosition);
  float rimndotv =  max(0.0, u_rim_width - clamp(dot(vWorldNormal, viewVector), 0.0, 1.0));
  vec3 rimLight = rimndotv * u_rim_color * u_rim_strength;

  vec3 reflection = reflect(-viewVector, vWorldNormal);
  vec3 envmapLight = textureCube(u_envmap_cube, reflection).rgb * u_envmap_strength;
  vec3 color = vLightIntensity * u_color + envmapLight + rimLight;

  gl_FragColor = vec4( color, 1.0 );

}