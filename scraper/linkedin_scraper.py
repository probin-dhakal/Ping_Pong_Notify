import sys
import json
import time
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

from utils.driver import get_driver


def fetch_linkedin_stats(email, password):
    driver = get_driver()

    driver.get("https://www.linkedin.com/login")
    time.sleep(2)

    # Login
    driver.find_element(By.ID, "username").send_keys(email)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    time.sleep(6)  # wait for home page

    messages = 0
    notifications = 0

    # Messages badge
    try:
        messages_badge = driver.find_element(
            By.XPATH,
            "//a[contains(@href,'messaging')]//span[contains(@class,'notification-badge__count')]"
        )
        messages = int(messages_badge.text.strip())
    except NoSuchElementException:
        pass

    # Notifications badge
    try:
        notifications_badge = driver.find_element(
            By.XPATH,
            "//a[contains(@href,'notifications')]//span[contains(@class,'notification-badge__count')]"
        )
        notifications = int(notifications_badge.text.strip())
    except NoSuchElementException:
        pass

    driver.quit()

    return {
        "messages": messages,
        "notifications": notifications
    }


if __name__ == "__main__":
    email = sys.argv[1]
    password = sys.argv[2]

    stats = fetch_linkedin_stats(email, password)
    print(json.dumps(stats))
