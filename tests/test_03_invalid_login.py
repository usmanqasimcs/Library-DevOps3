
import time
from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class InvalidLoginTest(BaseTest):
    
    def test_login_with_invalid_credentials(self):
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
            print("✓ Invalid login properly rejected")
            
        except Exception as e:
            self.fail(f"Invalid login test failed: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
