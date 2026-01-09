from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get_driver():
    options = Options()
    # options.add_argument("--headless=new")  # enable later
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")

    # 🔥 Selenium Manager handles driver automatically
    driver = webdriver.Chrome(options=options)
    return driver
