#!/usr/bin/env python3
"""
Script to generate some CSV files with tricky data for testing.
Usage:
    python generate_test_csvs.py
It will create three CSV files in the current directory:
    - well_formed.csv
    - missing_column.csv
    - messed_up.csv
"""

import csv

def generate_well_formed(filename):
    """
    Generates a CSV with valid rows for name, email, created_at
    """
    rows = [
        ["name", "email", "created_at"],
        ["Alice", "alice@example.com", "2023-01-01"],
        ["Bob", "bob@example.com", "2023-02-15"],
        ["Charlie", "charlie@example.com", "2023-03-10"]
    ]
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

def generate_messed_up(filename):
    """
    Generates a CSV with tricky data:
    - Invalid email formats
    - Malformed dates
    - Extra columns
    """
    rows = [
        ["name", "email", "created_at", "extra_column"],
        ["Frank", "frank(at)example.com", "2023-13-40", "foo"],  # Invalid email + invalid date
        ["Grace", "grace@example.com", "2023-06-20", "bar"],
        ["Heidi", "not-an-email", "not-a-date", "baz"],
    ]
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

if __name__ == "__main__":
    generate_well_formed("well_formed.csv")
    generate_messed_up("messed_up.csv")
    print("Test CSV files generated: well_formed.csv, messed_up.csv")
