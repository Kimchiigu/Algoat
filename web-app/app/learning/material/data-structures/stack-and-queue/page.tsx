"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Crown } from "lucide-react";

const materials = [
  {
    name: "01 - Introduction",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    content: `
      Data structures are a way of organizing and storing data so that they can be accessed and modified efficiently.
      This section introduces the basic concepts and importance of data structures in computer science.
      Topics include:
      - Definition and types of data structures.
      - The role of data structures in algorithm design.
      - Examples of common data structures used in programming.
    `,
  },
  {
    name: "02 - Linked List",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    content: `
      A linked list is a linear data structure where elements are not stored at contiguous memory locations.
      Each element (node) in a linked list contains a reference (link) to the next element in the sequence.
      Topics include:
      - Introduction to linked lists and their types (singly, doubly, and circular linked lists).
      - Operations on linked lists: insertion, deletion, traversal, and searching.
      - Advantages and disadvantages of linked lists compared to arrays.
    `,
  },
  {
    name: "03 - Stack",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    content: `
      A stack is a linear data structure that follows the Last In, First Out (LIFO) principle.
      It is used for storing data in a way that the last element added is the first to be removed.
      Topics include:
      - Introduction to stacks and their applications.
      - Stack operations: push, pop, peek, and isEmpty.
      - Implementation of stacks using arrays and linked lists.
    `,
  },
  {
    name: "04 - Queue",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    content: `
      A queue is a linear data structure that follows the First In, First Out (FIFO) principle.
      It is used for storing data in a way that the first element added is the first to be removed.
      Topics include:
      - Introduction to queues and their applications.
      - Queue operations: enqueue, dequeue, front, rear, and isEmpty.
      - Implementation of queues using arrays and linked lists.
      - Types of queues: simple queue, circular queue, priority queue, and deque (double-ended queue).
    `,
  },
  // Add more materials as needed
];

export default function RoomPage() {
  return (
    <div className="flex justify-between p-4 space-x-4">
      {/* Course Outline */}
      <Card className="flex flex-col w-1/4 h-screen p-4">
        <CardHeader>
          <CardTitle>Course Outline</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-full">
            <Accordion type="single" collapsible className="w-full">
              {materials.map((material, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Avatar className="mr-2">
                        <AvatarImage
                          src={material.avatar}
                          alt={material.name}
                        />
                        <AvatarFallback>{material.fallback}</AvatarFallback>
                      </Avatar>
                      <span className="flex-grow">{material.name}</span>
                      {index === 0 && (
                        <span>
                          <Crown className="ml-2" />
                        </span>
                      )}{" "}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2">
                      <p className="">{material.content}</p>
                      <Separator className="my-2" />
                      {/* Add more content or components here if needed */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full">
            Go Back
          </Button>
        </CardFooter>
      </Card>

      {/* Room Settings */}
      <Card className="flex flex-col w-1/2 h-screen p-4">
        <CardHeader>
          <CardTitle>{materials[0].name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <p>{materials[0].content}</p>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-grow">Previous</Button>
            <Button className="flex-grow" variant="default">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Room Chat */}
      <Card className="flex flex-col w-1/4 h-screen p-4">
        <CardHeader>
          <CardTitle>Ask AI-Goat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow bg-slate-900 rounded-md">
          {/* Messages area, replace with actual chat implementation */}
        </CardContent>
        <CardFooter className="mt-5 w-full flex space-x-2">
          <Input className="flex-grow" placeholder="Type your message" />
          <Button type="submit">Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
