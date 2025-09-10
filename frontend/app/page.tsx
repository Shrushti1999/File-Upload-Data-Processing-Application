"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Users,
  Columns,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type FileMetadata = {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  columns: string[];
  earliest_date: string | null;
  latest_date: string | null;
  file_size: number;
  upload_time: string;
};

type FileInfo = {
  filename: string;
  uploaded: boolean;
  metadata?: FileMetadata;
};

type FileData = {
  data: any[];
  pagination: {
    total_rows: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://127.0.0.1:5000/api";

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus("idle");
      setUploadMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage("No file selected");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadMessage("Uploading file...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE}/files`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setUploadMessage(data.message);
        setUploadStatus("success");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchFiles();
      } else {
        setUploadMessage(data.error || "Failed to upload file");
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("An error occurred while uploading the file");
      setUploadStatus("error");
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.files)) {
        setFileList(data.files as FileInfo[]);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Fetch files error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileData = async (filename: string, page: number = 0, limit: number = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/files/${filename}/data?limit=${limit}&offset=${page * limit}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedFileData(data);
        setSelectedFileName(filename);
        setCurrentPage(page);
      } else {
        console.error("Failed to fetch file data");
      }
    } catch (error) {
      console.error("Fetch file data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/files/${filename}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFiles();
        if (selectedFileName === filename) {
          setSelectedFileData(null);
          setSelectedFileName(null);
        }
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete file error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (file: FileInfo) => {
    if (!file.uploaded) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    if (file.metadata?.invalid_rows === 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (file: FileInfo) => {
    if (!file.uploaded) return "Not parsed";
    if (file.metadata?.invalid_rows === 0) return "All valid";
    return `${file.metadata?.invalid_rows} invalid rows`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">File Upload & Data Processing</h1>
          <p className="text-lg text-gray-600">Upload CSV and Excel files for processing and analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">CSV, XLSX, XLS files only</p>
                      {selectedFile && (
                        <p className="text-sm text-gray-900 font-medium mt-2">
                          {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={uploadStatus === "uploading" || !selectedFile}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadStatus === "uploading" ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {uploadStatus === "uploading" ? "Uploading..." : "Upload File"}
                </button>
              </form>

              {uploadMessage && (
                <div className={`mt-4 p-4 rounded-md text-sm ${
                  uploadStatus === "success" 
                    ? "bg-green-50 text-green-700" 
                    : uploadStatus === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          </div>

          {/* Files List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
                  <button
                    onClick={fetchFiles}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="p-6">
                {fileList.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No files uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Upload a CSV or Excel file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fileList.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(file)}
                            <div>
                              <h3 className="font-medium text-gray-900">{file.filename}</h3>
                              <p className="text-sm text-gray-500">{getStatusText(file)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {file.uploaded && (
                              <button
                                onClick={() => fetchFileData(file.filename)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Data
                              </button>
                            )}
                            <button
                              onClick={() => deleteFile(file.filename)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>

                        {file.metadata && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {file.metadata.total_rows} rows
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Columns className="w-4 h-4 mr-1" />
                              {file.metadata.columns.length} columns
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Download className="w-4 h-4 mr-1" />
                              {formatFileSize(file.metadata.file_size)}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(file.metadata.upload_time)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        {selectedFileData && selectedFileName && (
          <div className="mt-8 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Data: {selectedFileName}
                </h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      fetchFileData(selectedFileName, 0, Number(e.target.value));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                    <option value={100}>100 rows</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedFileData.data.length > 0 && Object.keys(selectedFileData.data[0]).map((column, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedFileData.data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cell === null || cell === undefined ? (
                            <span className="text-gray-400 italic">null</span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, selectedFileData.pagination.total_rows)} of {selectedFileData.pagination.total_rows} rows
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchFileData(selectedFileName, currentPage - 1, pageSize)}
                    disabled={currentPage === 0}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage + 1}
                  </span>
                  <button
                    onClick={() => fetchFileData(selectedFileName, currentPage + 1, pageSize)}
                    disabled={!selectedFileData.pagination.has_more}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
