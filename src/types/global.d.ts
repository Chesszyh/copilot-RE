interface RequestOptions {
    method?: "GET" | "POST";
    body?: string | null;
    headers?: Headers;
}

interface Result<T> {
    status: "success" | "error";
    error?: Error;
    body?: T;
}

interface ModelCapabilityLimits {
    max_context_window_tokens?: number;
    max_output_tokens?: number;
    max_prompt_tokens?: number;
    max_inputs?: number;
    vision?: {
        max_prompt_image_size: number;
        max_prompt_images: number;
        supported_media_types: string[];
    };
}

interface ModelSupports {
    streaming?: boolean;
    tool_calls?: boolean;
    parallel_tool_calls?: boolean;
    structured_outputs?: boolean;
    dimensions?: boolean;
}

interface ModelCapabilities {
    family: string;
    limits: ModelCapabilityLimits;
    object: string;
    supports: ModelSupports;
    tokenizer: string;
    type: string;
}

interface ModelData {
    capabilities: ModelCapabilities;
    id: string;
    model_picker_enabled: boolean;
    name: string;
    object: string;
    preview: boolean;
    vendor: string;
    version: string;
    policy?: {
        state: string;
        terms: string;
    };
}

interface ModelsResponse {
    data: ModelData[];
}

/**
 * Individiual thread detail type
 */
interface Thread {
    id: string;
    name: string;
    repoID: number;
    repoOwnerID: number;
    createdAt: string;
    updatedAt: string;
    sharedAt: string | null;
    associatedRepoIDs: number[];
}

/**
 * Represents response type when requested for conversation history
 */
interface ThreadResponse {
    threads: Thread[];
}

interface NewThread {
    thread_id: string;
    thread: Thread;
}

interface RefInfo {
    name: string;
    type: string;
}

interface Language {
    name: string;
    percent: number;
}

interface RepositoryReference {
    type: "repository";
    id: number;
    name: string;
    ownerLogin: string;
    ownerType: string;
    readmePath: string;
    description: string;
    commitOID: string;
    ref: string;
    refInfo: RefInfo;
    visibility: string;
    languages: Language[];
}

interface FileReference {
    type: "file";
    ref: string;
    repoID: number;
    repoName: string;
    repoOwner: string;
    url: string;
    path: string;
    commitOID: string;
    languageName: string;
    languageID: number;
    content: string;
    addLineNums: boolean;
}

type Reference = RepositoryReference | FileReference;

interface SkillExecutionReference {
    type: "file";
    ref: string;
    repoID: number;
    repoName: string;
    repoOwner: string;
    url: string;
    path: string;
    commitOID: string;
    languageName: string;
    languageID: number;
    content: string;
    addLineNums: boolean;
}

interface SkillExecution {
    slug: string;
    status: string;
    arguments: string;
    references: SkillExecutionReference[];
}

interface CopilotAnnotations {
    CodeVulnerability: any | null;
    PublicCodeReference: any | null;
}

interface Message {
    id: string;
    parentMessageID: string;
    intent: string;
    role: string;
    content: string;
    createdAt: string;
    threadID: string;
    references: Reference[];
    skillExecutions: SkillExecution[];
    copilotAnnotations: CopilotAnnotations;
    interrupted: boolean;
    confirmations: any | null;
    clientConfirmations: any | null;
}

interface ThreadContent {
    thread: Thread;
    messages: Message[];
}

interface Extension {
    id: number;
    name: string;
    description: string;
    long_description: string;
    slug: string;
    avatar_url: string;
    url: string;
    editor_context: boolean;
    owner_login: string;
    owner_avatar_url: string;
    integrationUrl: string;
    avatarUrl: string;
}

interface User {
    __typename: "User";
    databaseId: number;
    login: string;
    avatarUrl: string;
    id: string;
}

interface PlanFeatures {
    maximumAssignees: number;
}

interface ViewerIssueCreationPermissions {
    labelable: boolean;
    milestoneable: boolean;
    assignable: boolean;
    triageable: boolean;
    typeable: boolean;
}

interface Node {
    id: string;
    databaseId: number;
    name: string;
    nameWithOwner: string;
    owner: User;
    isPrivate: boolean;
    visibility: "PUBLIC" | "PRIVATE";
    isArchived: boolean;
    isInOrganization: boolean;
    hasIssuesEnabled: boolean;
    slashCommandsEnabled: boolean;
    viewerCanPush: boolean;
    viewerIssueCreationPermissions: ViewerIssueCreationPermissions;
    securityPolicyUrl: null | string;
    contributingFileUrl: null | string;
    codeOfConductFileUrl: null | string;
    shortDescriptionHTML: string;
    planFeatures: PlanFeatures;
}

interface Edge {
    node: Node;
}

interface TopRepositories {
    edges: Edge[];
}

interface Viewer {
    topRepositories: TopRepositories;
    id: string;
}

interface RepositoryDetail {
    id: number;
    name: string;
    ownerLogin: string;
    ownerType: "User";
    readmePath: string | null;
    description: string | null;
    commitOID: string;
    ref: string;
    refInfo: RefInfo;
    visibility: "public";
    languages: Language[];
    customInstructions: string | null;
}

interface RepositoryNode {
    __typename: "Repository";
    id: string;
    databaseId: number;
    name: string;
    nameWithOwner: string;
    owner: User;
    isPrivate: boolean;
    visibility: string;
    isArchived: boolean;
    isInOrganization: boolean;
    hasIssuesEnabled: boolean;
    slashCommandsEnabled: boolean;
    viewerCanPush: boolean;
    viewerIssueCreationPermissions: ViewerIssueCreationPermissions;
    securityPolicyUrl: string | null;
    contributingFileUrl: string | null;
    codeOfConductFileUrl: string | null;
    shortDescriptionHTML: string;
    planFeatures: PlanFeatures;
    __isNode: "Repository";
}

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string;
}

interface SearchData {
    repositoryCount: number;
    pageInfo: PageInfo;
    nodes: RepositoryNode[];
}

interface RepositorySearch {
    data: {
        search: SearchData;
    };
}
