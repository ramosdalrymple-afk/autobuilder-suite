import { json, type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const url = formData.get("url") as string;

    if (!url) {
      return json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[Resource] Testing URL: ${url}`);

    const response = await fetch(url, {
      timeout: 10000,
    });

    console.log(`[Resource] Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.log(`[Resource] Error response: ${text}`);
      return json(
        {
          error: `HTTP ${response.status}: ${response.statusText}. Response: ${text.substring(0, 200)}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[Resource] Success. Data keys: ${Object.keys(data).join(", ")}`);

    return json({
      success: true,
      data: data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Resource] Error: ${errorMessage}`);
    return json(    
      { error: `Connection failed: ${errorMessage}` },
      { status: 500 }
    );
  }
};
