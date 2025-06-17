
from base_test import BaseTest

class PageLoadTest(BaseTest):
    
    def test_page_loads_successfully(self):
        """Test 1: Verify the main page loads without errors"""
        self.assertIn("Digital Library", self.driver.title)
        print("✓ Page loaded successfully")

if __name__ == "__main__":
    import unittest
    unittest.main()
