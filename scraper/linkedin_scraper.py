import sys
import json
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

from utils.driver import get_driver


def fetch_linkedin_stats(email, password):
    driver = get_driver()
    wait = WebDriverWait(driver, 15)

    try:
        # Always go to LOGIN page (force correct URL)
        driver.get("https://www.linkedin.com/login")

        # Wait for login fields (UPDATED SELECTORS)
        email_input = wait.until(
            EC.presence_of_element_located((By.NAME, "session_key"))
        )
        password_input = wait.until(
            EC.presence_of_element_located((By.NAME, "session_password"))
        )

        # Login
        email_input.send_keys(email)
        password_input.send_keys(password)

        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()

        # Wait for homepage (navbar present)
        wait.until(
            EC.presence_of_element_located((By.ID, "global-nav"))
        )

        messages = 0
        notifications = 0

        # Messages badge
        try:
            messages_badge = wait.until(
                EC.presence_of_element_located((
                    By.XPATH,
                    "//a[contains(@href,'messaging')]//span[contains(@class,'notification-badge__count')]"
                ))
            )
            messages = int(messages_badge.text.strip())
        except (NoSuchElementException, TimeoutException):
            pass

        # Notifications badge
        try:
            notifications_badge = wait.until(
                EC.presence_of_element_located((
                    By.XPATH,
                    "//a[contains(@href,'notifications')]//span[contains(@class,'notification-badge__count')]"
                ))
            )
            notifications = int(notifications_badge.text.strip())
        except (NoSuchElementException, TimeoutException):
            pass

        return {
            "messages": messages,
            "notifications": notifications
        }

    finally:
        driver.quit()


if __name__ == "__main__":
    email = sys.argv[1]
    password = sys.argv[2]

    stats = fetch_linkedin_stats(email, password)
    print(json.dumps(stats))