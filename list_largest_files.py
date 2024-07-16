import os
import heapq

def get_file_size(file_path):
    return os.path.getsize(file_path)

def list_largest_files(directory, n=10):
    largest_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_size = get_file_size(file_path)
            if len(largest_files) < n:
                heapq.heappush(largest_files, (file_size, file_path))
            else:
                heapq.heappushpop(largest_files, (file_size, file_path))
    
    return sorted(largest_files, reverse=True)

if __name__ == "__main__":
    cwd = os.getcwd()
    top_10_files = list_largest_files(cwd)
    
    print(f"Top 10 largest files in {cwd}:")
    for size, path in top_10_files:
        print(f"{path}: {size} bytes")
