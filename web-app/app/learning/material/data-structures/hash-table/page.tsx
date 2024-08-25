"use client";

import { useRouter } from "next/navigation";
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
import withAuth from "@/hoc/withAuth";

const materials = [
  {
    name: "01 - Hash Table",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "Hash Table adalah struktur data yang menggunakan hash function untuk memetakan kunci ke dalam bucket atau slot yang digunakan untuk menyimpan data.",
    content: `
      Hash Table adalah struktur data yang sangat efisien untuk melakukan pencarian, penyisipan, dan penghapusan data. Struktur ini menggunakan hash function untuk memetakan kunci ke dalam bucket atau slot, di mana data disimpan. 

      **Pengenalan dan Sifat-Sifat Hash Table:**
      Dalam Hash Table, setiap kunci dikonversi menjadi indeks menggunakan hash function. Indeks ini kemudian digunakan untuk menyimpan nilai dalam tabel. Salah satu sifat penting dari Hash Table adalah kemampuannya untuk menyediakan akses ke data dalam waktu konstan rata-rata, O(1), menjadikannya sangat cepat untuk operasi pencarian.

      **Operasi pada Hash Table:**
      Operasi dasar pada Hash Table meliputi penyisipan (insertion), penghapusan (deletion), dan pencarian (searching). Ketika terjadi bentrokan (collision) di mana dua kunci menghasilkan indeks yang sama, teknik seperti chaining atau open addressing digunakan untuk menangani bentrokan tersebut.

      **Aplikasi Hash Table:**
      Hash Table digunakan dalam berbagai aplikasi seperti implementasi kamus (dictionary), caching, dan pengindeksan basis data. Hash Table juga sangat umum digunakan dalam implementasi struktur data lainnya seperti set dan map.
    `,
  },
  {
    name: "02 - Hashing",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Hashing adalah proses menggunakan hash function untuk mengubah data menjadi representasi tetap, yang biasanya digunakan dalam Hash Table.",
    content: `
      Hashing adalah teknik yang digunakan untuk mengonversi data menjadi representasi tetap menggunakan hash function. Hash function menghasilkan nilai hash yang kemudian digunakan sebagai indeks untuk menyimpan data dalam Hash Table.

      **Operasi pada Hashing:**
      Hash function menerima input berupa data dan menghasilkan output berupa nilai hash yang unik untuk data tersebut. Hash function yang baik harus cepat dan menghasilkan distribusi nilai hash yang merata untuk mengurangi bentrokan (collision).

      **Keuntungan dan Kelemahan Hashing:**
      Keuntungan utama dari hashing adalah kemampuannya untuk melakukan operasi pencarian, penyisipan, dan penghapusan dengan cepat. Namun, kelemahannya terletak pada kemungkinan terjadinya bentrokan, di mana dua data berbeda menghasilkan nilai hash yang sama. Teknik seperti chaining atau open addressing digunakan untuk menangani masalah ini.

      **Penerapan Hashing:**
      Hashing digunakan dalam banyak aplikasi seperti pengindeksan dalam basis data, caching, dan implementasi struktur data seperti Hash Table. Hashing juga digunakan dalam kriptografi untuk menghasilkan hash yang mewakili data dalam bentuk yang lebih aman.
    `,
  },
  {
    name: "03 - Hash Function",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    shortDesc:
      "Hash Function adalah fungsi yang mengubah input data menjadi nilai hash tetap yang digunakan untuk mengindeks data dalam Hash Table.",
    content: `
      Hash Function adalah fungsi yang mengubah data masukan menjadi nilai hash tetap yang digunakan sebagai indeks dalam Hash Table. Nilai hash ini biasanya berupa angka yang dihasilkan dari data masukan melalui proses komputasi tertentu.

      **Jenis-Jenis Hash Function:**
      Ada berbagai jenis hash function, termasuk:
      - **Deterministic Hash Function:** Fungsi yang selalu menghasilkan nilai hash yang sama untuk input yang sama.
      - **Cryptographic Hash Function:** Fungsi yang dirancang untuk keamanan, menghasilkan nilai hash yang sulit diprediksi.
      - **Non-Cryptographic Hash Function:** Fungsi yang dirancang untuk kecepatan dan efisiensi, digunakan dalam aplikasi seperti Hash Table.

      **Sifat-Sifat Hash Function:**
      Hash function yang baik harus memiliki sifat seperti determinisme, distribusi yang merata, dan ketahanan terhadap bentrokan. Sifat-sifat ini penting untuk memastikan bahwa hash function dapat digunakan secara efektif dalam berbagai aplikasi.

      **Implementasi Hash Function:**
      Implementasi hash function harus memperhitungkan berbagai faktor seperti ukuran data masukan dan distribusi hasil hash untuk mengurangi kemungkinan bentrokan. Implementasi yang buruk dapat menyebabkan kinerja yang buruk dalam aplikasi yang menggunakan Hash Table.

      **Aplikasi Hash Function:**
      Hash Function digunakan dalam berbagai aplikasi termasuk pengindeksan basis data, pencocokan pola, dan kriptografi. Dalam kriptografi, hash function digunakan untuk memastikan integritas data dan menghasilkan tanda tangan digital.
    `,
  },
  {
    name: "04 - Collision Handling",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    shortDesc:
      "Collision Handling adalah metode untuk menangani bentrokan yang terjadi ketika dua kunci berbeda menghasilkan nilai hash yang sama dalam Hash Table.",
    content: `
      Collision Handling adalah teknik yang digunakan untuk menangani situasi di mana dua atau lebih kunci berbeda menghasilkan nilai hash yang sama dalam Hash Table. Bentrokan ini adalah masalah umum dalam struktur data yang menggunakan hash function.

      **Jenis-Jenis Collision Handling:**
      Ada beberapa teknik untuk menangani bentrokan, termasuk:
      - **Chaining:** Teknik di mana setiap slot dalam Hash Table berisi list yang dapat menampung beberapa elemen dengan nilai hash yang sama.
      - **Open Addressing:** Teknik di mana elemen yang berbenturan disimpan di slot lain dalam tabel yang masih kosong.
      - **Double Hashing:** Teknik yang menggunakan dua hash function untuk menemukan slot kosong ketika terjadi bentrokan.

      **Keuntungan dan Kelemahan Teknik-Teknik Collision Handling:**
      Masing-masing teknik memiliki keuntungan dan kelemahan tersendiri. Misalnya, chaining mudah diimplementasikan dan menangani bentrokan dengan baik, tetapi dapat menyebabkan penggunaan memori yang lebih besar. Open addressing lebih efisien dalam penggunaan memori tetapi dapat memperlambat operasi saat tabel menjadi penuh.

      **Implementasi Collision Handling:**
      Implementasi collision handling harus mempertimbangkan trade-off antara efisiensi dan kompleksitas. Memilih teknik yang tepat tergantung pada ukuran Hash Table, frekuensi operasi, dan distribusi data.

      **Penerapan Collision Handling:**
      Collision Handling diterapkan dalam banyak aplikasi yang menggunakan Hash Table, seperti pengindeksan dalam basis data, caching, dan pengolahan data besar. Teknik ini memastikan bahwa meskipun terjadi bentrokan, operasi tetap dapat dilakukan dengan efisien.
    `,
  },
];

function HashTablePage() {
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
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2">
                      <p className="">{material.shortDesc}</p>
                      <Separator className="my-2" />
                      {/* Add more content or components here if needed */}
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

export default withAuth(HashTablePage, true);
