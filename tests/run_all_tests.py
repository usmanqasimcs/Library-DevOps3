
#!/usr/bin/env python3
import unittest
import sys
import os

# Add tests directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import all test classes
from test_01_page_load import PageLoadTest
from test_02_valid_login import ValidLoginTest
from test_03_invalid_login import InvalidLoginTest
from test_04_add_book import AddBookTest
from test_05_cancel_add_book import CancelAddBookTest
from test_06_search_books import SearchBooksTest
from test_07_logout import LogoutTest
from test_08_favorites_section import FavoritesSectionTest
from test_09_mark_favorite import MarkFavoriteTest
from test_10_responsive_design import ResponsiveDesignTest

def create_test_suite():
    """Create a test suite with all test cases"""
    suite = unittest.TestSuite()
    
    # Add tests in order
    suite.addTest(PageLoadTest('test_page_loads_successfully'))
    suite.addTest(ValidLoginTest('test_login_with_valid_credentials'))
    suite.addTest(InvalidLoginTest('test_login_with_invalid_credentials'))
    suite.addTest(AddBookTest('test_add_new_book_successfully'))
    suite.addTest(CancelAddBookTest('test_cancel_add_book_form'))
    suite.addTest(SearchBooksTest('test_search_books_functionality'))
    suite.addTest(LogoutTest('test_logout_functionality'))
    suite.addTest(FavoritesSectionTest('test_favorites_section_exists'))
    suite.addTest(MarkFavoriteTest('test_mark_book_as_favorite'))
    suite.addTest(ResponsiveDesignTest('test_responsive_design_elements'))
    
    return suite

if __name__ == '__main__':
    print("=" * 60)
    print("Running Digital Library Test Suite")
    print("=" * 60)
    
    # Create and run the test suite
    suite = create_test_suite()
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 60)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\nFailures:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\nErrors:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    print("=" * 60)
    
    # Exit with error code if tests failed
    sys.exit(0 if result.wasSuccessful() else 1)
