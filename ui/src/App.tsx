import './App.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

function App() {
  
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage("กรุณาเลือกไฟล์ก่อนอัพโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post<{ filePath: string }>("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`อัพโหลดสำเร็จ ${response.data.filePath}`);
    } catch (error: any) {
      setMessage("อัพโหลดล้มเหลว " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <section className='min-h-screen flex justify-center items-center'>
        <div className='w-full max-w-sm rounded-2xl border border-zinc-200 p-3'>
          <form onSubmit={handleUpload} className='space-y-5'>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image">รูปภาพ</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
            </div>
            <div className='flex justify-end'>
              <button type="submit" className='px-5 py-2 text-sm text-black bg-zinc-100 rounded-xl hover:bg-zinc-200 transition'>
                อัพโหลด
              </button>
            </div>
            {message && <p className="text-xs text-center text-zinc-500">{message}</p>}
          </form>
        </div>
      </section>
    </>
  )
}

export default App  