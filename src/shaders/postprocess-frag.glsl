#version 300 es
precision highp float;


uniform sampler2D u_Texture;
uniform float u_OutlineScale;

in vec2 fs_UV;
out vec4 out_Col;

void main() {

    vec4 accColor = vec4(0.f,0.f,0.f,0.f);

    // for (float dx = -u_OutlineScale; dx <= u_OutlineScale; ++dx) {
        // for (float dy = -u_OutlineScale; dy <= u_OutlineScale; ++dy) {
    // if (u_OutlineScale > 0.f) {

    float step = u_OutlineScale > 0.f ? u_OutlineScale : 1.f;
    for (float dx = -u_OutlineScale; dx <= u_OutlineScale; dx += step) {
        for (float dy = -u_OutlineScale; dy <= u_OutlineScale; dy += step) {
            vec4 sampleColor = texelFetch(u_Texture, ivec2(gl_FragCoord.x + dx, gl_FragCoord.y + dy), 0);
            if (sampleColor.r > 0.f) {
                if (dx == 0.f && dy == 0.f) {
                    accColor = sampleColor;
                    break;
                } else if (accColor.a == 0.f) {
                    accColor = vec4(0.f, 0.f, 0.f, 1.f);
                }
            }

            // accColor.rgb = max(, accColor.rgb);
        }
    }
    // }

    // accColor.rgb > 
    // accColor.rgb /= 100.f;
    // vec4 texColor = texture(u_Texture, fs_UV);

    // texColor.a = fs_UV.x;
    out_Col = accColor;
}