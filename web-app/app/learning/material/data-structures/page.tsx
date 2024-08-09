"use client";

import { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import GoBack from "@/components/go-back";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface CardContentProps {
  imageSrc: string;
  title: string;
  description: string;
}

const cardData: CardContentProps[] = [
  {
    imageSrc: "/material/algorithm-programming.png",
    title: "Stack & Queue",
    description: "Learn the fundamentals of algorithms and their applications.",
  },
  {
    imageSrc: "/material/data-structures.png",
    title: "Hash Table",
    description: "Understand different data structures and their uses.",
  },
  {
    imageSrc: "/material/design-pattern.png",
    title: "Binary Tree",
    description: "Explore common design patterns used in software development.",
  },
  {
    imageSrc: "/material/software-architecture.png",
    title: "AVL Tree",
    description:
      "Study the principles of designing robust software architectures.",
  },
  {
    imageSrc: "/material/web-design.png",
    title: "Red Black Tree",
    description: "Learn the essentials of designing user-friendly websites.",
  },
];

export default function MaterialPage() {
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
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <GoBack href="/learning/material" />
      <div className="flex flex-col items-center justify-center">
        <h2 className="scroll-m-20 border-b mb-5 pb-2 text-5xl font-semibold tracking-tight first:mt-0 z-[999]">
          Journey to Become AlgoatPro
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-7xl" // Adjust the max width of the carousel
        >
          <CarouselContent>
            {cardData.map((card, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  {" "}
                  {/* Increase padding */}
                  <HoverCard
                    imageSrc={card.imageSrc}
                    title={card.title}
                    description={card.description}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

function HoverCard({ imageSrc, title, description }: CardContentProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="relative flex flex-col items-center rounded-xl shadow-md w-[400px] h-[400px] cursor-pointer p-2" // Set width and height
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={imageSrc}
        alt={title}
        width={400} // Adjust image width
        height={400} // Adjust image height
        className={`transition-all duration-300 ${
          hovered
            ? "blur-sm"
            : "transition-transform duration-300 ease-in-out rounded-xl z-0"
        }`}
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center bg-black/50 rounded-xl p-5">
        <h2 className="text-white font-bold text-3xl z-20 mb-3 text-center">
          {title}
        </h2>
        <p
          className={`text-white text-base z-20 transition-all duration-300 text-center ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}
