"use client";

import React, { useCallback, useState, useEffect } from "react";
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
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"; // Update the import for sheet
import { Progress } from "@/components/ui/progress";
import GoBack from "@/components/go-back";
import { ThemeProvider } from "next-themes";
import { Box, CodeXml, Puzzle, Cpu, PenTool, Crown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const NodeWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const pastelColors = [
  { color: "rgb(255, 182, 193)", hoverColor: "rgba(255, 182, 193, 0.5)" }, // pastel red
  { color: "rgb(216, 191, 216)", hoverColor: "rgba(216, 191, 216, 0.5)" }, // pastel purple
  { color: "rgb(173, 216, 230)", hoverColor: "rgba(173, 216, 230, 0.5)" }, // pastel blue
  { color: "rgb(144, 238, 144)", hoverColor: "rgba(144, 238, 144, 0.5)" }, // pastel green
  { color: "rgb(175, 238, 238)", hoverColor: "rgba(175, 238, 238, 0.5)" }, // pastel cyan
];

interface NodeProps {
  completed: boolean;
  index: number;
}

const Node = styled.div<NodeProps>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.completed ? pastelColors[props.index].color : "#555")};
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border 0.3s, box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 15px
      ${(props) =>
        props.completed ? pastelColors[props.index].hoverColor : "#555"};
  }
`;

const ProgressLabel = styled.div`
  margin-top: 5px;
  color: #fff;
  font-size: 12px;
`;

interface CoreWrapperProps {
  glowIntensity: number;
  coreColor: string;
}

const CoreWrapper = styled.div<CoreWrapperProps>`
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #000;
  border: 2px solid #fff;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 20px rgba(255, 255, 102, ${(props) => props.glowIntensity});
`;

const HoverCardContentStyled = styled(HoverCardContent)`
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

interface LineProps {
  completed: boolean;
  index: number;
}

const Line = styled.line<LineProps>`
  stroke: ${(props) =>
    props.completed ? pastelColors[props.index].color : "#555"};
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 0.3s;
  filter: ${(props) =>
    props.completed
      ? "url(#glow), drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
      : "none"};
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
  { top: "10%", left: "49%" },
  { top: "35%", left: "28%" },
  { top: "35%", left: "67%" },
  { top: "80%", left: "35%" },
  { top: "80%", left: "60%" },
];

const icons = [
  <Box size={30} color="#fff" />,
  <CodeXml size={30} color="#fff" />,
  <Puzzle size={30} color="#fff" />,
  <Cpu size={30} color="#fff" />,
  <PenTool size={30} color="#fff" />,
];

const nodeTitles = [
  "Data Structures",
  "Algorithm and Programming",
  "Design Pattern",
  "Software Architecture",
  "Web Design",
];

const nodeDescriptions = [
  "Understand different data structures and their uses.",
  "Learn the fundamentals of algorithms and their applications.",
  "Explore common design patterns used in software development.",
  "Study the principles of designing robust software architectures.",
  "Learn the essentials of designing user-friendly websites.",
];

function ConstellationProgress() {
  const [completedNodes, setCompletedNodes] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [coreColor, setCoreColor] = useState("#777");
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const glowIntensity = completedNodes.filter(Boolean).length * 0.2;

  useEffect(() => {
    const lastCompletedIndex = completedNodes.lastIndexOf(true);
    if (lastCompletedIndex !== -1) {
      setCoreColor(pastelColors[lastCompletedIndex].color);
    }
  }, [completedNodes]);

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
        <div className="absolute top-5 right-7 z-[200]">
          <h2 className="scroll-m-20 pb-2 text-xl font-semibold tracking-tight first:mt-0 z-[200]">
            Algoat Constellation
          </h2>
          <h2 className="scroll-m-20 mb-5 pb-2 text-right text-md font-semibold tracking-tight first:mt-0 z-[200]">
            Current Progress : 0%
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
              index={index}
            />
          ))}
        </svg>
        {nodePositions.map((pos, index) => (
          <NodeWrapper key={index} style={{ top: pos.top, left: pos.left }}>
            <HoverCard>
              <HoverCardTrigger>
                <Node
                  completed={completedNodes[index]}
                  onClick={() => setSelectedNode(index)}
                  index={index}
                >
                  {icons[index]}
                </Node>
              </HoverCardTrigger>
              <ProgressLabel>
                {completedNodes[index] ? "100%" : "0%"}
              </ProgressLabel>
              <HoverCardContentStyled>
                <p>{nodeTitles[index]}</p>
              </HoverCardContentStyled>
            </HoverCard>
          </NodeWrapper>
        ))}
        <CoreWrapper glowIntensity={glowIntensity} coreColor={coreColor}>
          <Crown color="#fff" size={48} />
        </CoreWrapper>
        {selectedNode !== null && (
          <Sheet open={true} onOpenChange={() => setSelectedNode(null)}>
            <SheetTrigger />
            <SheetContent className="z-[999]">
              <SheetHeader>
                <Image
                  src="/material/data-structures.png"
                  alt="Material"
                  width={400} // Adjust image width
                  height={400} // Adjust image height
                  className="transition-all duration-300blur-sm
                      rounded-xl z-0"
                />
                <SheetTitle className="text-4xl mt-5">
                  {nodeTitles[selectedNode]}
                </SheetTitle>
                <SheetDescription className="text-md">
                  {nodeDescriptions[selectedNode]}
                </SheetDescription>
                <p>Current Progress : 45%</p>
                <Progress value={45} />
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Link
                    href="/learning/material/data-structures"
                    className="w-full"
                  >
                    <Button className="w-full mt-5" type="submit">
                      Start Learning
                    </Button>
                  </Link>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </ThemeProvider>
    </Container>
  );
}

export default ConstellationProgress;
