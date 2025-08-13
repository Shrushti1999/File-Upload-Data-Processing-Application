
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

@app.route("/api/files", methods=["POST"])
def upload_file():
    """Handles file uploads (CSV, Excel, or any file)"""
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({"message": f"File '{file.filename}' uploaded successfully"}), 200

@app.route("/api/files", methods=["GET"])
def list_files():
    """Returns a list of files in the upload folder"""
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify({"files": files}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
