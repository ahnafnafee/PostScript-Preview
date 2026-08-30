/**
 * The test launcher runs under CI's Node.js 24 runtime, while extension source
 * is checked against the Node.js 12 runtime provided by the minimum VS Code
 * version. Declare only the newer global required by the test launcher.
 */
interface TestRunnerFetchResponse {
    readonly ok: boolean;
    readonly status: number;
    arrayBuffer(): Promise<ArrayBuffer>;
}

declare function fetch(input: string): Promise<TestRunnerFetchResponse>;
