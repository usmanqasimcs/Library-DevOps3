
from base_test import BaseTest

class ValidLoginTest(BaseTest):
    
    def test_login_with_valid_credentials(self):
        """Test 2: Login with valid credentials should succeed"""
        success = self.login()
        self.assertTrue(success, "Login should succeed with valid credentials")
        
        # Verify we're on the dashboard
        dashboard = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="library-dashboard"]')
        self.assertTrue(dashboard.is_displayed())
        print("✓ Valid login successful")

if __name__ == "__main__":
    import unittest
    unittest.main()
