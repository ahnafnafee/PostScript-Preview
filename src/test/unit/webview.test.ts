import * as assert from "assert";
import { getWebviewContent } from "../../webview";

suite("Webview content", () => {
    test("escapes the filename before rendering it as HTML", () => {
        const html = getWebviewContent(
            'draft <final> & "approved".ps',
            "<svg></svg>"
        );

        assert.ok(
            html.includes(
                "draft &lt;final&gt; &amp; &quot;approved&quot;.ps"
            )
        );
        assert.ok(!html.includes('draft <final> & "approved".ps'));
    });

    test("omits pagination controls for a single-page document", () => {
        const html = getWebviewContent("single-page.ps", "<svg></svg>");

        assert.ok(!html.includes('id="prev"'));
        assert.ok(!html.includes('id="pageNum"'));
        assert.ok(!html.includes('id="next"'));
    });

    test("labels multi-page navigation controls for assistive technology", () => {
        const html = getWebviewContent(
            "multi-page.ps",
            "<svg></svg>",
            2,
            3
        );

        assert.ok(html.includes('aria-label="Previous page"'));
        assert.ok(html.includes('aria-label="Page number"'));
        assert.ok(html.includes('aria-label="Next page"'));
    });
});
