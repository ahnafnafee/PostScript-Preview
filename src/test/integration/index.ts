import * as path from "path";
import { glob } from "glob";
import Mocha = require("mocha");

export async function run(): Promise<void> {
    const mocha = new Mocha({
        ui: "tdd",
        color: true,
        timeout: 10_000,
    });

    const testsRoot = __dirname;
    const files = await glob("**/*.test.js", { cwd: testsRoot });

    files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)));

    return new Promise((resolve, reject) => {
        try {
            mocha.run((failures) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve();
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}
