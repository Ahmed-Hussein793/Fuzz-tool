# 🔍 Fuzzer CLI Tool

A simple and lightweight Node.js-based CLI tool for fuzzing URLs using a wordlist.

---

## 🚀 Features

- Fast and concurrent requests using `p-limit`
- Colored output by HTTP status codes (2xx, 3xx, 4xx, 5xx, etc.)
- Customizable number of concurrent threads
- Handles redirects (301/302) and displays the `Location` header
- Supports relative or absolute path to wordlist
- Built-in URL normalization (adds `https://` if missing)

---

## 📦 Installation

you must use node 18.x or higher

```
git clone https://github.com/Ahmed-Hussein793/Fuzz-tool.git
cd Fuzz-tool
npm install
```
## ⚙️ Usage
```
node fuzzing.js -u https://example.com/FUZZ -w wordlist.txt -t 50
```

### Options

| Option           | Description                                     |
|------------------|-------------------------------------------------|
| `-u, --url`      | Target URL to fuzz (use `FUZZ` as placeholder)  |
| `-w, --wordlist` | Path to wordlist file                           |
| `-t, --threads`  | Number of concurrent requests (default: `20`)   |

---

## 🎨 Output Example

📖 Reading wordlist file...
✅ Wordlist loaded successfully.
🚀 Starting fuzzing on https://example.com/[WORD] with 50 threads...
https://example.com/admin 200
https://example.com/login 302 => https://example.com/signin
https://example.com/notfound 404
...
✅ Fuzzing process completed successfully.

## 🧠 Notes

- The placeholder `FUZZ` **must exist** in the URL you provide.
- Redirects are detected but not followed.
- Empty lines in the wordlist are ignored automatically.
- Works with both `http` and `https`, but defaults to `https` if not specified.

---

## 📜 License
MIT

## 🛠️ Author
Ahmed Hussein
