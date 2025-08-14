# 🥷 CopilotRE

> Origin Repo: https://github.com/rohitaryal/copilot-RE

Free API client for Github Copilot.

> [!TIP]
> You can checkout the `./examples` folder to see how to use this module in your project.

### 👨🏻‍💻 Command Line Usage
Make sure you have your cookie copied.
```bash
git clone https://github.com/rohitaryal/copilot-RE
cd copilot-RE
bun add -d @types/node # for code linting
bun run cli
```

## 🍪 How to get cookie?
> [!CAUTION]
> Cookies are critical part of your account. Sharing them will result to bad actors accessing your account. Keep this in mind while you needle with cookies.
- Open [github.com](https://github.com) (You are likely already here)
- Right click on the page and click on `Inspect`
- Now you might see
    - A `Storage` tab on Firefox
    - An `Application` tab on Google-Chrome
- Go to it and click on `Cookies`
- You might a cookie item with `user_session`
- Copy its corresponding value and you have it.

# 🤝 Supported Models:
As of now it supports the following models, please see `model_limitations` for appropriate use.

|    | model_id                         | model_name                     |
|----|----------------------------------|--------------------------------|
|  0 | gpt-4.1                          | GPT-4.1                        |
|  1 | gpt-5-mini                       | GPT-5 mini (Preview)           |
|  2 | gpt-5                            | GPT-5 (Preview)                |
|  3 | gpt-3.5-turbo                    | GPT 3.5 Turbo                  |
|  4 | gpt-3.5-turbo-0613               | GPT 3.5 Turbo                  |
|  5 | gpt-4o-mini                      | GPT-4o mini                    |
|  6 | gpt-4o-mini-2024-07-18           | GPT-4o mini                    |
|  7 | gpt-4                            | GPT 4                          |
|  8 | gpt-4-0613                       | GPT 4                          |
|  9 | gpt-4o                           | GPT-4o                         |
| 10 | gpt-4o-2024-11-20                | GPT-4o                         |
| 11 | gpt-4o-2024-05-13                | GPT-4o                         |
| 12 | gpt-4-o-preview                  | GPT-4o                         |
| 13 | gpt-4o-2024-08-06                | GPT-4o                         |
| 14 | o3-mini                          | o3-mini                        |
| 15 | o3-mini-2025-01-31               | o3-mini                        |
| 16 | o3-mini-paygo                    | o3-mini                        |
| 17 | text-embedding-ada-002           | Embedding V2 Ada               |
| 18 | text-embedding-3-small           | Embedding V3 small             |
| 19 | text-embedding-3-small-inference | Embedding V3 small (Inference) |
| 20 | claude-3.5-sonnet                | Claude Sonnet 3.5              |
| 21 | claude-3.7-sonnet                | Claude Sonnet 3.7              |
| 22 | claude-3.7-sonnet-thought        | Claude Sonnet 3.7 Thinking     |
| 23 | claude-sonnet-4                  | Claude Sonnet 4                |
| 24 | gemini-2.0-flash-001             | Gemini 2.0 Flash               |
| 25 | gemini-2.5-pro                   | Gemini 2.5 Pro (Preview)       |
| 26 | o4-mini                          | o4-mini (Preview)              |
| 27 | o4-mini-2025-04-16               | o4-mini (Preview)              |
| 28 | gpt-4.1-2025-04-14               | GPT-4.1                        |

> [!TIP]
> You can view all supported models with their models using `./examples/2_list_models.ts`

---
> [!WARNING]  
> This project is in no way affiliated with github, and usage of this program should be limited to research and education.