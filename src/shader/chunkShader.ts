import { loader } from "@/loader";
import * as THREE from "three";

const blockTexture = loader.load("block_texure.png");
blockTexture.magFilter = THREE.NearestFilter;
blockTexture.minFilter = THREE.NearestFilter;

export const chunkShader = new THREE.ShaderMaterial({
  // wireframe: true,
  uniforms: {
    blockTexture: {
      type: "t",
      value: blockTexture,
    },
  } as any,
  vertexShader: `
    attribute float vertexData;

    out vec2 texcoord;

    #define bitExtract(data, offset, size) ((data >> offset) & ((1 << size) - 1))

    void main() {
      int data = int(vertexData);
      float x = float(bitExtract(data, 0, 6));
      float y = float(bitExtract(data, 6, 6));
      int dx = bitExtract(data, 12, 1);
      int dy = bitExtract(data, 13, 1);
      float texCoordX = float(bitExtract(data, 14, 5));
      float texCoordY = float(bitExtract(data, 19, 5));

      x += float(dx);
      y += float(dy);

      texCoordX += float(dx);
      texCoordY += float(dy);

      if (dx == 1) texCoordX -= 1.0/32.0;
      if (dy == 1) texCoordY -= 1.0/32.0;
      
      if (dx == 0) texCoordX += 1.0/32.0;
      if (dy == 0) texCoordY += 1.0/32.0;

      texcoord = vec2(texCoordX/16.0, texCoordY/16.0);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0, 1);
    }
  `,
  fragmentShader: `
    in vec2 texcoord;

    uniform sampler2D blockTexture;

    void main() {
      gl_FragColor = texture(blockTexture, texcoord);
    } 
  `,
});
