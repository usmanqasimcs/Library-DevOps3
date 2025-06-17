
import time
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class AddBookTest(BaseTest):
    
    def test_add_new_book_successfully(self):
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
        print(f"✓ Book '{test_title}' added successfully")

if __name__ == "__main__":
    import unittest
    unittest.main()
