import requests
from bs4 import BeautifulSoup

url = "https://www.careeronestop.org/Toolkit/Training/find-scholarships.aspx"
params = {
    "keyword": "engineering",
    "state": "NJ",
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/116.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;"
              "q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    # You might also add:
    # "Referer": "https://www.careeronestop.org/",
    # "Sec-Fetch-Site": "none",
    # "Sec-Fetch-Mode": "navigate",
}

resp = requests.get(url, headers=headers, params=params, timeout=20)
print(resp.status_code)
if resp.status_code == 200:
    soup = BeautifulSoup(resp.text, "html.parser")
    # parse the table or results
    print(soup.title)
else:
    resp.raise_for_status()
