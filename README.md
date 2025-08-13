# 🥷 CopilotRE
Free API client for Github Copilot.

> [!TIP]
> You can checkout the `./examples` folder to see how to use this module in your project.

### 👨🏻‍💻 Command Line Usage
Make sure you have your cookie copied.
```bash
git clone https://github.com/rohitaryal/copilot-RE
cd copilot-RE
[npm|bun] run cli
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

- GPT 3.5 Turbo - gpt-3.5-turbo
- GPT 3.5 Turbo - gpt-3.5-turbo-0613
- GPT-4o mini - gpt-4o-mini
- GPT-4o mini - gpt-4o-mini-2024-07-18
- GPT 4 - gpt-4
- GPT 4 - gpt-4-0613
- GPT-4o - gpt-4o
- GPT-4o - gpt-4o-2024-05-13
- GPT-4o - gpt-4-o-preview
- GPT-4o - gpt-4o-2024-08-06
- Embedding V2 Ada - text-embedding-ada-002
- Embedding V3 small - text-embedding-3-small
- Embedding V3 small (Inference) - text-embedding-3-small-inference
- o1 (Preview) - o1
- o1 (Preview) - o1-2024-12-17
- o3-mini (Preview) - o3-mini
- o3-mini (Preview) - o3-mini-2025-01-31
- o3-mini (Preview) - o3-mini-paygo
- Claude 3.5 Sonnet (Preview) - claude-3.5-sonnet
- Claude 3.7 Sonnet (Preview) - claude-3.7-sonnet
- Claude 3.7 Sonnet Thinking (Preview) - claude-3.7-sonnet-thought
- Gemini 2.0 Flash (Preview) - gemini-2.0-flash-001

> [!TIP]
> You can view all supported models with their models using `./examples/2_list_models.ts`

---
> [!WARNING]  
> This project is in no way affiliated with github, and usage of this program should be limited to research and education.