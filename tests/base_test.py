
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class BaseTest(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Configure Chrome options for headless mode
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Updated with your actual deployed URL
        cls.BASE_URL = "http://13.48.190.148:4000"
        
        # Updated test credentials
        cls.TEST_EMAIL = "usmanqasim073@gmail.com"
        cls.TEST_PASSWORD = "usmanqasim073"
        cls.TEST_NAME = "Usman Qasim"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def setUp(self):
        self.driver.get(self.BASE_URL)
        time.sleep(2)

    def login(self):
        """Helper method to login"""
        try:
            email_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
            password_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login') or contains(text(), 'Sign In')]")
            
            email_input.clear()
            email_input.send_keys(self.TEST_EMAIL)
            password_input.clear()
            password_input.send_keys(self.TEST_PASSWORD)
            login_button.click()
            
            # Wait for dashboard to load
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="library-dashboard"]')))
            return True
        except Exception as e:
            print(f"Login failed: {e}")
            return False
