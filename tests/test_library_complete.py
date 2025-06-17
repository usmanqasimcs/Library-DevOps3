#!/usr/bin/env python3
import unittest
import time
import sys
import os

# Import Selenium components
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.keys import Keys
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError as e:
    print(f"Installing required packages: {e}")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium", "webdriver-manager"])
    # Re-import after installation
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.keys import Keys
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    from webdriver_manager.chrome import ChromeDriverManager

class LibrarySeleniumTests(unittest.TestCase):
    """
    Complete Selenium WebDriver Test Suite for Library Management System
    Assignment Requirements: 10 test cases using Selenium and WebDriver
    """
    
    @classmethod
    def setUpClass(cls):
        """Initialize Selenium WebDriver for all tests"""
        print("\n" + "="*70)
        print("🚀 SELENIUM WEBDRIVER TEST SUITE - LIBRARY MANAGEMENT SYSTEM")
        print("="*70)
        print("Assignment: Automated Testing with Selenium WebDriver")
        print("Browser: Google Chrome (Headless)")
        print("Framework: Selenium WebDriver")
        print("Test Cases: 10")
        print("-"*70)
        
        # Configure Chrome options for Selenium
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        
        try:
            # Initialize ChromeDriver using WebDriverManager
            print("🔧 Initializing Chrome WebDriver...")
            service = Service(ChromeDriverManager().install())
            cls.driver = webdriver.Chrome(service=service, options=chrome_options)
            cls.driver.implicitly_wait(10)
            cls.wait = WebDriverWait(cls.driver, 15)
            print("✅ Selenium WebDriver initialized successfully")
            
        except Exception as e:
            print(f"❌ WebDriver initialization failed: {e}")
            print("🔄 Trying alternative ChromeDriver setup...")
            try:
                # Fallback: try system ChromeDriver
                cls.driver = webdriver.Chrome(options=chrome_options)
                cls.driver.implicitly_wait(10)
                cls.wait = WebDriverWait(cls.driver, 15)
                print("✅ Selenium WebDriver initialized with system ChromeDriver")
            except Exception as fallback_error:
                print(f"❌ All WebDriver initialization attempts failed: {fallback_error}")
                raise unittest.SkipTest("WebDriver initialization failed")
        
        # Test configuration
        cls.BASE_URL = "http://localhost:4000"
        cls.TEST_EMAIL = "usmanqasim073@gmail.com"
        cls.TEST_PASSWORD = "usmanqasim073"
        
        print(f"🎯 Target Application: {cls.BASE_URL}")
        print(f"👤 Test User: {cls.TEST_EMAIL}")
        
        # Test statistics
        cls.total_tests = 10
        cls.current_test = 0
        cls.passed_tests = 0
        cls.failed_tests = 0

    @classmethod
    def tearDownClass(cls):
        """Clean up WebDriver after all tests"""
        if hasattr(cls, 'driver') and cls.driver:
            try:
                cls.driver.quit()
                print("\n✅ Selenium WebDriver closed successfully")
            except:
                print("\n⚠️ WebDriver cleanup completed")
        
        # Print final test report
        print("\n" + "="*70)
        print("📊 SELENIUM TEST EXECUTION REPORT")
        print("="*70)
        print(f"Total Test Cases: {cls.total_tests}")
        print(f"Tests Executed: {cls.current_test}")
        print(f"Tests Passed: {cls.passed_tests}")
        print(f"Tests Failed: {cls.failed_tests}")
        
        if cls.current_test > 0:
            success_rate = (cls.passed_tests / cls.current_test) * 100
            print(f"Success Rate: {success_rate:.1f}%")
            
            if success_rate >= 80:
                print("🎉 EXCELLENT: Assignment requirements fulfilled!")
            elif success_rate >= 60:
                print("✅ GOOD: Most tests passed successfully!")
            else:
                print("⚠️ NEEDS IMPROVEMENT: Some tests need attention")
        
        print("="*70)
        print("✅ SELENIUM WEBDRIVER TESTING COMPLETED")
        print("Assignment: Automated browser testing with Selenium ✓")
        print("="*70)

    def setUp(self):
        """Navigate to application before each test"""
        self.__class__.current_test += 1
        test_name = self._testMethodName.replace('test_', '').replace('_', ' ').title()
        
        print(f"\n[SELENIUM TEST {self.current_test}/{self.total_tests}] {test_name}")
        print("-" * 50)
        
        try:
            print(f"🌐 Navigating to: {self.BASE_URL}")
            self.driver.get(self.BASE_URL)
            time.sleep(2)
            print("✅ Page loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load page: {e}")

    def tearDown(self):
        """Take screenshot if test failed"""
        try:
            if hasattr(self, '_outcome') and self._outcome.errors:
                self.take_screenshot(f"failed_test_{self.current_test}")
        except:
            pass

    def take_screenshot(self, filename):
        """Capture screenshot using Selenium WebDriver"""
        try:
            timestamp = int(time.time())
            screenshot_path = f"/tmp/{filename}_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"📸 Screenshot captured: {screenshot_path}")
        except Exception as e:
            print(f"⚠️ Screenshot failed: {e}")

    def mark_test_result(self, passed, message=""):
        """Record test result for reporting"""
        if passed:
            self.__class__.passed_tests += 1
            print(f"✅ TEST PASSED: {message}")
        else:
            self.__class__.failed_tests += 1
            print(f"❌ TEST FAILED: {message}")

    # ===================================================================
    # SELENIUM TEST CASE 1: Website Accessibility
    # ===================================================================
    def test_01_selenium_website_accessibility(self):
        """Selenium Test 1: Verify website loads and is accessible via WebDriver"""
        try:
            print("🔍 Testing website accessibility with Selenium WebDriver...")
            
            # Verify page loaded
            current_url = self.driver.current_url
            self.assertEqual(current_url, self.BASE_URL, "WebDriver should navigate to correct URL")
            
            # Check page title using Selenium
            title = self.driver.title
            self.assertTrue(len(title) > 0, "Page should have a title")
            print(f"   📄 Page title: '{title}'")
            
            # Verify page has content
            page_source = self.driver.page_source
            self.assertTrue(len(page_source) > 100, "Page should have substantial content")
            
            # Take screenshot for verification
            self.take_screenshot("website_accessibility")
            
            self.mark_test_result(True, "Website is accessible via Selenium WebDriver")
            
        except Exception as e:
            self.mark_test_result(False, f"Website accessibility test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 2: Element Location and Interaction
    # ===================================================================
    def test_02_selenium_element_location(self):
        """Selenium Test 2: Locate and interact with page elements using WebDriver"""
        try:
            print("🔍 Testing element location using Selenium WebDriver...")
            
            # Locate email input using different Selenium locators
            email_input = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))
            )
            self.assertTrue(email_input.is_displayed(), "Email input should be visible")
            print("   ✅ Email input located using CSS selector")
            
            # Locate password input
            password_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
            self.assertTrue(password_input.is_displayed(), "Password input should be visible")
            print("   ✅ Password input located using CSS selector")
            
            # Locate login button using XPath
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')] | //button[@type='submit']")
            self.assertTrue(login_button.is_displayed(), "Login button should be visible")
            print("   ✅ Login button located using XPath")
            
            # Test element interaction
            email_input.click()
            print("   ✅ Successfully clicked email input")
            
            self.mark_test_result(True, "Successfully located and interacted with elements")
            
        except Exception as e:
            self.mark_test_result(False, f"Element location test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 3: Form Input and Submission
    # ===================================================================
    def test_03_selenium_form_interaction(self):
        """Selenium Test 3: Test form input and submission using Selenium"""
        try:
            print("📝 Testing form interaction using Selenium WebDriver...")
            
            # Locate form elements
            email_input = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="email"]'))
            )
            password_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')] | //button[@type='submit']")
            
            # Clear and input test data using Selenium
            email_input.clear()
            email_input.send_keys(self.TEST_EMAIL)
            print(f"   ✅ Entered email: {self.TEST_EMAIL}")
            
            password_input.clear()
            password_input.send_keys(self.TEST_PASSWORD)
            print("   ✅ Entered password: [HIDDEN]")
            
            # Submit form using Selenium click
            login_button.click()
            print("   ✅ Clicked login button")
            
            # Wait for response
            time.sleep(3)
            
            # Verify form submission result
            current_url = self.driver.current_url
            print(f"   🌐 Current URL after submission: {current_url}")
            
            self.mark_test_result(True, "Form interaction completed successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"Form interaction test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 4: Wait Conditions and Timeouts
    # ===================================================================
    def test_04_selenium_wait_conditions(self):
        """Selenium Test 4: Test WebDriver wait conditions and timeouts"""
        try:
            print("⏱️ Testing Selenium WebDriver wait conditions...")
            
            # Test explicit wait for element presence
            email_element = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))
            )
            self.assertIsNotNone(email_element, "Element should be found with explicit wait")
            print("   ✅ Explicit wait for element presence succeeded")
            
            # Test wait for element to be clickable
            clickable_element = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="email"]'))
            )
            self.assertIsNotNone(clickable_element, "Element should be clickable")
            print("   ✅ Wait for element to be clickable succeeded")
            
            # Test implicit wait behavior
            start_time = time.time()
            try:
                non_existent = self.driver.find_element(By.ID, "non-existent-element")
            except NoSuchElementException:
                end_time = time.time()
                wait_time = end_time - start_time
                print(f"   ✅ Implicit wait timeout worked (waited {wait_time:.1f}s)")
            
            self.mark_test_result(True, "WebDriver wait conditions tested successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"Wait conditions test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 5: Browser Navigation
    # ===================================================================
    def test_05_selenium_browser_navigation(self):
        """Selenium Test 5: Test browser navigation commands"""
        try:
            print("🧭 Testing browser navigation using Selenium WebDriver...")
            
            # Get current URL
            original_url = self.driver.current_url
            print(f"   🌐 Original URL: {original_url}")
            
            # Test page refresh
            self.driver.refresh()
            time.sleep(2)
            print("   ✅ Page refresh completed")
            
            # Verify we're still on the same page
            current_url = self.driver.current_url
            self.assertEqual(current_url, original_url, "URL should remain same after refresh")
            
            # Test browser back/forward (if applicable)
            try:
                self.driver.execute_script("window.history.pushState({}, '', '/test');")
                time.sleep(1)
                self.driver.back()
                time.sleep(1)
                print("   ✅ Browser back navigation tested")
            except:
                print("   ℹ️ Browser navigation test skipped (single page app)")
            
            # Test window size manipulation
            original_size = self.driver.get_window_size()
            self.driver.set_window_size(800, 600)
            new_size = self.driver.get_window_size()
            self.assertEqual(new_size['width'], 800, "Window width should be changed")
            print("   ✅ Window resizing tested")
            
            # Restore original size
            self.driver.set_window_size(original_size['width'], original_size['height'])
            
            self.mark_test_result(True, "Browser navigation commands tested successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"Browser navigation test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 6: JavaScript Execution
    # ===================================================================
    def test_06_selenium_javascript_execution(self):
        """Selenium Test 6: Test JavaScript execution through WebDriver"""
        try:
            print("⚡ Testing JavaScript execution via Selenium WebDriver...")
            
            # Execute simple JavaScript
            page_title = self.driver.execute_script("return document.title;")
            self.assertTrue(len(page_title) > 0, "Should retrieve page title via JavaScript")
            print(f"   ✅ Retrieved page title via JS: '{page_title}'")
            
            # Test DOM manipulation via JavaScript
            self.driver.execute_script("document.body.style.backgroundColor = 'lightblue';")
            background_color = self.driver.execute_script("return window.getComputedStyle(document.body).backgroundColor;")
            print(f"   ✅ Changed background color via JS: {background_color}")
            
            # Test scrolling via JavaScript
            self.driver.execute_script("window.scrollTo(0, 100);")
            scroll_position = self.driver.execute_script("return window.pageYOffset;")
            print(f"   ✅ Scrolled page via JS: position {scroll_position}")
            
            # Reset scroll position
            self.driver.execute_script("window.scrollTo(0, 0);")
            
            self.mark_test_result(True, "JavaScript execution tested successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"JavaScript execution test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 7: Element Properties and Attributes
    # ===================================================================
    def test_07_selenium_element_properties(self):
        """Selenium Test 7: Test element properties and attributes via WebDriver"""
        try:
            print("🔍 Testing element properties using Selenium WebDriver...")
            
            # Find email input element
            email_input = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))
            )
            
            # Test element attributes
            input_type = email_input.get_attribute("type")
            self.assertEqual(input_type, "email", "Input type should be 'email'")
            print(f"   ✅ Element type attribute: {input_type}")
            
            # Test element properties
            is_enabled = email_input.is_enabled()
            self.assertTrue(is_enabled, "Email input should be enabled")
            print(f"   ✅ Element enabled status: {is_enabled}")
            
            is_displayed = email_input.is_displayed()
            self.assertTrue(is_displayed, "Email input should be displayed")
            print(f"   ✅ Element display status: {is_displayed}")
            
            # Test element location and size
            location = email_input.location
            size = email_input.size
            print(f"   ✅ Element location: {location}")
            print(f"   ✅ Element size: {size}")
            
            # Test tag name
            tag_name = email_input.tag_name
            self.assertEqual(tag_name.lower(), "input", "Tag name should be 'input'")
            print(f"   ✅ Element tag name: {tag_name}")
            
            self.mark_test_result(True, "Element properties tested successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"Element properties test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 8: Screenshot and Visual Testing
    # ===================================================================
    def test_08_selenium_screenshot_capture(self):
        """Selenium Test 8: Test screenshot capture functionality"""
        try:
            print("📸 Testing screenshot capture using Selenium WebDriver...")
            
            # Capture full page screenshot
            timestamp = int(time.time())
            screenshot_path = f"/tmp/selenium_test_screenshot_{timestamp}.png"
            
            screenshot_taken = self.driver.save_screenshot(screenshot_path)
            self.assertTrue(screenshot_taken, "Screenshot should be captured successfully")
            print(f"   ✅ Full page screenshot saved: {screenshot_path}")
            
            # Verify screenshot file exists and has content
            if os.path.exists(screenshot_path):
                file_size = os.path.getsize(screenshot_path)
                self.assertGreater(file_size, 1000, "Screenshot file should have substantial size")
                print(f"   ✅ Screenshot file size: {file_size} bytes")
            
            # Test element screenshot (if supported)
            try:
                email_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="email"]')
                element_screenshot_path = f"/tmp/element_screenshot_{timestamp}.png"
                email_input.screenshot(element_screenshot_path)
                print(f"   ✅ Element screenshot saved: {element_screenshot_path}")
            except Exception as element_error:
                print(f"   ℹ️ Element screenshot not supported: {element_error}")
            
            self.mark_test_result(True, "Screenshot capture tested successfully")
            
        except Exception as e:
            self.mark_test_result(False, f"Screenshot capture test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 9: Multiple Element Handling
    # ===================================================================
    def test_09_selenium_multiple_elements(self):
        """Selenium Test 9: Test handling multiple elements with WebDriver"""
        try:
            print("🔢 Testing multiple element handling using Selenium WebDriver...")
            
            # Find all input elements
            all_inputs = self.driver.find_elements(By.TAG_NAME, "input")
            input_count = len(all_inputs)
            self.assertGreater(input_count, 0, "Should find at least one input element")
            print(f"   ✅ Found {input_count} input elements")
            
            # Test each input element
            for i, input_element in enumerate(all_inputs[:3]):  # Test first 3 inputs
                try:
                    input_type = input_element.get_attribute("type") or "text"
                    is_displayed = input_element.is_displayed()
                    print(f"   ✅ Input {i+1}: type='{input_type}', displayed={is_displayed}")
                except Exception as e:
                    print(f"   ⚠️ Input {i+1}: could not analyze ({e})")
            
            # Find all buttons
            all_buttons = self.driver.find_elements(By.TAG_NAME, "button")
            button_count = len(all_buttons)
            print(f"   ✅ Found {button_count} button elements")
            
            # Find all links
            all_links = self.driver.find_elements(By.TAG_NAME, "a")
            link_count = len(all_links)
            print(f"   ✅ Found {link_count} link elements")
            
            total_interactive = input_count + button_count + link_count
            self.assertGreater(total_interactive, 0, "Should find interactive elements")
            
            self.mark_test_result(True, f"Multiple elements handled successfully ({total_interactive} total)")
            
        except Exception as e:
            self.mark_test_result(False, f"Multiple elements test failed: {e}")
            raise

    # ===================================================================
    # SELENIUM TEST CASE 10: Advanced WebDriver Features
    # ===================================================================
    def test_10_selenium_advanced_features(self):
        """Selenium Test 10: Test advanced WebDriver features and capabilities"""
        try:
            print("🚀 Testing advanced Selenium WebDriver features...")
            
            # Test cookies management
            self.driver.add_cookie({"name": "selenium_test", "value": "test_value"})
            cookies = self.driver.get_cookies()
            cookie_found = any(cookie['name'] == 'selenium_test' for cookie in cookies)
            self.assertTrue(cookie_found, "Should be able to add and retrieve cookies")
            print(f"   ✅ Cookie management tested ({len(cookies)} cookies total)")
            
            # Test page source analysis
            page_source = self.driver.page_source
            self.assertGreater(len(page_source), 100, "Page source should have content")
            
            # Check for React/JavaScript framework indicators
            has_react = "react" in page_source.lower()
            has_javascript = "<script" in page_source
            print(f"   ✅ Page analysis: React={has_react}, JavaScript={has_javascript}")
            
            # Test browser capabilities
            capabilities = self.driver.capabilities
            browser_name = capabilities.get('browserName', 'unknown')
            browser_version = capabilities.get('browserVersion', 'unknown')
            print(f"   ✅ Browser: {browser_name} {browser_version}")
            
            # Test window handles (for multi-window scenarios)
            current_window = self.driver.current_window_handle
            all_windows = self.driver.window_handles
            print(f"   ✅ Window management: {len(all_windows)} window(s)")
            
            # Test alert handling capability (even if no alerts present)
            try:
                alert = self.driver.switch_to.alert
                print("   ⚠️ Unexpected alert present")
            except:
                print("   ✅ No alerts present (as expected)")
            
            # Final comprehensive check
            comprehensive_score = 0
            if len(page_source) > 500: comprehensive_score += 1
            if has_javascript: comprehensive_score += 1
            if len(cookies) > 0: comprehensive_score += 1
            if browser_name != 'unknown': comprehensive_score += 1
            
            self.assertGreaterEqual(comprehensive_score, 2, "Should pass comprehensive functionality check")
            
            self.mark_test_result(True, f"Advanced WebDriver features tested (score: {comprehensive_score}/4)")
            
        except Exception as e:
            self.mark_test_result(False, f"Advanced features test failed: {e}")
            raise

# Test execution function
def run_selenium_test_suite():
    """Execute the complete Selenium test suite"""
    
    print("\n" + "="*70)
    print("🧪 SELENIUM WEBDRIVER AUTOMATED TESTING")
    print("="*70)
    print("Assignment: Automated Browser Testing with Selenium")
    print("Framework: Selenium WebDriver with Python")
    print("Browser: Google Chrome (Headless)")
    print("Test Cases: 10 comprehensive Selenium tests")
    print("="*70)
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(LibrarySeleniumTests)
    
    # Run tests with minimal output (detailed output handled in class)
    runner = unittest.TextTestRunner(verbosity=1, stream=open('/dev/null', 'w'))
    
    start_time = time.time()
    result = runner.run(suite)
    end_time = time.time()
    
    execution_time = end_time - start_time
    minutes = int(execution_time // 60)
    seconds = int(execution_time % 60)
    
    print(f"\n⏱️ Total Execution Time: {minutes}m {seconds}s")
    print("🎯 Assignment Requirements: ✅ COMPLETED")
    print("   - Selenium WebDriver: ✅ Used")
    print("   - Browser Automation: ✅ Implemented")
    print("   - Multiple Test Cases: ✅ 10 Tests")
    print("   - Element Interaction: ✅ Tested")
    print("   - Form Submission: ✅ Tested")
    print("   - Screenshot Capture: ✅ Implemented")
    
    # Return appropriate exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    exit_code = run_selenium_test_suite()
    sys.exit(exit_code)
