"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  {
    rank: 11,
    name: "Isaac Newton",
    avatar: "https://github.com/shadcn.png",
    fallback: "IN",
    points: 1000,
  },
  {
    rank: 12,
    name: "Jessica Pearson",
    avatar: "https://github.com/shadcn.png",
    fallback: "JP",
    points: 950,
  },
  {
    rank: 13,
    name: "Katherine Pierce",
    avatar: "https://github.com/shadcn.png",
    fallback: "KP",
    points: 900,
  },
  {
    rank: 14,
    name: "Leonard Hofstadter",
    avatar: "https://github.com/shadcn.png",
    fallback: "LH",
    points: 850,
  },
  {
    rank: 15,
    name: "Michael Scott",
    avatar: "https://github.com/shadcn.png",
    fallback: "MS",
    points: 800,
  },
  // Add more users as needed
];

const ITEMS_PER_PAGE = 10;

export default function RankingTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-4xl mx-auto z-[999]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Wins</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedUsers.map((user) => (
            <TableRow key={user.rank}>
              <TableCell>{user.rank}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                  />
                  <AvatarFallback>{user.fallback}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
