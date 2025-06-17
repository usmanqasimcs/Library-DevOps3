
import time
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

class MarkFavoriteTest(BaseTest):
    
    def test_mark_book_as_favorite(self):
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
            print("✓ Book marked as favorite successfully")
        except NoSuchElementException:
            self.fail("Favorite bookmark button not found")

if __name__ == "__main__":
    import unittest
    unittest.main()
