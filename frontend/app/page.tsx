// app/frontend/app/page.tsx

"use client";

import React, { useState } from "react";
import { Upload, List } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [fileList, setFileList] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setUploadMessage(data.message);
      } else {
        setUploadMessage(data.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("An error occurred while uploading the file");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/files");
      const data = await response.json();

      if (response.ok) {
        setFileList(data.files);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Fetch files error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">File Upload App</h1>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </button>
            </div>
          </form>

          {uploadMessage && (
            <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-700 text-sm">
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Files</span>
          </div>
        </div>

        {/* List Files Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-center mb-6">
            <button
              onClick={fetchFiles}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <List className="w-4 h-4 mr-2" />
              List Files
            </button>
          </div>

          {fileList.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {fileList.map((filename, index) => (
                <li key={index} className="py-3 flex items-center">
                  <span className="text-sm text-gray-900">{filename}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
