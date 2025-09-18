#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

// in vec2 fs_Pos;

// void main() {
//   out_Col = vec4(0.5 * (fs_Pos + vec2(1.0)), 0.5 * (sin(u_Time * 3.14159 * 0.01) + 1.0), 1.0);
// }

uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;

in float fs_NormOffset;

in vec4 fs_Pos;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

void main()
{
    // Material base color (before shading)
        vec4 diffuseColor = u_Color;

        // Calculate the diffuse term for Lambert shading
        float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
        // Avoid negative lighting values
        diffuseTerm = clamp(diffuseTerm, 0.f, 1.f);

        float ambientTerm = 0.3f;

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.
        vec3 baseColor = vec3(1.5f - fs_NormOffset, 0.8f - fs_NormOffset * 0.8f, 0.f);


        // TODO should use time in this too, plus make some sort of more interesting pattern probably
        // TODO also ought to make sure to use more "toolbox" functions
        // other TODOs: interactivity; some variable controls but also I think I wanna do mouse moving the fireball. background maybe--I like idea of mapping the flame color onto a surface around it perhaps?
        // I'm also not totally satisfied on this effect yet so still WIP; might drastically redo
        //  Top looks odd right now I think
        //  perhaps some perturbations to the values used to set color?

        // I think some bucketing of colors could be neat. go for a cartoony sort of look
        // baseColor = mod(baseColor, 0.2f) + floor(baseColor * 5.f) * 0.2f;
        // vec3 spillColor = mod(baseColor, 0.2f);
        vec3 bucketedColor = floor(baseColor * 5.f) * 0.2f;
        // vec3 finalColor = spillColor * 0.5f + bucketedColor;
        vec3 finalColor = bucketedColor * 0.5f + baseColor * 0.5f;
        // baseColor = floor(baseColor * 5.f) / 5.f;

        out_Col = vec4(finalColor, 1.f);
        // out_Col = vec4(baseColor, fs_Pos.y * -0.1f + 0.9f);
        
        // Compute final shaded color
        // out_Col = vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a);
        // out_Col = vec4(fs_Nor.xyz, 1.f);
        // out_Col = vec4((fs_Nor.xyz + 1.f) * 0.5f, 1.f);
}