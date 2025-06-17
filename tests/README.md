
# Digital Library Selenium Test Suite

This test suite contains automated end-to-end tests for the Digital Library website using Selenium WebDriver.

## Test Cases Included

1. **Page Load Test** - Verifies the main page loads successfully
2. **Valid Login Test** - Tests login with correct credentials
3. **Invalid Login Test** - Tests login with incorrect credentials  
4. **Add Book Test** - Tests adding a new book to the library
5. **Cancel Add Book Test** - Tests canceling the add book form
6. **Search Functionality Test** - Tests the search feature
7. **Logout Test** - Tests user logout functionality
8. **Favorites Section Test** - Verifies favorites section exists
9. **Mark as Favorite Test** - Tests the bookmark/favorite functionality
10. **Book Status Sections Test** - Verifies all status sections exist
11. **Bulk Operations Test** - Tests bulk operations availability
12. **Responsive Design Test** - Tests key UI elements are present

## Setup Instructions

### 1. Update Configuration
Edit `tests/config.py` and `tests/test_library.py` to set your actual EC2 URL:
```python
BASE_URL = "http://your-ec2-ip:4000"  # Replace with your actual URL
```

### 2. Create Test User
Make sure you have a test user in your database with these credentials:
- Email: `test@example.com`  
- Password: `testpassword123`

### 3. Install Dependencies (on EC2)
```bash
# Install Python and pip
sudo apt update
sudo apt install python3 python3-pip -y

# Install Selenium
pip3 install selenium

# Install Chrome and ChromeDriver
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable chromium-chromedriver
```

## Running Tests

### Manual Execution
```bash
# Run all tests
python3 tests/test_library.py

# Run with pytest (more detailed output)
python3 -m pytest tests/test_library.py -v

# Run specific test
python3 -m pytest tests/test_library.py::LibraryWebsiteTests::test_01_page_loads_successfully -v
```

### Jenkins Integration
The tests are integrated into the Jenkins pipeline in the `Jenkinsfile`. They will run automatically after the application is deployed.

## Test Features

- **Headless Mode**: Tests run in headless Chrome for CI/CD compatibility
- **Wait Strategies**: Uses explicit waits for reliable element detection
- **Error Handling**: Includes proper exception handling and meaningful error messages
- **Data-driven**: Uses test data from config file
- **Modular**: Helper methods for common operations like login

## Troubleshooting

### Common Issues
1. **ChromeDriver not found**: Make sure ChromeDriver is in PATH or specify full path
2. **Application not ready**: Increase wait time in Jenkins pipeline
3. **Element not found**: Check if data-testid attributes match your actual HTML
4. **Login fails**: Verify test user exists in database with correct credentials

### Debug Mode
To see the browser during test execution, set headless=False:
```python
chrome_options.add_argument("--headless")  # Comment this line
```

## Adding New Tests

To add new test cases:
1. Add a new method starting with `test_` in the `LibraryWebsiteTests` class
2. Use descriptive names like `test_13_new_feature_test`
3. Follow the existing pattern with proper waits and assertions
4. Update this README with the new test description
