
#!/bin/bash

# Install dependencies
pip3 install -r tests/requirements.txt

# Install Chrome and ChromeDriver if not present
if ! command -v google-chrome &> /dev/null; then
    echo "Installing Google Chrome..."
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt-get update
    sudo apt-get install -y google-chrome-stable
fi

if ! command -v chromedriver &> /dev/null; then
    echo "Installing ChromeDriver..."
    sudo apt-get install -y chromium-chromedriver
fi

# Run the tests
echo "Running Digital Library Tests..."
python3 -m pytest tests/test_library.py -v --tb=short

# Alternative: Run with unittest
# python3 tests/test_library.py
