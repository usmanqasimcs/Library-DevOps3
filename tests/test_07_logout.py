
import time
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class LogoutTest(BaseTest):
    
    def test_logout_functionality(self):
        """Test 7: Logout should return to login page"""
        self.login()
        
        # Click logout button
        logout_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="logout-button"]')))
        logout_btn.click()
        
        time.sleep(2)
        
        # Should be back to login page
        login_elements = self.driver.find_elements(By.CSS_SELECTOR, 'input[type="email"]')
        self.assertGreater(len(login_elements), 0, "Should return to login page after logout")
        print("✓ Logout functionality working")

if __name__ == "__main__":
    import unittest
    unittest.main()
