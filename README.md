> [!IMPORTANT]  
> Please do not use AI for this assessment. While we are strongly in favor of using AI on the job, the goal of this assessment is to evaluate your raw critical thinking and research skills without AI.

# 4-Hour Take-Home Assignment

## Overview

You have a basic **Next.js (frontend)** and **Flask (backend)** application that allows users to:

1. **Upload CSV or Excel files**.  
2. **View a list of uploaded files**.

Your task is to **extend** this application to parse and store uploaded CSV/Excel data, then display that data and basic metadata (e.g., row count, earliest created date) in the frontend UI.

We expect this to be completable in around **4 hours**. The goal is to see how you approach a real-world problem that involves both backend logic (in Python/Flask) and frontend integration (in Next.js); please commit frequently and leave the git history unsquashed so we can see your thought process.

---

## Requirements

1. **File Parsing & Storage**  
   - When a user uploads a CSV/Excel file, parse it on the Flask side.  
   - Store the data in memory or a lightweight database (like SQLite).  
   - Validate time and email columns if present. If any row fails validation, decide whether to skip it or return a helpful error response. Columns can be arbitrary (we'll test with random CSVs).

2. **Metadata Endpoints**  
   - Provide an API endpoint to **fetch file metadata** (e.g., total rows, earliest `created_at`).  
   - Provide an API endpoint to **fetch rows** for a given file (consider basic pagination via query parameters like `limit` and `offset`).

3. **Frontend UI**  
   - On the Next.js side, allow a user to click on a file name to see:  
     - **File metadata** (row count, earliest date, etc.).  
     - **A table** displaying the file’s data rows.  
   - Handle errors gracefully (e.g., if the file doesn’t exist or can’t be parsed).

4. **Documentation**  
   - Update this README (or a separate document) to include:  
     1. How to run the Flask server.  
     2. How to run the Next.js dev server.
     3. Major changes made and why.  
     4. Steps to test file uploads and view results.
     5. The branch name to test it on.

5. **Time Constraint**  
   - Please limit your work to **no more than 4 hours**. Focus on correctness, clarity, and demonstrating key skills.

### Bonus (Optional)

- **Searching/Filtering**: Add query parameters to search rows by a specific column (e.g., `name`).  
- **Sorting**: Add a way to sort rows by `created_at` (ascending or descending).  
- **Tests**: Include unit or integration tests for either the backend or the frontend.

---

## Project Structure

The starter project is organized like this:

```bash
app/
  ├─ frontend/
  │   └─ app/
  │       └─ page.tsx
  └─ backend/
      └─ main.py
```

There are running instructions in each app.
