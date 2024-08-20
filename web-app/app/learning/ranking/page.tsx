"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import RankingTable from "./ranking-table";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import GoBack from "@/components/go-back";
import withAuth from "@/hoc/withAuth";

const users = [
  {
    rank: 1,
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
    fallback: "JD",
    points: 1500,
  },
  {
    rank: 2,
    name: "Jane Smith",
    avatar: "https://github.com/shadcn.png",
    fallback: "JS",
    points: 1450,
  },
  {
    rank: 3,
    name: "Alice Johnson",
    avatar: "https://github.com/shadcn.png",
    fallback: "AJ",
    points: 1400,
  },
  {
    rank: 4,
    name: "Bob Brown",
    avatar: "https://github.com/shadcn.png",
    fallback: "BB",
    points: 1350,
  },
  {
    rank: 5,
    name: "Charlie Green",
    avatar: "https://github.com/shadcn.png",
    fallback: "CG",
    points: 1300,
  },
  {
    rank: 6,
    name: "Diana Prince",
    avatar: "https://github.com/shadcn.png",
    fallback: "DP",
    points: 1250,
  },
  {
    rank: 7,
    name: "Ethan Hunt",
    avatar: "https://github.com/shadcn.png",
    fallback: "EH",
    points: 1200,
  },
  {
    rank: 8,
    name: "Fiona Gallagher",
    avatar: "https://github.com/shadcn.png",
    fallback: "FG",
    points: 1150,
  },
  {
    rank: 9,
    name: "George Bluth",
    avatar: "https://github.com/shadcn.png",
    fallback: "GB",
    points: 1100,
  },
  {
    rank: 10,
    name: "Hannah Montana",
    avatar: "https://github.com/shadcn.png",
    fallback: "HM",
    points: 1050,
  },
];

function RankingPage() {
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
    <div className="flex flex-col items-center justify-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex flex-col min-h-screen items-center justify-start py-10">
        <GoBack href="/learning" />
        <h2 className="scroll-m-20 border-b mb-2 pb-2 text-5xl font-semibold tracking-tight first:mt-0 z-[999]">
          AlgoatRanking WorldWide
        </h2>
        <p className="z-[999] mb-5">
          Are you one of the GOAT of all Algoaters? Find out here!
        </p>
        <RankingTable />
      </div>
    </div>
  );
}

export default withAuth(RankingPage, true);
