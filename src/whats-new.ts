/**
 * Version update notifications for PostScript Preview
 */
import { ExtensionContext, Uri, env, extensions, window } from "vscode";

const extensionId = "ahnafnafee.postscript-preview";

/**
 * Check if this is a major or minor update
 * https://stackoverflow.com/a/66303259/3073272
 */
function isMajorUpdate(
    previousVersion: string,
    currentVersion: string
): boolean {
    // rain-check for malformed string
    if (previousVersion.indexOf(".") === -1) {
        return true;
    }
    //returns int array [1,1,1] i.e. [major,minor,patch]
    const previousVerArr = previousVersion.split(".").map(Number);
    const currentVerArr = currentVersion.split(".").map(Number);

    // For pdftocairo bug fix
    if (
        currentVerArr[1] > previousVerArr[1] ||
        currentVerArr[2] > previousVerArr[2]
    ) {
        return true;
    }
    return false;
}

/**
 * Show "What's New" notification on version update
 */
export async function showWhatsNew(context: ExtensionContext): Promise<void> {
    const previousVersion = context.globalState.get<string>(extensionId);
    const currentVersion =
        extensions.getExtension(extensionId)?.packageJSON.version;

    // store latest version
    context.globalState.update(extensionId, currentVersion);

    if (
        previousVersion === undefined ||
        isMajorUpdate(previousVersion, currentVersion)
    ) {
        // show whats new notification:
        const actions = [{ title: "See Requirements" }];

        const result = await window.showInformationMessage(
            `PostScript Preview v${currentVersion} — READ NEW REQUIREMENTS!`,
            ...actions
        );

        if (result !== null) {
            if (result === actions[0]) {
                await env.openExternal(
                    Uri.parse(
                        "https://github.com/ahnafnafee/PostScript-Preview#windows"
                    )
                );
            }
        }
    }
}
