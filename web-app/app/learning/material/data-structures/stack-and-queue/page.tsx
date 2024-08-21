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
      Queue adalah struktur data linear yang mengikuti prinsip First In, First Out (FIFO), di mana elemen yang pertama kali ditambahkan adalah yang pertama kali dihapus. Struktur ini mirip dengan antrian orang di loket tiket, di mana orang pertama dalam antrian adalah yang pertama dilayani.

      *Operasi pada Queue:*
      Beberapa operasi dasar pada queue meliputi:
      - *Enqueue:* Menambahkan elemen baru di belakang queue.
      - *Dequeue:* Menghapus elemen dari depan queue.
      - *Front:* Mengakses elemen di depan tanpa menghapusnya.
      - *Rear:* Mengakses elemen di belakang.
      - *isEmpty:* Mengecek apakah queue kosong.

      *Implementasi Queue:*
      Queue dapat diimplementasikan menggunakan array atau linked list. Dengan array, indeks depan dan belakang digunakan untuk melacak elemen pertama dan terakhir. Dalam linked list, node pertama dianggap sebagai elemen depan dan node terakhir sebagai elemen belakang.

      *Jenis-Jenis Queue:*
      - *Simple Queue:* Queue dasar yang mengikuti prinsip FIFO.
      - *Circular Queue:* Queue di mana elemen terakhir terhubung kembali ke elemen pertama, membentuk lingkaran.
      - *Priority Queue:* Queue di mana elemen diproses berdasarkan prioritas, bukan urutan kedatangan.
      - *Deque (Double-ended Queue):* Queue yang memungkinkan penyisipan dan penghapusan elemen dari kedua ujung.

      *Aplikasi Queue:*
      Queue digunakan dalam berbagai aplikasi seperti:
      - Manajemen antrian di sistem operasi.
      - Penjadwalan proses dalam CPU.
      - Penanganan antrean printer.
      - Pengiriman data di jaringan.
    `,
  },
];

function StackQueuePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMaterials = materials.length;

  const parseMarkdown = (text: string) => {
    return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
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
          <Button variant="default" className="w-full">
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

export default withAuth(StackQueuePage, true);
