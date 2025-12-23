import sys
import json
from playwright.sync_api import sync_playwright

def fetch_linkedin_stats(email, password):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.linkedin.com/login")

        page.fill("#username", email)
        page.fill("#password", password)
        page.click("button[type='submit']")

        page.wait_for_timeout(5000)

        # Default values
        messages = 0
        notifications = 0

        try:
            messages_badge = page.locator("a[href*='messaging'] span.notification-badge__count")
            if messages_badge.count() > 0:
                messages = int(messages_badge.inner_text())
        except:
            pass

        try:
            notifications_badge = page.locator("a[href*='notifications'] span.notification-badge__count")
            if notifications_badge.count() > 0:
                notifications = int(notifications_badge.inner_text())
        except:
            pass

        browser.close()

        return {
            "messages": messages,
            "notifications": notifications
        }

if __name__ == "__main__":
    email = sys.argv[1]
    password = sys.argv[2]

    stats = fetch_linkedin_stats(email, password)
    print(json.dumps(stats))
