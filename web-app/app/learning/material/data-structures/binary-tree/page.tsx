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
    name: "01 - Binary Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "01",
    shortDesc:
      "Binary Tree adalah struktur data hierarkis dengan maksimal dua anak per node, digunakan untuk mengorganisasi data secara efisien.",
    content: `
      Binary Tree adalah salah satu struktur data yang paling dasar dan penting dalam ilmu komputer. Struktur ini berbentuk hierarkis, di mana setiap elemen atau node dalam tree memiliki maksimal dua anak yang disebut sebagai anak kiri dan anak kanan. Binary Tree digunakan untuk menyimpan dan mengorganisasi data dengan cara yang memungkinkan akses dan modifikasi data dilakukan secara efisien.

      **Pengenalan dan Sifat-Sifat Binary Tree:**
      Dalam Binary Tree, setiap node memiliki sebuah elemen data, sebuah pointer atau referensi ke anak kiri, dan sebuah pointer ke anak kanan. Struktur ini memiliki berbagai jenis yang masing-masing memiliki karakteristik khusus. Misalnya, sebuah full binary tree adalah tree di mana setiap node memiliki dua anak atau tidak memiliki anak sama sekali. Perfect binary tree adalah tree di mana semua node di setiap level, kecuali level terakhir, terisi penuh, dan semua node pada level terakhir ditempatkan sedekat mungkin ke kiri. Complete binary tree adalah tree di mana semua level, kecuali mungkin level terakhir, terisi penuh, dan semua node pada level terakhir ditempatkan sedekat mungkin ke kiri.

      **Operasi pada Binary Tree:**
      Operasi dasar yang dapat dilakukan pada Binary Tree meliputi penyisipan (insertion), penghapusan (deletion), dan traversal. Traversal adalah proses mengunjungi setiap node dalam tree dalam urutan tertentu, yang bisa dilakukan secara inorder (kiri-root-kanan), preorder (root-kiri-kanan), atau postorder (kiri-kanan-root). Binary Tree juga mendukung operasi pencarian (searching) yang memungkinkan kita menemukan elemen tertentu dalam tree dengan cara yang efisien.

      **Aplikasi Binary Tree:**
      Binary Tree digunakan dalam berbagai algoritma penting di ilmu komputer, seperti algoritma pencarian dan pengurutan. Misalnya, Binary Search Tree (BST) dan AVL Tree adalah varian Binary Tree yang digunakan untuk pencarian data yang efisien. Aplikasi lain termasuk dalam pengolahan bahasa alami, kompresi data, dan manajemen memori.
    `,
  },
  {
    name: "02 - Binary Search Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "02",
    shortDesc:
      "Binary Search Tree (BST) adalah Binary Tree yang mengatur data sehingga memungkinkan pencarian, penyisipan, dan penghapusan dilakukan secara efisien.",
    content: `
      Binary Search Tree (BST) adalah jenis Binary Tree di mana setiap node mengikuti aturan bahwa nilai yang ada di anak kiri lebih kecil dari nilai node itu sendiri, dan nilai di anak kanan lebih besar. Struktur ini memberikan cara yang efisien untuk mencari, menyisipkan, dan menghapus data.

      **Operasi pada Binary Search Tree:**
      Dalam BST, pencarian elemen dilakukan dengan membandingkan nilai yang dicari dengan nilai node saat ini. Jika nilai yang dicari lebih kecil, pencarian dilanjutkan ke anak kiri; jika lebih besar, pencarian dilanjutkan ke anak kanan. Operasi penyisipan dan penghapusan dalam BST mengikuti prinsip yang sama, memastikan bahwa tree tetap terstruktur dengan benar setelah operasi dilakukan.

      **Keuntungan dan Kelemahan BST:**
      Keuntungan utama BST adalah kemampuannya untuk melakukan operasi pencarian, penyisipan, dan penghapusan dengan kompleksitas waktu rata-rata O(log n), di mana n adalah jumlah node dalam tree. Namun, jika tree menjadi tidak seimbang (misalnya, semua node berada di satu sisi), kompleksitas waktu bisa meningkat menjadi O(n), yang membuat BST tidak seefisien yang seharusnya.

      **Penerapan BST:**
      BST digunakan dalam berbagai aplikasi seperti kamus digital, basis data, dan sistem file. Struktur ini sangat berguna untuk menyimpan data yang perlu diakses secara cepat dan efisien, serta untuk aplikasi yang membutuhkan operasi pencarian yang sering dilakukan.
    `,
  },
  {
    name: "03 - Binary Tree Traversal",
    avatar: "https://github.com/shadcn.png",
    fallback: "03",
    shortDesc:
      "Binary Tree Traversal adalah proses mengunjungi semua node dalam Binary Tree dalam urutan tertentu, penting untuk operasi tree seperti pencarian dan pengolahan data.",
    content: `
      Binary Tree Traversal adalah proses mengunjungi semua node dalam Binary Tree dalam urutan tertentu. Traversal penting untuk banyak operasi tree seperti pencarian, penyisipan, penghapusan, dan pengolahan data.

      **Jenis-Jenis Binary Tree Traversal:**
      Ada beberapa jenis traversal dalam Binary Tree, termasuk:
      - **Inorder Traversal:** Mengunjungi anak kiri terlebih dahulu, kemudian root, lalu anak kanan. Hasil dari inorder traversal pada Binary Search Tree adalah urutan elemen yang terurut.
      - **Preorder Traversal:** Mengunjungi root terlebih dahulu, kemudian anak kiri, dan akhirnya anak kanan. Preorder traversal sering digunakan untuk menyalin tree.
      - **Postorder Traversal:** Mengunjungi anak kiri terlebih dahulu, kemudian anak kanan, dan akhirnya root. Postorder traversal digunakan untuk menghapus tree.
      - **Level Order Traversal:** Mengunjungi node di setiap level satu per satu dari atas ke bawah. Ini dilakukan menggunakan struktur data seperti queue.

      **Implementasi Binary Tree Traversal:**
      Traversal dapat diimplementasikan menggunakan rekursi atau iterasi. Rekursi sering digunakan karena kesederhanaan dalam kode, tetapi iterasi dengan menggunakan struktur data tambahan seperti stack atau queue juga sering digunakan untuk traversal yang lebih efisien dalam hal penggunaan memori.

      **Aplikasi Binary Tree Traversal:**
      Binary Tree Traversal digunakan dalam berbagai aplikasi seperti pencarian elemen dalam tree, pencetakan elemen dalam urutan tertentu, dan penghitungan nilai dalam tree ekspresi. Teknik traversal yang berbeda juga dapat digunakan dalam situasi yang berbeda tergantung pada kebutuhan aplikasi.
    `,
  },
  {
    name: "04 - Balanced Binary Tree",
    avatar: "https://github.com/shadcn.png",
    fallback: "04",
    shortDesc:
      "Balanced Binary Tree adalah tree di mana perbedaan tinggi antara anak kiri dan kanan minimal, memastikan operasi tree tetap efisien.",
    content: `
      Balanced Binary Tree adalah Binary Tree di mana perbedaan tinggi antara anak kiri dan anak kanan dari setiap node tidak lebih dari satu. Struktur ini penting karena memastikan bahwa operasi pada tree tetap efisien.

      **Jenis-Jenis Balanced Binary Tree:**
      Ada beberapa jenis Balanced Binary Tree, termasuk:
      - **AVL Tree:** Tree yang secara otomatis menjaga keseimbangan setelah setiap operasi penyisipan dan penghapusan.
      - **Red-Black Tree:** Balanced Binary Tree yang menggunakan konsep pewarnaan node untuk menjaga keseimbangan. Ini kurang ketat dalam menjaga keseimbangan dibandingkan AVL Tree, tetapi lebih cepat dalam melakukan operasi penyisipan dan penghapusan.
      - **B-Tree:** Digunakan dalam sistem basis data untuk menyimpan data dalam jumlah besar. Ini adalah Balanced Binary Tree yang memungkinkan lebih dari dua anak pada setiap node.

      **Teknik Menjaga Keseimbangan:**
      Keseimbangan dalam Binary Tree dapat dijaga melalui rotasi, yang dapat berupa rotasi tunggal atau ganda. Teknik ini digunakan untuk mengatur ulang node setelah operasi yang dapat menyebabkan ketidakseimbangan.

      **Keuntungan Balanced Binary Tree:**
      Keuntungan utama dari Balanced Binary Tree adalah kemampuannya untuk menjaga waktu operasi tetap logaritmik, bahkan dalam kasus terburuk. Ini membuatnya sangat cocok untuk aplikasi di mana kinerja dan efisiensi sangat penting, seperti dalam algoritma pencarian dan sistem manajemen basis data.
    `,
  },
  {
    name: "05 - Applications of Binary Trees",
    avatar: "https://github.com/shadcn.png",
    fallback: "05",
    shortDesc:
      "Binary Tree digunakan dalam berbagai aplikasi penting, termasuk algoritma pencarian, pengurutan, dan struktur data kompleks seperti heap dan trie.",
    content: `
      Binary Tree digunakan dalam berbagai aplikasi penting di ilmu komputer, baik dalam algoritma pencarian maupun pengurutan. Struktur ini memberikan cara yang efisien untuk mengorganisir data dan memungkinkan berbagai operasi dilakukan dengan cepat dan mudah.

      **Aplikasi dalam Algoritma Pencarian:**
      Salah satu aplikasi utama Binary Tree adalah dalam algoritma pencarian. Binary Search Tree, misalnya, adalah struktur yang sangat efisien untuk mencari data. AVL Tree dan Red-Black Tree lebih jauh mengoptimalkan operasi pencarian dengan menjaga keseimbangan tree, yang memastikan bahwa waktu pencarian tetap rendah bahkan dengan banyak data.

      **Penggunaan dalam Algoritma Pengurutan:**
      Binary Tree juga digunakan dalam algoritma pengurutan seperti heapsort, di mana sebuah binary heap digunakan untuk mengatur data secara efisien. Heap adalah jenis Balanced Binary Tree yang mengikuti aturan tertentu, yang membuatnya sangat berguna untuk operasi pengurutan.

      **Struktur Data Kompleks:**
      Binary Tree juga merupakan dasar dari struktur data yang lebih kompleks seperti heap dan trie. Heap digunakan dalam banyak algoritma pengurutan dan manajemen prioritas, sedangkan trie digunakan untuk menyimpan dan mencari string dengan cara yang sangat efisien.

      **Studi Kasus dalam Basis Data dan Sistem File:**
      Dalam basis data, Binary Tree digunakan untuk mengindeks data, yang memungkinkan akses cepat ke data yang disimpan. Sistem file juga menggunakan struktur Binary Tree untuk mengorganisir file dan folder, yang memungkinkan navigasi yang cepat dan efisien di antara data yang disimpan.
    `,
  },
];

function BinaryTreePage() {
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
            Binary Tree adalah salah satu struktur data yang paling dasar dan penting dalam ilmu komputer. Struktur ini berbentuk hierarkis, di mana setiap elemen atau node dalam tree memiliki maksimal dua anak yang disebut sebagai anak kiri dan anak kanan. Binary Tree digunakan untuk menyimpan dan mengorganisasi data dengan cara yang memungkinkan akses dan modifikasi data dilakukan secara efisien.

            Binary Search Tree (BST) adalah jenis Binary Tree di mana setiap node mengikuti aturan bahwa nilai yang ada di anak kiri lebih kecil dari nilai node itu sendiri, dan nilai di anak kanan lebih besar. BST memberikan cara yang efisien untuk mencari, menyisipkan, dan menghapus data.

            Binary Tree Traversal adalah proses mengunjungi semua node dalam Binary Tree dalam urutan tertentu. Traversal ini penting untuk banyak operasi tree seperti pencarian, penyisipan, penghapusan, dan pengolahan data. Ada beberapa jenis traversal, termasuk inorder, preorder, postorder, dan level order.

            Balanced Binary Tree adalah Binary Tree di mana perbedaan tinggi antara anak kiri dan anak kanan dari setiap node tidak lebih dari satu. AVL Tree, Red-Black Tree, dan B-Tree adalah contoh dari Balanced Binary Tree, yang memastikan bahwa operasi pada tree tetap efisien dengan menjaga waktu operasi tetap logaritmik.

            Binary Tree digunakan dalam berbagai aplikasi penting di ilmu komputer, seperti algoritma pencarian, pengurutan, dan struktur data kompleks seperti heap dan trie. Dalam basis data, Binary Tree digunakan untuk mengindeks data, yang memungkinkan akses cepat ke data yang disimpan.
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

export default withAuth(BinaryTreePage, true);
