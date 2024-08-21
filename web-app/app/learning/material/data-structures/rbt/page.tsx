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
    name: "01 - Apa itu Red-Black Tree?",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "Red-Black Tree adalah jenis struktur data pohon biner yang seimbang, yang ditemukan pada tahun 1972 untuk memastikan keseimbangan pohon biner secara otomatis.",
    content: `
      Red-Black Tree (RBT) adalah jenis pohon biner yang seimbang, yang digunakan dalam ilmu komputer untuk memastikan bahwa operasi pencarian, penyisipan, dan penghapusan dapat dilakukan dengan efisien. Pohon ini diberi nama berdasarkan pewarnaan node dalam tree, yaitu merah dan hitam.

      <b>Penemuan Red-Black Tree:</b>
      - <b>Penemu:</b> Red-Black Tree ditemukan oleh Rudolf Bayer, seorang ilmuwan komputer.
      - <b>Tahun Ditemukan:</b> Red-Black Tree pertama kali diperkenalkan pada tahun 1972.
      
      <b>Tujuan Red-Black Tree:</b>
      - Tujuan utama dari Red-Black Tree adalah untuk menjaga keseimbangan pohon biner secara otomatis setelah setiap operasi penyisipan dan penghapusan, tanpa memerlukan intervensi manual.
      
      <b>Alasan Red-Black Tree Dibuat:</b>
      - Red-Black Tree dibuat untuk mengatasi masalah yang terjadi pada pohon biner biasa, di mana pohon bisa menjadi tidak seimbang setelah beberapa operasi, menyebabkan operasi pencarian, penyisipan, dan penghapusan menjadi tidak efisien. Dengan menjaga keseimbangan melalui aturan pewarnaan, RBT memastikan bahwa pohon tetap mendekati seimbang, sehingga operasi tetap dapat dilakukan dalam waktu O(log n) bahkan dalam kasus terburuk.
    `,
  },
  {
    name: "02 - Properti Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Red-Black Tree memiliki beberapa properti yang harus dipenuhi untuk memastikan keseimbangan tree.",
    content: `
      Red-Black Tree memiliki beberapa properti yang harus dipenuhi untuk memastikan keseimbangan tree. Properti-properti tersebut adalah sebagai berikut:

      <b>Properti Red-Black Tree:</b>
      - Setiap node memiliki warna, merah atau hitam.
      - Root selalu berwarna hitam.
      - Semua node eksternal berwarna hitam.
      - Jika sebuah node berwarna merah, maka kedua anaknya harus berwarna hitam.
    `,
  },
  {
    name: "03 - Operasi Insert pada Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    shortDesc:
      "Operasi insert pada Red-Black Tree melibatkan penyisipan node baru dan memperbaiki pelanggaran yang terjadi.",
    content: `
      Operasi insert pada Red-Black Tree melibatkan beberapa langkah untuk memastikan bahwa tree tetap seimbang setelah penambahan node baru.

      <b>Langkah-langkah Insert:</b>
      - Menyisipkan node baru sama seperti menyisipkan dalam binary search tree (node baru harus ditempatkan di salah satu node eksternal).
      - Node baru tersebut berwarna merah.
      - Jika orang tua (parent) berwarna hitam, maka tidak ada pelanggaran yang terjadi.
      - Jika orang tua berwarna merah, maka terjadi pelanggaran (tidak ada node merah yang memiliki orang tua berwarna merah).

      <b>Memperbaiki Pelanggaran:</b>
      - Biarkan node baru tersebut sebagai q, orang tuanya sebagai p, dan saudara dari orang tuanya sebagai s (paman dari q). Jika orang tua tidak memiliki saudara, maka s adalah hitam (node eksternal adalah hitam).
      - Jika s berwarna merah, ubah p dan s menjadi hitam dan orang tua dari p menjadi merah (proses recoloring).
      - Jika s berwarna hitam, lakukan rotasi (rotasi tunggal atau ganda), ubah pivot terakhir dari rotasi menjadi hitam dan anaknya menjadi merah.
    `,
  },
  {
    name: "04 - Operasi Delete pada Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    shortDesc:
      "Operasi delete pada Red-Black Tree memastikan tree tetap seimbang setelah penghapusan node.",
    content: `
      Operasi delete dalam Red-Black Tree melibatkan beberapa langkah untuk memastikan pohon tetap seimbang dan mengikuti aturan red-black.

      <b>Langkah-langkah Delete:</b>
      - Lakukan penghapusan standar BST (node yang dihapus akan digantikan oleh node anaknya atau oleh node kosong).
      - Jika salah satu dari u atau node yang dihapus (v) berwarna merah, tandai anak yang digantikan sebagai hitam. Tidak ada perubahan pada black height.
      - Jika baik u maupun v berwarna hitam, u menjadi Double Black.

      <b>Menghilangkan Double Black:</b>
      - Jika saudara (s) dari node yang digantikan (u) berwarna hitam dan setidaknya salah satu anaknya berwarna merah, lakukan restrukturisasi (rotasi AVL).
      - Jika saudara berwarna hitam dan kedua anaknya berwarna hitam, lakukan recoloring (orang tua diberi warna hitam dan saudara diberi warna merah) dan lanjutkan proses ini pada orang tua jika orang tua berwarna hitam.
      - Jika saudara berwarna merah, lakukan penyesuaian (rotasi untuk menaikkan saudara lama, ubah warna saudara lama dan orang tua. Saudara baru selalu berwarna hitam).
    `,
  },
  {
    name: "05 - Aplikasi Red-Black Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "05",
    shortDesc:
      "Red-Black Tree digunakan dalam berbagai aplikasi penting, termasuk basis data, sistem file, dan algoritma pemrograman.",
    content: `
      Red-Black Tree adalah struktur data yang banyak digunakan dalam berbagai aplikasi penting karena sifatnya yang efisien dan seimbang.

      <b>Aplikasi dalam Basis Data:</b>
      Red-Black Tree digunakan untuk mengimplementasikan indeks dalam sistem basis data. Indeks ini memungkinkan pencarian data yang cepat dan efisien, yang sangat penting untuk kinerja basis data yang tinggi.

      <b>Penggunaan dalam Sistem File:</b>
      Sistem file sering menggunakan Red-Black Tree untuk mengelola struktur direktori dan file. Ini memungkinkan operasi seperti pencarian file, penambahan file, dan penghapusan file dilakukan dengan cepat.

      <b>Algoritma Pemrograman:</b>
      Red-Black Tree juga digunakan dalam algoritma pemrograman, termasuk pengelolaan memori dan penyusunan prioritas tugas dalam sistem operasi.

      <b>Penggunaan dalam Bahasa Pemrograman:</b>
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
      <Card className="flex flex-col w-1/4 h-full p-4">
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
      <Card className="flex flex-col w-1/2 h-full p-4">
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
