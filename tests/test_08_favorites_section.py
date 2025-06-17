
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class FavoritesSectionTest(BaseTest):
    
    def test_favorites_section_exists(self):
        """Test 8: Verify favorites section is present"""
        self.login()
        
        # Look for favorites section
        favorites_section = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="favorites-section"]')))
        self.assertTrue(favorites_section.is_displayed())
        print("✓ Favorites section exists and is visible")

if __name__ == "__main__":
    import unittest
    unittest.main()
