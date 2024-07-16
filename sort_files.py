import os
import shutil
files = os.listdir()
files.sort()
summary = f"Files in the current directory:\n{', '.join(files)}"
print(summary)
proceed = input("Do you want to create a new directory and move files? (yes/no): ")
if proceed.lower() == "yes":
    # Create a new directory
    new_dir = "sorted_files"
    os.makedirs(new_dir, exist_ok=True)
    
    # Move files to the new directory
    for file in files:
        shutil.move(file, os.path.join(new_dir, file))
    
    print("Files moved successfully.")
else:
    print("No files were moved.")
    with open("log_file.txt", "w") as log_file:
        log_file.write(summary)
        log_file.write("\nOperation: Files moved to a new directory" if proceed.lower() == "yes" else "\nOperation: No files moved")