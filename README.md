# File Upload & Data Processing Application

## 🚀 Project Overview

This is a **full-stack web application** with a Flask backend and Next.js frontend for file processing and data management. The application provides a complete user interface for uploading, processing, and analyzing CSV and Excel files.

**The application allows users to:

1. **Upload CSV or Excel files** through a modern drag-and-drop web interface
2. **View a list of uploaded files** with detailed metadata and validation status
3. **Parse and validate** uploaded CSV/Excel data with email and date validation
4. **Display data** in organized, paginated tables with configurable page sizes
5. **View file metadata** including row counts, date ranges, column information, and file size
6. **Delete files** with confirmation dialogs for safe file management

## 🏗️ Architecture

The application follows a modern client-server architecture:

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Flask with Python, handling file processing and data storage
- **Storage**: In-memory storage with automatic file parsing
- **UI/UX**: Modern responsive design with drag-and-drop upload, pagination, and real-time status updates
- **Testing**: Postman collection for API testing and validation

## 📁 Project Structure

```
File-Upload-Data-Processing-Application/
├── backend/                 # Flask backend application
│   ├── main.py              # Main Flask application with API Endpoints
│   ├── requirements.txt     # Python dependencies
|   ├── generate_examples.py # Script to generate test CSV files
│   ├── examples/            # Sample files for testing
│   ├── uploads/             # File upload directory
├── frontend/                # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   |   ├── page.tsx         # Main application component
│   │   ├── layout.tsx       # Root layout component
│   │   └── globals.css      # Global styles
│   ├── package.json         # Node.js dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── next.config.ts       # Next.js configuration
└── postman/collection       # API testing collection
```

## 🛠️ Prerequisites

Before setting up the application, ensure you have the following installed:

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Git** for version control
- **Postman** for API testing

## 🔧 Backend Setup (Flask)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Python Virtual Environment
```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

### Step 3: Activate Virtual Environment
```bash
# Windows
.\venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate
```

### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will install the following packages:
- **flask** - The web framework for building APIs
- **flask-cors** - For handling cross-origin requests
- **pandas** - Data manipulation and analysis
- **openpyxl** - Excel file processing

### Step 5: Set Environment Variables
```bash
# Windows
set FLASK_APP=main.py

# macOS/Linux
export FLASK_APP=main.py
```

### Step 6: Run Flask Server
```bash
flask run
```

The backend server will start on **http://127.0.0.1:5000/**

### Backend API Endpoints

- `POST /upload` - Upload CSV/Excel files
- `GET /files` - List all uploaded files
- `GET /files/<filename>/metadata` - Get file metadata
- `GET /files/<filename>/data` - Get file data with pagination

## 🎨 Frontend Setup (Next.js)

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

This will install all required packages, including:
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Modern icon library for UI elements

### Step 3: Run Development Server
```bash
npm run dev
```
The frontend application will start on **http://localhost:3000/**

## 🧪 Testing the Application

### 1. Start Both Servers
Ensure both backend and frontend are running in separate terminals.

### 2. Use Postman for Testing
Import the Postman collection from `postman/collection/` directory to test all API endpoints:
- **Upload Files**: `POST /upload` endpoint
- **List Files**: `GET /files` endpoint  
- **Get Metadata**: `GET /files/<filename>/metadata` endpoint
- **Get Data**: `GET /files/<filename>/data` endpoint

### 3. Test with Sample Files
Use the example files from `backend/examples/` directory:
- `well_formed.csv` - Properly formatted CSV
- `messed_up.csv` - CSV with validation issues
- `squirrel_multi_tab.xlsx` - Multi-tab Excel file
- `missing_column.csv` - CSV that has a column with no name

### 4. Verify Results
- Check file upload responses
- Test pagination parameters (limit, offset)
- Verify error handling with malformed files
- Validate metadata extraction

## 📊 Features

### Current Implementation
- ✅ File upload (CSV/Excel)
- ✅ File listing and management
- ✅ Data parsing and validation
- ✅ Metadata extraction
- ✅ Paginated data display
- ✅ Error handling and validation
- ✅ Postman collection for API testing

### Data Processing Capabilities
- **CSV Support**: Comma, semicolon, and tab-separated values
- **Excel Support**: .xlsx and .xls files with multi-tab support
- **Validation**: Email format, date format, and data type checking
- **Metadata**: Row counts, date ranges, column information
- **Pagination**: Configurable page sizes for large datasets
- Implement proper database indexing
- Use connection pooling for database connections

## 🚀 Future Improvements

- [ ] **Frontend Implementation**: Build React/Next.js UI for file management
- [ ] **Database Integration**: Replace in-memory storage with PostgreSQL/MySQL
- [ ] **User Authentication**: JWT-based authentication system
- [ ] **File Versioning**: Track file changes and maintain history
- [ ] **Real-time Updates**: WebSocket integration for live data updates
- [ ] **Advanced Search**: Full-text search across file contents

## 🐛 Troubleshooting

### Common Issues

**Backend Issues:**
- **Port already in use**: Change port with `flask run --port 5001`
- **Virtual environment not activated**: Ensure `(venv)` appears in terminal
- **Missing dependencies**: Reinstall with `pip install -r requirements.txt`

**Frontend Issues:**
- **Port 3000 occupied**: Next.js will automatically use the next available port
- **Build errors**: Clear cache with `npm run build -- --no-cache`
- **TypeScript errors**: Check `tsconfig.json` and run `npm run lint`

### Performance Tips
- Use smaller file sizes for testing (< 10MB)
- Enable gzip compression in production
- Implement proper database indexing
- Use connection pooling for database connections
