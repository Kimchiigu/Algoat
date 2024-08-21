"use client";

import GoBack from "@/components/go-back";
import withAuth from "@/hoc/withAuth";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";

function SoftwareArchitecturePage() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particlesOptions = {
    preset: "stars",
    background: {
      color: {
        value: "#000",
      },
    },
    particles: {
      move: {
        speed: 1,
      },
    },
  };
  return (
    <div className="relative w-full min-h-screen">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex flex-col w-full min-h-screen relative">
        <GoBack href="/learning/material"></GoBack>
      </div>
    </div>
  );
}

export default withAuth(SoftwareArchitecturePage, true);
