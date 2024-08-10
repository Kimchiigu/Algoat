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
    name: "01 - Pengenalan Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "Red-Black Tree adalah jenis Balanced Binary Tree yang menggunakan pewarnaan node untuk menjaga keseimbangan.",
    content: `
      Red-Black Tree adalah jenis Balanced Binary Tree yang memiliki aturan pewarnaan untuk menjaga keseimbangan setelah setiap operasi penyisipan atau penghapusan. Setiap node dalam Red-Black Tree diberi warna merah atau hitam, dan aturan-aturan tertentu harus diikuti untuk memastikan bahwa tree tetap seimbang.

      *Karakteristik Red-Black Tree:*
      - Setiap node berwarna merah atau hitam.
      - Root selalu berwarna hitam.
      - Setiap daun (node kosong) berwarna hitam.
      - Jika sebuah node berwarna merah, maka kedua anaknya harus berwarna hitam (tidak ada dua node merah yang berturut-turut).
      - Setiap jalur dari sebuah node ke daun (atau node kosong) harus memiliki jumlah node hitam yang sama.

      *Keuntungan Red-Black Tree:*
      Red-Black Tree memastikan bahwa operasi pencarian, penyisipan, dan penghapusan dapat dilakukan dalam waktu O(log n) dalam skenario terburuk, membuatnya sangat efisien dalam berbagai aplikasi.

      *Aplikasi Red-Black Tree:*
      Red-Black Tree digunakan dalam berbagai aplikasi seperti pengelolaan basis data, sistem file, dan implementasi bahasa pemrograman seperti Java dan C++.
    `,
  },
  {
    name: "02 - Operasi pada Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Operasi pada Red-Black Tree melibatkan penyisipan, penghapusan, dan penyeimbangan menggunakan rotasi dan pewarnaan.",
    content: `
      Red-Black Tree mendukung operasi penyisipan, penghapusan, dan pencarian dengan memastikan bahwa tree tetap seimbang melalui rotasi dan penyesuaian pewarnaan.

      *Penyisipan dalam Red-Black Tree:*
      Ketika sebuah node baru disisipkan, node tersebut awalnya diwarnai merah. Jika hal ini menyebabkan dua node merah berturut-turut, maka dilakukan rotasi dan pewarnaan ulang untuk menjaga keseimbangan tree sesuai aturan Red-Black Tree.

      *Penghapusan dalam Red-Black Tree:*
      Penghapusan node dalam Red-Black Tree lebih kompleks dibandingkan penyisipan. Ketika sebuah node dihapus, perlu dilakukan penyesuaian untuk memastikan bahwa aturan-aturan pewarnaan tetap dipenuhi, yang mungkin melibatkan rotasi dan perubahan warna.

      *Penyeimbangan Red-Black Tree:*
      Penyeimbangan dalam Red-Black Tree dilakukan melalui dua jenis rotasi:
      - *Rotasi Kiri (Left Rotation):* Digunakan ketika subtree kanan terlalu tinggi.
      - *Rotasi Kanan (Right Rotation):* Digunakan ketika subtree kiri terlalu tinggi.
      Penyeimbangan ini dilakukan secara otomatis setelah penyisipan atau penghapusan untuk memastikan bahwa tree tetap efisien.
    `,
  },
  {
    name: "03 - Keuntungan dan Kelemahan Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    shortDesc:
      "Red-Black Tree menawarkan efisiensi tinggi dalam operasi tree, namun memiliki kompleksitas yang lebih tinggi dibandingkan tree lainnya.",
    content: `
      Red-Black Tree adalah struktur data yang sangat efisien, namun juga memiliki kompleksitas tertentu yang perlu dipertimbangkan.

      *Keuntungan Red-Black Tree:*
      - *Efisiensi:* Operasi pada Red-Black Tree dilakukan dalam O(log n) waktu, memastikan performa yang cepat.
      - *Keseimbangan:* Tree selalu mendekati seimbang, yang berarti bahwa operasi tree tetap efisien bahkan dengan sejumlah besar data.
      - *Penggunaan Umum:* Red-Black Tree digunakan dalam berbagai aplikasi termasuk pengelolaan basis data, sistem file, dan banyak lagi.

      *Kelemahan Red-Black Tree:*
      - *Kompleksitas Implementasi:* Red-Black Tree lebih kompleks untuk diimplementasikan dibandingkan struktur data lainnya seperti AVL Tree.
      - *Overhead Penyeimbangan:* Penyeimbangan otomatis setelah setiap operasi bisa menambah overhead, terutama pada operasi penyisipan dan penghapusan yang kompleks.

      *Kesimpulan:*
      Red-Black Tree adalah pilihan yang sangat baik untuk aplikasi di mana keseimbangan tree dan efisiensi operasi sangat penting, meskipun memerlukan lebih banyak upaya dalam implementasi dan pemeliharaan.
    `,
  },
  {
    name: "04 - Aplikasi Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    shortDesc:
      "Red-Black Tree digunakan dalam berbagai aplikasi penting, termasuk basis data, sistem file, dan algoritma pemrograman.",
    content: `
      Red-Black Tree adalah struktur data yang banyak digunakan dalam berbagai aplikasi penting karena sifatnya yang efisien dan seimbang.

      *Aplikasi dalam Basis Data:*
      Red-Black Tree digunakan untuk mengimplementasikan indeks dalam sistem basis data. Indeks ini memungkinkan pencarian data yang cepat dan efisien, yang sangat penting untuk kinerja basis data yang tinggi.

      *Penggunaan dalam Sistem File:*
      Sistem file sering menggunakan Red-Black Tree untuk mengelola struktur direktori dan file. Ini memungkinkan operasi seperti pencarian file, penambahan file, dan penghapusan file dilakukan dengan cepat.

      *Algoritma Pemrograman:*
      Red-Black Tree juga digunakan dalam algoritma pemrograman, termasuk pengelolaan memori dan penyusunan prioritas tugas dalam sistem operasi.

      *Penggunaan dalam Bahasa Pemrograman:*
      Bahasa pemrograman seperti Java dan C++ menggunakan Red-Black Tree dalam implementasi kelas koleksi mereka, seperti TreeMap dan TreeSet di Java, untuk menyimpan data dalam urutan tertentu dan memungkinkan pencarian yang cepat.
    `,
  },
];

function RBTPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMaterials = materials.length;

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
                    <Button onClick={() => handleReadMore(index)}>
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
                __html: materials[currentIndex].content,
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

export default withAuth(RBTPage, true);
