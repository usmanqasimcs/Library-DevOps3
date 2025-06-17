
import time
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class CancelAddBookTest(BaseTest):
    
    def test_cancel_add_book_form(self):
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
        print("✓ Add book form cancelled successfully")

if __name__ == "__main__":
    import unittest
    unittest.main()
