#!/bin/zsh

# Set the input and output file paths
input_file="Downloads/work_flow_error.png"
output_file="Downloads/work_flow_error_compressed.zip"

# Compress the image using ImageMagick (if installed)
if command -v convert &> /dev/null; then
    convert "$input_file" -resize 50% -quality 85 "${input_file%.png}_resized.png"
    input_file="${input_file%.png}_resized.png"
fi

# Create a zip archive
zip -j -9 "$output_file" "$input_file"

# Check the size of the resulting zip file
zip_size=$(du -h "$output_file" | cut -f1)

echo "Compressed file created: $output_file"
echo "Size: $zip_size"

# If the file is still larger than 5MB, suggest further compression
if [ $(du -k "$output_file" | cut -f1) -gt 5120 ]; then
    echo "The file is still larger than 5MB. You may need to reduce the image quality further or use a more aggressive compression method."
fi
