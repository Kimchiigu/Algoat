"use client";

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import GoBack from "@/components/go-back";
import { ThemeProvider } from "next-themes";

// Styles for the constellation
const Container = styled.div`
  position: relative;
  width: 100vw; /* Increase width */
  height: 100vh; /* Increase height */
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Hide scrollbar */
`;

const NodeWrapper = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
`;

const Node = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "#00f" : "#555")};
  transition: background 0.3s;
`;

const Core = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${(props) => (props.allCompleted ? "#0f0" : "#777")};
  transition: background 0.3s;
`;

const HoverCardContentStyled = styled(HoverCardContent)`
  position: absolute;
  bottom: 60px; /* Position above the node */
  left: 50%;
  transform: translateX(-50%);
  background: #fff; /* Background color for the content */
  padding: 10px; /* Padding for the content */
  border-radius: 4px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow for better visibility */
`;

const Line = styled.line`
  stroke: ${(props) => (props.completed ? "#00f" : "#555")};
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 0.3s;
  filter: ${(props) => (props.completed ? "url(#glow)" : "none")};
`;

const GlowFilter = styled.defs`
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
`;

const nodePositions = [
  { top: "10%", left: "48%" }, // Top node
  { top: "35%", left: "28%" }, // Middle-left node
  { top: "35%", left: "67%" }, // Middle-right node
  { top: "80%", left: "35%" }, // Bottom-left node
  { top: "80%", left: "60%" }, // Bottom-right node
];

function ConstellationProgress() {
  const [completedNodes, setCompletedNodes] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Determine if all nodes are completed
  const allCompleted = completedNodes.every(Boolean);

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
    <Container>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <GoBack href="/learning" />
        <div className="absolute top-5 right-7 z-[1000]">
          <h2 className="scroll-m-20  mb-5 pb-2 text-xl font-semibold tracking-tight first:mt-0 z-[999]">
            Algoat Constellation
          </h2>
        </div>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
        />
        <svg
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            width: "100%",
            height: "100%",
          }}
        >
          <GlowFilter />
          {nodePositions.map((pos, index) => (
            <Line
              key={index}
              x1="49%"
              y1="49%"
              x2={pos.left}
              y2={pos.top}
              completed={completedNodes[index]}
            />
          ))}
        </svg>
        {nodePositions.map((pos, index) => (
          <NodeWrapper key={index} style={{ top: pos.top, left: pos.left }}>
            <HoverCard>
              <HoverCardTrigger>
                <Node
                  completed={completedNodes[index]}
                  onClick={() => {
                    setCompletedNodes((prev) => {
                      const newCompletedNodes = [...prev];
                      newCompletedNodes[index] = !newCompletedNodes[index];
                      return newCompletedNodes;
                    });
                  }}
                />
              </HoverCardTrigger>
              <HoverCardContentStyled>
                <p>Node {index + 1}</p> {/* Customize this content as needed */}
              </HoverCardContentStyled>
            </HoverCard>
          </NodeWrapper>
        ))}
        <Core allCompleted={allCompleted} />
      </ThemeProvider>
    </Container>
  );
}

export default ConstellationProgress;
