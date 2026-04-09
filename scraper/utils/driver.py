from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get_driver():
    options = Options()

    # 🧠 Make it look like real user
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--start-maximized")

    # 🚫 Remove automation flag
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = webdriver.Chrome(options=options)

    # 🔥 VERY IMPORTANT (hide selenium)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    return driver