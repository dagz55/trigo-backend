# 🗂️ Sort Files Script 🚀

## 📁 Overview

Welcome to the Sort Files Script! This nifty little Python tool helps you organize your files with ease and style. 😎

## 🌟 Features

- 📊 Lists all non-hidden files in the current directory
- 🗃️ Creates a new directory for sorted files
- 🚚 Moves files to the new directory
- 📝 Logs operations (optional)

## 🚀 How to Use

1. 🖥️ Run the script: `python sort_files.py`
2. 👀 Review the list of files
3. ✅ Confirm if you want to move the files
4. 🎉 Enjoy your newly organized directory!

## 📌 Note

- 🙈 Hidden files (starting with '.') are excluded
- 📂 The new directory is named "sorted_files"
- 📜 If you choose not to move files, a log file is created

## 🛠️ Requirements

- Python 3.x
- Standard libraries: os, shutil

Happy organizing! 🎊🗂️🎊
# WFH Automation

This project automates the process of sending Work From Home (WFH) sign-in and sign-out emails based on a predefined work schedule.

## Features

- Customizable work schedule
- Automated sign-in and sign-out emails
- Timezone support
- Easy to enable/disable automation

## Setup

1. Clone the repository
2. Install required packages: `pip install -r requirements.txt`
3. Update the email configuration in `send_daily_email.py`
4. Run the script: `python send_daily_email.py`

## Configuration

You can modify the following variables in `send_daily_email.py`:

- `WORK_DAYS`: List of work days
- `SIGN_IN_TIME`: Daily sign-in time
- `SIGN_OUT_TIME`: Daily sign-out time
- `AUTOMATION_ENABLED`: Set to `True` to enable automation, `False` to disable

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
