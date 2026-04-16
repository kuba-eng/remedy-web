import re

text = "Tady je volno:\n\n[Rezervovat termín online](https://remedy.cz/rezervace)"
parts = re.split(r'(\[[^\]]+\]\(https?:\/\/[^\s\)]+\))', text)

for part in parts:
    match = re.search(r'\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)', part)
    if match:
        print("URL IS:", match.group(2))
