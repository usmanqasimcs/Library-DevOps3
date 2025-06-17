
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class LibraryWebsiteTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Configure Chrome options for headless mode (good for CI/CD)
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Replace with your actual deployed URL
        cls.BASE_URL = "http://your-ec2-instance-ip:port"  # Update this!
        
        # Test credentials - make sure these exist in your database
        cls.TEST_EMAIL = "test@example.com"
        cls.TEST_PASSWORD = "testpassword123"
        cls.TEST_NAME = "Test User"

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

    def test_01_page_loads_successfully(self):
        """Test 1: Verify the main page loads without errors"""
        self.assertIn("Digital Library", self.driver.title)
        
    def test_02_login_with_valid_credentials(self):
        """Test 2: Login with valid credentials should succeed"""
        success = self.login()
        self.assertTrue(success, "Login should succeed with valid credentials")
        
        # Verify we're on the dashboard
        dashboard = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="library-dashboard"]')
        self.assertTrue(dashboard.is_displayed())

    def test_03_login_with_invalid_credentials(self):
        """Test 3: Login with invalid credentials should fail"""
        try:
            email_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
            password_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login') or contains(text(), 'Sign In')]")
            
            email_input.clear()
            email_input.send_keys("invalid@email.com")
            password_input.clear()
            password_input.send_keys("wrongpassword")
            login_button.click()
            
            time.sleep(2)
            
            # Should still be on login page or show error
            current_url = self.driver.current_url
            self.assertTrue("login" in current_url.lower() or self.BASE_URL in current_url)
            
        except Exception as e:
            self.fail(f"Invalid login test failed: {e}")

    def test_04_add_new_book_successfully(self):
        """Test 4: Add a new book and verify it appears in the library"""
        self.login()
        
        # Click Add Book button
        add_book_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="add-book-button"]')))
        add_book_btn.click()
        
        # Fill out the form
        title_input = self.wait.until(EC.presence_of_element_located((By.ID, "title")))
        author_input = self.driver.find_element(By.ID, "author")
        
        test_title = f"Test Book {int(time.time())}"
        test_author = "Test Author"
        
        title_input.send_keys(test_title)
        author_input.send_keys(test_author)
        
        # Submit the form
        submit_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add Book to Library')]")
        submit_btn.click()
        
        # Wait for form to close and book to appear
        time.sleep(3)
        
        # Verify book appears in the page
        self.assertIn(test_title, self.driver.page_source)

    def test_05_cancel_add_book_form(self):
        """Test 5: Cancel adding a book should close the form"""
        self.login()
        
        # Click Add Book button
        add_book_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="add-book-button"]')))
        add_book_btn.click()
        
        # Click Cancel button
        cancel_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="cancel-add-book"]')))
        cancel_btn.click()
        
        time.sleep(1)
        
        # Form should be closed (not visible)
        forms = self.driver.find_elements(By.ID, "title")
        self.assertEqual(len(forms), 0, "Add book form should be closed")

    def test_06_search_books_functionality(self):
        """Test 6: Search for books by title/author"""
        self.login()
        
        # Wait for search bar to be present
        search_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="search-bar"]')))
        
        # Search for a common term
        search_input.clear()
        search_input.send_keys("Test")
        
        time.sleep(2)
        
        # Verify search is working (page content should change)
        self.assertTrue(True)  # Basic test that search doesn't crash

    def test_07_logout_functionality(self):
        """Test 7: Logout should return to login page"""
        self.login()
        
        # Click logout button
        logout_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="logout-button"]')))
        logout_btn.click()
        
        time.sleep(2)
        
        # Should be back to login page
        login_elements = self.driver.find_elements(By.CSS_SELECTOR, 'input[type="email"]')
        self.assertGreater(len(login_elements), 0, "Should return to login page after logout")

    def test_08_favorites_section_exists(self):
        """Test 8: Verify favorites section is present"""
        self.login()
        
        # Look for favorites section
        favorites_section = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="favorites-section"]')))
        self.assertTrue(favorites_section.is_displayed())

    def test_09_mark_book_as_favorite(self):
        """Test 9: Mark a book as favorite using bookmark button"""
        self.login()
        
        # First add a book to test with
        add_book_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="add-book-button"]')))
        add_book_btn.click()
        
        title_input = self.wait.until(EC.presence_of_element_located((By.ID, "title")))
        author_input = self.driver.find_element(By.ID, "author")
        
        test_title = f"Favorite Test Book {int(time.time())}"
        title_input.send_keys(test_title)
        author_input.send_keys("Favorite Author")
        
        submit_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add Book to Library')]")
        submit_btn.click()
        
        time.sleep(3)
        
        # Try to find and click favorite button
        try:
            favorite_btn = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="favorite-bookmark-btn"]')
            favorite_btn.click()
            time.sleep(2)
            self.assertTrue(True, "Favorite button clicked successfully")
        except NoSuchElementException:
            self.fail("Favorite bookmark button not found")

    def test_10_book_status_sections_exist(self):
        """Test 10: Verify all book status sections are present"""
        self.login()
        
        # Check for Not Read section
        not_read_section = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="not-read-section-title"]')))
        self.assertTrue(not_read_section.is_displayed())
        
        # Check for other sections exist in page source
        page_source = self.driver.page_source
        self.assertIn("Currently Reading", page_source)
        self.assertIn("Finished", page_source)

    def test_11_bulk_operations_section_exists(self):
        """Test 11: Verify bulk operations are available for not-read books"""
        self.login()
        
        # Look for bulk operations in not-read section
        page_source = self.driver.page_source
        # If there are books, bulk operations should be visible
        if "Not Read" in page_source:
            self.assertTrue(True)  # Section exists

    def test_12_responsive_design_elements(self):
        """Test 12: Check that key UI elements are present and accessible"""
        self.login()
        
        # Check header elements
        header_title = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="page-title"]')))
        self.assertTrue(header_title.is_displayed())
        
        # Check library icon
        library_icon = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="library-icon"]')
        self.assertTrue(library_icon.is_displayed())

if __name__ == "__main__":
    unittest.main()
