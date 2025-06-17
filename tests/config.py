
"""
Test configuration file
Update these values according to your deployment
"""

# Your EC2 instance details
BASE_URL = "http://your-ec2-ip:port"  # Update this with your actual URL

# Test user credentials (make sure this user exists in your database)
TEST_CREDENTIALS = {
    "email": "test@example.com",
    "password": "testpassword123", 
    "name": "Test User"
}

# Test data for creating books
TEST_BOOKS = [
    {
        "title": "Test Book 1",
        "author": "Test Author 1",
        "year": "2023",
        "rating": "4"
    },
    {
        "title": "Test Book 2", 
        "author": "Test Author 2",
        "year": "2022",
        "rating": "5"
    }
]

# Selenium configuration
SELENIUM_CONFIG = {
    "implicit_wait": 10,
    "explicit_wait": 10,
    "headless": True,  # Set to False if you want to see the browser
    "window_size": "1920,1080"
}
