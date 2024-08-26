from transformers import pipeline, BertTokenizerFast, AlbertForQuestionAnswering

# Load the fine-tuned model and tokenizer
tokenizer = BertTokenizerFast.from_pretrained('Wikidepia/indobert-lite-squad')
model = AlbertForQuestionAnswering.from_pretrained('Wikidepia/indobert-lite-squad')

# Create the QA pipeline
qa_pipeline = pipeline(
    "question-answering",
    model=model,
    tokenizer=tokenizer
)

# Predefined context from the dataset
context = """
Hash table adalah struktur data yang digunakan untuk menyimpan pasangan kunci-nilai, di mana setiap kunci unik dipetakan ke dalam sebuah nilai dengan menggunakan fungsi hash. Fungsi hash mengambil kunci dan mengonversinya menjadi indeks dalam array untuk menyimpan nilai. Dengan cara ini, operasi pencarian, penyisipan, dan penghapusan data dapat dilakukan dengan waktu yang sangat cepat, biasanya O(1), dalam kondisi ideal.

Namun, hash table juga memiliki beberapa tantangan. Salah satu masalah utama adalah tabrakan (collision), yang terjadi ketika dua kunci yang berbeda di-hash menjadi indeks yang sama dalam array. Ada beberapa metode untuk menangani tabrakan ini. Metode pertama adalah chaining, di mana setiap elemen dalam array menyimpan sebuah linked list atau struktur data lain yang menyimpan semua pasangan kunci-nilai yang memiliki indeks hash yang sama. Metode kedua adalah open addressing, di mana jika terjadi tabrakan, elemen akan ditempatkan di slot berikutnya yang tersedia dalam array.

Fungsi hash yang baik harus mendistribusikan kunci-kunci secara merata di seluruh array untuk mengurangi kemungkinan tabrakan. Fungsi hash yang buruk, di sisi lain, dapat menyebabkan banyak tabrakan dan menurunkan efisiensi struktur data tersebut.

Salah satu keuntungan utama dari hash table adalah kemampuannya untuk melakukan operasi dengan kompleksitas waktu yang mendekati O(1) dalam kondisi ideal. Ini membuat hash table sangat efisien untuk aplikasi di mana pencarian data cepat sangat penting. Namun, hash table juga memiliki kelemahan, seperti ketika fungsi hash tidak merata atau ketika ukuran tabel tidak diatur dengan baik.

Dalam implementasi nyata, hash table sering digunakan dalam berbagai aplikasi seperti caching, penyimpanan database, dan implementasi struktur data lainnya. Misalnya, dalam sistem basis data, hash table dapat digunakan untuk indeks yang memungkinkan pencarian data yang cepat. Dalam sistem caching, hash table dapat digunakan untuk menyimpan hasil komputasi atau data yang sering diakses, sehingga dapat mengurangi waktu akses.

Penting untuk memilih fungsi hash yang sesuai dan mengatur ukuran tabel dengan baik untuk memaksimalkan kinerja hash table. Beberapa teknik lanjutan, seperti pengembangan fungsi hash yang lebih baik atau penggunaan teknik rehashing, juga dapat digunakan untuk meningkatkan kinerja hash table dalam aplikasi tertentu.
"""

print("Chatbot telah siap. Silakan ajukan pertanyaan yang berkaitan dengan konteks yang diberikan.")

while True:
    question = input("Anda: ")
    
    # Handle exit condition
    if question.lower() in ["exit", "quit", "keluar"]:
        print("Chatbot: Terima kasih! Sampai jumpa lagi.")
        break
    
    # Use the model to predict the answer
    result = qa_pipeline({
        'context': context,
        'question': question
    })
    
    # Print the answer
    print("Chatbot:", result['answer'])
