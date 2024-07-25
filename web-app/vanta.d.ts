// src/vanta.d.ts

declare module "vanta/dist/vanta.halo.min" {
  import { WebGLRenderer, Scene, PerspectiveCamera } from "three";

  interface VantaOptions {
    el: HTMLElement | string | null;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundColor?: number;
    color?: number;
    THREE?: {
      WebGLRenderer: typeof WebGLRenderer;
      Scene: typeof Scene;
      PerspectiveCamera: typeof PerspectiveCamera;
    };
  }

  export default function HALO(options: VantaOptions): { destroy: () => void };
}

declare module "vanta/dist/vanta.fog.min" {
  import { WebGLRenderer, Scene, PerspectiveCamera } from "three";

  interface VantaOptions {
    el: HTMLElement | string | null;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundColor?: number;
    color?: number;
    THREE?: {
      WebGLRenderer: typeof WebGLRenderer;
      Scene: typeof Scene;
      PerspectiveCamera: typeof PerspectiveCamera;
    };
  }

  export default function FOG(options: VantaOptions): { destroy: () => void };
}
