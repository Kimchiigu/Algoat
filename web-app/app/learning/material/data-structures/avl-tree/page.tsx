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
    name: "01 - Introduction to AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "AVL Tree adalah varian dari Binary Search Tree yang selalu seimbang, menjaga efisiensi operasi pencarian, penyisipan, dan penghapusan.",
    content: `
      AVL Tree adalah jenis Balanced Binary Tree yang pertama kali diperkenalkan oleh Adelson-Velsky dan Landis pada tahun 1962. AVL Tree adalah salah satu varian dari Binary Search Tree (BST) yang memiliki mekanisme otomatis untuk menjaga keseimbangan tinggi dari pohon biner setelah setiap operasi penyisipan dan penghapusan. Keseimbangan ini dicapai dengan memastikan bahwa perbedaan tinggi antara anak kiri dan anak kanan dari setiap node tidak lebih dari satu.

      **Keuntungan dari AVL Tree:**
      AVL Tree menawarkan waktu pencarian, penyisipan, dan penghapusan yang konsisten dan efisien, dengan kompleksitas waktu O(log n). Ini membuat AVL Tree sangat efektif dalam aplikasi yang membutuhkan waktu respons yang cepat dan konsisten, seperti database dan sistem pencarian informasi.

      **Keseimbangan dalam AVL Tree:**
      AVL Tree menggunakan rotasi untuk menjaga keseimbangan pohon. Rotasi ini dapat berupa rotasi tunggal atau ganda, tergantung pada kondisi keseimbangan setelah operasi penyisipan atau penghapusan.

      **Aplikasi AVL Tree:**
      AVL Tree banyak digunakan dalam aplikasi di mana waktu akses dan efisiensi sangat penting, seperti dalam algoritma pencarian cepat, sistem database, dan struktur data lainnya yang membutuhkan keseimbangan dan kecepatan.
    `,
  },
  {
    name: "02 - Searching in AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Operasi pencarian dalam AVL Tree dilakukan dengan cara yang mirip dengan Binary Search Tree, tetapi dengan kinerja yang lebih konsisten.",
    content: `
      Operasi pencarian dalam AVL Tree sangat mirip dengan pencarian dalam Binary Search Tree (BST). Proses pencarian dimulai dari root dan terus turun ke anak kiri atau anak kanan berdasarkan nilai yang dicari. Jika nilai yang dicari lebih kecil dari nilai node saat ini, pencarian dilanjutkan ke anak kiri; jika lebih besar, pencarian dilanjutkan ke anak kanan.

      **Keunggulan Pencarian dalam AVL Tree:**
      Karena AVL Tree selalu seimbang, waktu pencarian dalam AVL Tree selalu berada dalam O(log n). Ini memastikan bahwa operasi pencarian tetap cepat dan efisien bahkan saat pohon memiliki banyak node.

      **Kompleksitas Waktu:**
      Kompleksitas waktu pencarian dalam AVL Tree adalah O(log n), yang lebih efisien dibandingkan dengan Binary Search Tree yang tidak seimbang, di mana kompleksitas waktu dapat meningkat menjadi O(n) dalam kasus terburuk.
    `,
  },
  {
    name: "03 - Insertion in AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    shortDesc:
      "Proses penyisipan dalam AVL Tree melibatkan penambahan node baru dan menjaga keseimbangan pohon dengan rotasi jika diperlukan.",
    content: `
      Penyisipan dalam AVL Tree dimulai dengan menambahkan node baru ke pohon seperti dalam Binary Search Tree (BST). Node baru ditempatkan di posisi yang sesuai berdasarkan nilai, seperti dalam BST.

      **Langkah-langkah Penyisipan:**
      1. **Penempatan Node Baru:** Node baru ditempatkan di posisi yang sesuai dalam pohon sesuai dengan aturan Binary Search Tree.
      2. **Memeriksa Keseimbangan:** Setelah node baru ditambahkan, keseimbangan pohon diperiksa. Jika pohon menjadi tidak seimbang, rotasi dilakukan untuk mengembalikan keseimbangan.
      3. **Rotasi:** AVL Tree menggunakan rotasi tunggal atau ganda untuk mengembalikan keseimbangan jika diperlukan.

      **Kompleksitas Waktu Penyisipan:**
      Kompleksitas waktu penyisipan dalam AVL Tree adalah O(log n), dengan overhead tambahan untuk memeriksa dan memulihkan keseimbangan, yang juga berada dalam O(log n).
    `,
  },
  {
    name: "04 - Deletion in AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    shortDesc:
      "Penghapusan node dalam AVL Tree memerlukan penghapusan node seperti dalam BST, diikuti dengan penyesuaian untuk menjaga keseimbangan.",
    content: `
      Penghapusan dalam AVL Tree melibatkan dua langkah utama: menghapus node dari pohon seperti dalam Binary Search Tree (BST) dan kemudian memulihkan keseimbangan jika pohon menjadi tidak seimbang.

      **Langkah-langkah Penghapusan:**
      1. **Menghapus Node:** Node yang akan dihapus ditemukan dan dihapus dari pohon seperti dalam BST. Jika node memiliki dua anak, penggantian dilakukan dengan node terdekat dalam urutan inorder.
      2. **Memeriksa Keseimbangan:** Setelah penghapusan, keseimbangan pohon diperiksa. Jika pohon menjadi tidak seimbang, rotasi dilakukan untuk memulihkan keseimbangan.
      3. **Rotasi:** AVL Tree menggunakan rotasi tunggal atau ganda untuk mengembalikan keseimbangan setelah penghapusan.

      **Kompleksitas Waktu Penghapusan:**
      Kompleksitas waktu penghapusan dalam AVL Tree adalah O(log n), dengan overhead tambahan untuk memeriksa dan memulihkan keseimbangan.
    `,
  },
  {
    name: "05 - Rotations in AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "05",
    shortDesc:
      "Rotasi dalam AVL Tree digunakan untuk menjaga keseimbangan pohon setelah operasi penyisipan atau penghapusan.",
    content: `
      Rotasi adalah operasi kunci dalam AVL Tree yang digunakan untuk memulihkan keseimbangan setelah pohon menjadi tidak seimbang akibat penyisipan atau penghapusan. Ada dua jenis rotasi dasar dalam AVL Tree: rotasi tunggal dan rotasi ganda.

      **Jenis-Jenis Rotasi:**
      1. **Rotasi Kiri (Left Rotation):** Digunakan ketika anak kanan dari node yang tidak seimbang memiliki tinggi lebih besar dari anak kirinya.
      2. **Rotasi Kanan (Right Rotation):** Digunakan ketika anak kiri dari node yang tidak seimbang memiliki tinggi lebih besar dari anak kanannya.
      3. **Rotasi Kanan-Kiri (Right-Left Rotation):** Kombinasi dari rotasi kanan dan kiri, digunakan ketika anak kiri dari anak kanan lebih besar dari anak kanan itu sendiri.
      4. **Rotasi Kiri-Kanan (Left-Right Rotation):** Kombinasi dari rotasi kiri dan kanan, digunakan ketika anak kanan dari anak kiri lebih besar dari anak kiri itu sendiri.

      **Aplikasi Rotasi:**
      Rotasi digunakan dalam operasi penyisipan dan penghapusan untuk memastikan bahwa AVL Tree tetap seimbang, menjaga kompleksitas waktu untuk operasi pencarian, penyisipan, dan penghapusan tetap dalam O(log n).
    `,
  },
  {
    name: "06 - Applications of AVL Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "06",
    shortDesc:
      "AVL Tree digunakan dalam aplikasi yang membutuhkan waktu pencarian cepat dan konsisten, seperti dalam sistem basis data dan struktur data lainnya.",
    content: `
      AVL Tree banyak digunakan dalam aplikasi di mana efisiensi dan konsistensi waktu pencarian sangat penting. Beberapa contoh aplikasi dari AVL Tree termasuk:

      **Sistem Basis Data:**
      AVL Tree digunakan untuk mengindeks data dalam sistem basis data, memastikan bahwa waktu pencarian tetap cepat dan konsisten bahkan dengan jumlah data yang besar.

      **Sistem Pencarian Informasi:**
      AVL Tree digunakan dalam mesin pencari dan sistem pencarian informasi lainnya untuk mengorganisir dan mengambil data dengan cepat.

      **Aplikasi Pengurutan:**
      AVL Tree dapat digunakan dalam aplikasi pengurutan di mana data perlu diakses dalam urutan tertentu, menjaga efisiensi operasi pengurutan.

      **Manajemen Memori:**
      AVL Tree digunakan dalam manajemen memori untuk mengalokasikan dan melepaskan blok memori dengan cepat dan efisien.

      **Jaringan Komputer:**
      AVL Tree juga digunakan dalam routing tabel di jaringan komputer untuk memastikan bahwa pencarian jalur jaringan dilakukan dengan cepat dan efisien.
    `,
  },
];

function AVLTreePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMaterials = materials.length;

  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { user: boolean; message: string }[]
  >([
    {
      user: false,
      message: "Halo! Bagaimana saya bisa membantu Anda hari ini?",
    },
  ]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add user's message to the chat
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: true, message: userInput },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:8000/answer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userInput,
          context: `
            AVL Tree adalah jenis Balanced Binary Tree yang pertama kali diperkenalkan oleh Adelson-Velsky dan Landis pada tahun 1962. AVL Tree adalah salah satu varian dari Binary Search Tree (BST) yang memiliki mekanisme otomatis untuk menjaga keseimbangan tinggi dari pohon biner setelah setiap operasi penyisipan dan penghapusan. Keseimbangan ini dicapai dengan memastikan bahwa perbedaan tinggi antara anak kiri dan anak kanan dari setiap node tidak lebih dari satu.

            AVL Tree menggunakan rotasi untuk menjaga keseimbangan pohon. Rotasi ini dapat berupa rotasi tunggal atau ganda, tergantung pada kondisi keseimbangan setelah operasi penyisipan atau penghapusan.

            Operasi pencarian dalam AVL Tree sangat mirip dengan pencarian dalam Binary Search Tree (BST). Proses pencarian dimulai dari root dan terus turun ke anak kiri atau anak kanan berdasarkan nilai yang dicari. Karena AVL Tree selalu seimbang, waktu pencarian dalam AVL Tree selalu berada dalam O(log n).

            Penyisipan dalam AVL Tree dimulai dengan menambahkan node baru ke pohon seperti dalam Binary Search Tree (BST). Setelah node baru ditambahkan, keseimbangan pohon diperiksa. Jika pohon menjadi tidak seimbang, rotasi dilakukan untuk mengembalikan keseimbangan. Kompleksitas waktu penyisipan dalam AVL Tree adalah O(log n).

            Penghapusan dalam AVL Tree melibatkan dua langkah utama: menghapus node dari pohon seperti dalam Binary Search Tree (BST) dan kemudian memulihkan keseimbangan jika pohon menjadi tidak seimbang. Kompleksitas waktu penghapusan dalam AVL Tree adalah O(log n).

            Rotasi adalah operasi kunci dalam AVL Tree yang digunakan untuk memulihkan keseimbangan setelah pohon menjadi tidak seimbang akibat penyisipan atau penghapusan. Ada dua jenis rotasi dasar dalam AVL Tree: rotasi tunggal dan rotasi ganda.

            AVL Tree banyak digunakan dalam aplikasi di mana efisiensi dan konsistensi waktu pencarian sangat penting. Beberapa contoh aplikasi dari AVL Tree termasuk sistem basis data, sistem pencarian informasi, aplikasi pengurutan, manajemen memori, dan jaringan komputer.
          `,
        }),
      });
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

export default withAuth(AVLTreePage, true);
