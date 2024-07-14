# 1. Create a new virtual environment
python3 -m venv myproject_env

# 2. Activate the virtual environment
source myproject_env/bin/activate

# 3. Install the required packages in the new environment
pip install litellm==1.41.6 tiktoken==0.7.0

# 4. When you're done working on your project, you can deactivate the virtual environment
# deactivate

# Note: Remember to activate this environment each time you work on your project
# by running: source myproject_env/bin/activate
