"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import withAuth from "@/hoc/withAuth";
import { useRouter } from "next/navigation";

const materials = [
  {
    name: "01 - Stack",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "Stack adalah struktur data linear yang mengikuti prinsip Last In, First Out (LIFO).",
    content: `
      Stack adalah struktur data linear yang mengikuti prinsip Last In, First Out (LIFO), di mana elemen yang terakhir ditambahkan adalah yang pertama dihapus. Struktur ini mirip dengan tumpukan buku di mana buku yang paling atas adalah yang pertama kali diambil.

      *Operasi pada Stack:*
      Beberapa operasi dasar pada stack meliputi:
      - *Push:* Menambahkan elemen baru di atas stack.
      - *Pop:* Menghapus elemen teratas dari stack.
      - *Peek:* Mengakses elemen teratas tanpa menghapusnya.
      - *isEmpty:* Mengecek apakah stack kosong.

      *Implementasi Stack:*
      Stack dapat diimplementasikan menggunakan array atau linked list. Dengan array, kita bisa menggunakan indeks untuk melacak elemen teratas. Dalam linked list, node terakhir yang ditambahkan dianggap sebagai elemen teratas.

      *Aplikasi Stack:*
      Stack sering digunakan dalam berbagai aplikasi seperti:
      - Pemrosesan ekspresi matematika (misalnya, notasi postfix).
      - Algoritma backtracking (misalnya, pencarian jalan dalam maze).
      - Implementasi undo dalam perangkat lunak.
    `,
  },
  {
    name: "02 - Queue",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Queue adalah struktur data linear yang mengikuti prinsip First In, First Out (FIFO).",
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
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMaterials = materials.length;

  const parseMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % totalMaterials);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + totalMaterials) % totalMaterials);
  };

  const handleReadMore = (index: number) => {
    setCurrentIndex(index);
  };

  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { user: boolean; message: string }[]
  >([
    {
      user: false,
      message: "Halo! Bagaimana saya bisa membantu Anda hari ini?",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: true, message: userInput },
    ]);

    try {
      const response = await fetch(
        "http://algoatapi3-production.up.railway.app/answer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userInput,
            context: `
            Stack adalah struktur data linear yang mengikuti prinsip Last In, First Out (LIFO), di mana elemen yang terakhir ditambahkan adalah yang pertama dihapus. Struktur ini mirip dengan tumpukan buku di mana buku yang paling atas adalah yang pertama kali diambil. Operasi dasar pada stack meliputi Push, Pop, Peek, dan isEmpty.

            Queue adalah struktur data linear yang mengikuti prinsip First In, First Out (FIFO), di mana elemen yang pertama kali ditambahkan adalah yang pertama kali dihapus. Queue dapat diimplementasikan menggunakan array atau linked list, dan sering digunakan dalam berbagai aplikasi seperti manajemen antrean dan pemrosesan antrian printer.

            Stack dan Queue adalah dua struktur data fundamental yang sering digunakan dalam pemrograman. Meskipun keduanya memiliki perbedaan mendasar dalam cara data diakses, keduanya sangat berguna dalam berbagai situasi. Implementasi yang tepat dari struktur data ini dapat meningkatkan efisiensi algoritma secara signifikan.
          `,
          }),
        }
      );
      const data = await response.json();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: data.answer },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setUserInput(""); // Clear the input field
  };

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
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2">
                      <p className="">{material.shortDesc}</p>
                      <Separator className="my-2" />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleReadMore(index)}
                    >
                      Read More
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            className="w-full"
            onClick={() => router.push("/learning/material/data-structures")}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>

      {/* Room Settings */}
      <Card className="flex flex-col w-1/2 h-screen p-4">
        <CardHeader>
          <CardTitle>{materials[currentIndex].name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 whitespace-pre-line">
          <div className="flex flex-col">
            <p
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(materials[currentIndex].content),
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button className="flex-grow" onClick={handlePrev}>
              Previous
            </Button>
            <Button
              className="flex-grow"
              variant="default"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ask AI-Goat */}
      <Card className="flex flex-col w-1/4 h-screen p-4">
        <CardHeader>
          <CardTitle>Ask AI-Goat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow bg-slate-900 rounded-md overflow-hidden">
          <ScrollArea className="h-full p-4 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-2 rounded-lg ${
                  msg.user
                    ? "text-right ml-16 bg-blue-600"
                    : "text-left mr-16 bg-gray-600"
                }`}
              >
                <p className="text-white">{msg.message}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="w-full flex space-x-2">
          <form onSubmit={handleFormSubmit} className="w-full flex space-x-2">
            <Input
              className="flex-grow"
              placeholder="Type your message"
              value={userInput}
              onChange={handleInputChange}
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
