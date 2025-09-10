
from datetime import datetime
import re
from typing import Any, Dict, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_date(date: str) -> Optional[datetime]:
    """Validate and parse date string"""
    try:
        # Try common date formats
        for f in ['%Y-%m-%d', '%Y/%m/%d', '%m/%d/%Y', '%d/%m/%Y']:
            try:
                return datetime.strptime(date, f)
            except ValueError:
                continue
        return None
    except:
        return None

def parse_file(file_path: str, filename: str) -> Dict[str, Any]:
    """Parse CSV or Excel file and return parsed data with metadata"""
    try:
        # Determine file type and parse
        if filename.lower().endswith('.csv'):
            df = pd.read_csv(file_path)
        elif filename.lower().endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        else:
            return {"error": "Unsupported file type. Only CSV and Excel files are supported."}
        
        # Convert DataFrame to list of dictionaries
        data = df.to_dict('records')
        
        # Initialize validation results
        total_rows = len(data)
        valid_rows = 0
        invalid_rows = []
        earliest_date = None
        latest_date = None
        
        # Check for email and date columns
        email_column = [col for col in df.columns if 'email' in col.lower()]
        date_column = [col for col in df.columns if any(word in col.lower() for word in ['date', 'created', 'updated', 'time'])]
        
        # Validate each row
        for i, row in enumerate(data):
            row_valid = True
            row_errors = []
            
            # Validate email columns
            for e in email_column:
                if e in row and pd.notna(row[e]):
                    if not validate_email(str(row[e])):
                        row_valid = False
                        row_errors.append(f"Invalid email format in {e}: {row[e]}")
            
            # Validate date columns
            for d in date_column:
                if d in row and pd.notna(row[d]):
                    parsed_date = validate_date(str(row[d]))
                    if parsed_date is None:
                        row_valid = False
                        row_errors.append(f"Invalid date format in {d}: {row[d]}")
                    else:
                        # Initialize earliest and latest dates
                        if earliest_date is None or parsed_date < earliest_date:
                            earliest_date = parsed_date
                        if latest_date is None or parsed_date > latest_date:
                            latest_date = parsed_date
            
            # Update valid and invalid rows count
            if row_valid:
                valid_rows += 1
            else:
                invalid_rows.append({
                    "row_index": i + 1,
                    "errors": row_errors,
                    "data": row
                })
        
        # Create metadata
        metadata = {
            "total_rows": total_rows,
            "valid_rows": valid_rows,
            "invalid_rows": len(invalid_rows),
            "columns": list(df.columns),
            "earliest_date": earliest_date.isoformat() if earliest_date else None,
            "latest_date": latest_date.isoformat() if latest_date else None,
            "file_size": os.path.getsize(file_path),
            "upload_time": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": data,
            "metadata": metadata,
            "invalid_rows": invalid_rows
        }
        
    except Exception as e:
        return {"error": f"Error parsing file: {str(e)}"}
    
# Parsed data stored in memory
file_data = {}  
file_metadata = {}  

@app.route("/api/files", methods=["POST"])
def upload_file():
    """Handles file uploads (CSV, Excel)"""
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    # Check file type
    if not file.filename.lower().endswith(('.csv', '.xlsx', '.xls')):
        return jsonify({"error": "Only CSV and Excel files are supported"}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:        
        # Parse the file
        parse_result = parse_file(file_path, file.filename)
        
        if parse_result.get("success"):
            # Store parsed data in memory
            file_data[file.filename] = parse_result["data"]
            file_metadata[file.filename] = parse_result["metadata"]
            
            return jsonify({
                "message": f"File '{file.filename}' uploaded and parsed successfully",
                "metadata": parse_result["metadata"],
                "invalid_rows_count": len(parse_result["invalid_rows"])
            }), 200
        else:
            # Remove the file if parsing failed
            os.remove(file_path)
            return jsonify(parse_result), 400
            
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

@app.route("/api/files", methods=["GET"])
def list_files():
    """Returns a list of uploaded files with basic metadata"""
    files = []
    for filename in os.listdir(UPLOAD_FOLDER):
        if filename.lower().endswith(('.csv', '.xlsx', '.xls')):
            file_info = {
                "filename": filename,
                "uploaded": filename in file_metadata
            }
            if filename in file_metadata:
                file_info["metadata"] = file_metadata[filename]
            files.append(file_info)
    
    return jsonify({"files": files}), 200

@app.route("/api/files/<filename>/metadata", methods=["GET"])
def get_file_metadata(filename: str):
    """Get metadata for a specific file"""
    if filename not in file_metadata:
        return jsonify({"error": "File not found or not parsed"}), 404
    
    return jsonify(file_metadata[filename]), 200

@app.route("/api/files/<filename>/data", methods=["GET"])
def get_file_data(filename: str):
    """Get data rows for a specific file with pagination"""
    if filename not in file_data:
        return jsonify({"error": "File not found or not parsed"}), 404
    
    # Get pagination parameters
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    
    # Validate parameters
    if limit < 1 or limit > 1000:
        limit = 50
    if offset < 0:
        offset = 0
    
    data = file_data[filename]
    total_rows = len(data)
    
    # Apply pagination
    paginated_data = data[offset:offset + limit]
    
    return jsonify({
        "data": paginated_data,
        "pagination": {
            "total_rows": total_rows,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total_rows
        }
    }), 200

@app.route("/api/files/<filename>", methods=["DELETE"])
def delete_file(filename: str):
    """Delete a file and its parsed data"""
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        # Remove file from disk
        os.remove(file_path)
        
        # Remove from memory storage
        if filename in file_data:
            del file_data[filename]
        if filename in file_metadata:
            del file_metadata[filename]
        
        return jsonify({"message": f"File '{filename}' deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error deleting file: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
