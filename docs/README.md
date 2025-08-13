# CopilotRE 项目文档

本文档旨在详细介绍 `copilot-RE` 项目的内部结构、核心功能和设计思想，帮助开发者快速理解和上手。

## 1. 项目核心模块和文件

项目代码主要位于 `src` 目录下，其结构和功能如下：

-   **`src/index.ts`**: 项目的核心，定义了 `CopilotRE` 类。该类封装了与 GitHub Copilot API 交互的所有逻辑，是整个库的主入口。
-   **`src/cli.ts`**: 项目的命令行界面 (CLI) 入口。它负责处理用户输入、调用 `CopilotRE` 类的方法，并将结果输出到终端。
-   **`src/utils/constants.ts`**: 存储项目中使用的所有常量，如 API 端点 URL 和请求头信息。
-   **`src/utils/networkUtils.ts`**: 包含一个通用的 `request` 函数，封装了 `fetch` API，用于发起网络请求并处理基本错误。
-   **`src/utils/utils.ts`**: 提供一系列辅助函数，如日志记录 (`logger`)、用户输入 (`prompt`)、Cookie 管理 (`saveCookie`, `getCookie`) 和终端 UI (`createTerminalBorder`)。
-   **`src/types/global.d.ts`**: 定义了项目中使用的所有 TypeScript 类型和接口，如 API 响应、模型信息和线程数据等。

## 2. 主要业务流程和数据流转

项目的核心业务是作为 GitHub Copilot 的非官方 API 客户端。其主要流程如下：

1.  **启动与认证**:
    -   CLI (`cli.ts`) 启动后，首先会检查本地是否存在 `.cookie` 文件。
    -   如果不存在，会提示用户输入 `user_session` Cookie。
    -   获取到 Cookie 后，调用 `CopilotRE.generateAuthToken()` 方法，向 GitHub 获取一个临时的认证 `token`。

2.  **会话管理**:
    -   为了进行对话，CLI 会检查并维护一个 `threadID`。
    -   如果 `threadID` 不存在，会调用 `CopilotRE.createThread()` 创建一个新的会话线程。

3.  **用户交互与内容生成**:
    -   用户在 CLI 中输入提示 (prompt)。
    -   CLI 调用 `CopilotRE.generateContent()` 方法，将用户的 `prompt`、`threadID` 和指定的 `model` 发送到 Copilot API。
    -   API 以流式 (streaming) 响应返回生成的内容。`generateContent` 方法会实时读取流，并将内容块写入 `stdout` 或用户指定的流中。

4.  **功能命令**:
    -   CLI 还支持一些特殊命令（如 `$models`, `$setmodel`, `$reset`），用于查询可用模型、设置当前模型和清除本地配置。

**数据流**:
`用户输入 (CLI)` -> `CopilotRE 实例` -> `networkUtils (fetch)` -> `GitHub Copilot API` -> `networkUtils (response)` -> `CopilotRE 实例` -> `CLI (输出)`

## 3. 关键的类、接口和函数

### `CopilotRE` 类 (src/index.ts)

这是项目的核心类，封装了所有与 API 的交互。

-   `constructor({ githubCookie, authToken })`: 初始化实例，需要提供 GitHub 的 `user_session` Cookie。
-   `async generateAuthToken()`: 获取 API 认证令牌。
-   `async getModels()`: 获取所有可用的 AI 模型列表。
-   `async getAllThreads()`: 获取所有历史会话。
-   `async createThread()`: 创建一个新的会话。
-   `async generateContent(params)`: 核心方法，用于根据用户输入生成内容。它支持流式输出，并可以接受代码仓库作为上下文参考。
-   `async deleteThread(threadID)`: 删除一个会话。

### 关键接口 (src/types/global.d.ts)

-   `interface Result<T>`: 一个通用的响应封装，包含 `status` (`success` 或 `error`)、`body` (数据) 和 `error` (错误信息)。
-   `interface ModelData`: 描述一个 AI 模型的详细信息。
-   `interface Thread`: 描述一个会话线程。
-   `interface RepositoryDetail`: 描述一个代码仓库的详细信息，可作为上下文传入 `generateContent`。

### 关键函数

-   `request(requestURL, options)` (`src/utils/networkUtils.ts`): 项目中所有网络请求的基础。
-   `prompt(question)` (`src/utils/utils.ts`): 从终端获取用户输入。

## 4. 依赖

根据 `package.json`，该项目没有生产环境的第三方依赖 (`dependencies`)。它依赖于 `devDependencies` 中的 `@types/bun` 和 `typescript`，表明它设计为在 [Bun](https://bun.sh/) 运行时环境下运行。

## 5. 入口文件和启动流程

-   **库入口**: `src/index.ts` 是作为库使用时的入口，导出了 `CopilotRE` 类。
-   **CLI 入口**: `src/cli.ts` 是命令行工具的入口。
-   **启动命令**: `package.json` 中的 `scripts` 定义了启动命令：
    ```json
    "scripts": {
        "cli": "bun run src/cli.ts || node src/index.ts"
    }
    ```
    通过 `bun run cli` 或 `npm run cli` 即可启动命令行界面。

## 6. 设计模式和架构思想

-   **面向对象封装**: 项目通过 `CopilotRE` 类将所有 API 功能封装起来，提供了清晰、易于使用的接口。
-   **关注点分离 (Separation of Concerns)**:
    -   网络请求 (`networkUtils.ts`)、常量 (`constants.ts`) 和通用工具 (`utils.ts`) 被清晰地分离到不同的模块中。
    -   类型定义 (`global.d.ts`) 集中管理，提高了代码的可维护性。
-   **异步编程**: 大量使用 `async/await` 来处理网络请求和用户输入，代码逻辑清晰。
-   **流式处理**: `generateContent` 方法通过 `ReadableStream` 处理 API 的流式响应，实现了打字机效果，提升了用户体验。
-   **配置与状态管理**: 通过在本地 `.cookie` 文件中存储 `cookie`、`threadID` 和 `modelId`，实现了简单的状态持久化，方便用户在多次运行之间保持配置。
