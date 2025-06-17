
#!/bin/bash

# Navigate to tests directory
cd "$(dirname "$0")"

# Install dependencies
pip3 install -r requirements.txt

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

echo "Running Digital Library Tests..."
echo "================================"

# Option 1: Run all tests together using the test runner
python3 run_all_tests.py

echo ""
echo "================================"
echo "Running individual test files..."
echo "================================"

# Option 2: Run each test file individually (as requested by teacher)
for test_file in test_*.py; do
    if [ "$test_file" != "test_*.py" ]; then  # Check if files actually exist
        echo ""
        echo "Running $test_file..."
        echo "------------------------"
        python3 "$test_file" -v
    fi
done

echo ""
echo "All tests completed!"
