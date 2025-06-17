
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class ResponsiveDesignTest(BaseTest):
    
    def test_responsive_design_elements(self):
        """Test 10: Check that key UI elements are present and accessible"""
        self.login()
        
        # Check header elements
        header_title = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="page-title"]')))
        self.assertTrue(header_title.is_displayed())
        
        # Check library icon
        library_icon = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="library-icon"]')
        self.assertTrue(library_icon.is_displayed())
        print("✓ Responsive design elements present and accessible")

if __name__ == "__main__":
    import unittest
    unittest.main()
