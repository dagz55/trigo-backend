import os
import shutil
files = [f for f in os.listdir() if not f.startswith('.')]
files.sort()
summary = f"Non-hidden files in the current directory:\n{', '.join(files)}"
print(summary)
proceed = input("Do you want to create a new directory and move files? (yes/no): ")
if proceed.lower() == "yes":
    # Create a new directory
    new_dir = "sorted_files"
    os.makedirs(new_dir, exist_ok=True)
    
    # Move non-hidden files to the new directory
    moved_files = []
    for file in files:
        if not file.startswith('.'):
            shutil.move(file, os.path.join(new_dir, file))
            moved_files.append(file)
    
    print(f"{len(moved_files)} files moved successfully.")
else:
    print("No files were moved.")
    with open("log_file.txt", "w") as log_file:
        log_file.write(summary)
        log_file.write("\nOperation: Files moved to a new directory" if proceed.lower() == "yes" else "\nOperation: No files moved")
