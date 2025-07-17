import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let browser;
  try {
    const formData = await req.json();
    console.log("Received form data for PDF generation");

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const previewUrl = `${baseUrl}/preview-itinerary`;
    console.log("Preview URL:", previewUrl);

    // Configure browser launch options based on environment
    const isDevelopment = process.env.NODE_ENV === "development";

    const browserOptions = isDevelopment
      ? {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--allow-running-insecure-content",
            "--disable-extensions",
            "--no-first-run",
            "--disable-default-apps",
          ],
          timeout: 60000,
        }
      : {
          args: [
            ...chromium.args,
            "--hide-scrollbars",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--allow-running-insecure-content",
          ],
          executablePath: await chromium.executablePath(),
          headless: true,
        };

    console.log(
      "Launching browser with options:",
      isDevelopment ? "development" : "production"
    );
    browser = await puppeteer.launch(browserOptions);
    console.log("Browser launched successfully");

    const page = await browser.newPage();
    console.log("New page created");

    await page.setViewport({ width: 1200, height: 800 });

    // Emulate print media type for better CSS rendering
    await page.emulateMediaType("print");

    // Enable request interception to monitor resource loading
    await page.setRequestInterception(true);

    let pendingRequests = new Set();

    page.on("request", (request) => {
      pendingRequests.add(request.url());
      request.continue();
    });

    page.on("response", (response) => {
      pendingRequests.delete(response.url());
    });

    // Add console event listener to debug page issues
    page.on("console", (msg) => {
      console.log("PAGE LOG:", msg.text());
    });

    page.on("pageerror", (error) => {
      console.log("PAGE ERROR:", error.message);
    });

    console.log("Navigating to preview URL...");
    await page.goto(previewUrl, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 45000,
    });
    console.log("Page loaded successfully");

    console.log("Injecting form data...");
    await page.evaluate((data) => {
      console.log("Injecting data into page:", data);
      (window as any).ITINERARY_DATA = data;
      window.dispatchEvent(
        new CustomEvent("itineraryDataReady", { detail: data })
      );
      console.log("Data injection complete");
    }, formData);
    console.log("Form data injected");

    // Wait a moment for React to process the data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Waiting for itinerary content...");
    try {
      await page.waitForSelector('[data-testid="itinerary-content"]', {
        timeout: 20000,
      });
      console.log("Itinerary content found");
    } catch (selectorError) {
      console.log("Primary selector not found, trying fallbacks...");

      // Check if we're stuck in loading state
      const isLoading = await page.$('[data-testid="loading-state"]');
      if (isLoading) {
        console.log("Page is still in loading state, waiting more...");
        // Try injecting data again
        await page.evaluate((data) => {
          console.log("Re-injecting data:", data);
          (window as any).ITINERARY_DATA = data;
          window.dispatchEvent(
            new CustomEvent("itineraryDataReady", { detail: data })
          );
        }, formData);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Try waiting for content again
        try {
          await page.waitForSelector('[data-testid="itinerary-content"]', {
            timeout: 10000,
          });
          console.log("Itinerary content found after retry");
        } catch (retryError) {
          console.log("Still no content, checking for error state");
        }
      }

      // Try waiting for loading state to disappear
      try {
        await page.waitForSelector('[data-testid="loading-state"]', {
          hidden: true,
          timeout: 5000,
        });
        console.log("Loading state disappeared");
      } catch (loadingError) {
        console.log("Loading state selector also failed");
      }

      // Check if we have an error state
      const hasError = await page.$('[data-testid="error-state"]');
      if (hasError) {
        const errorText = await page.$eval(
          '[data-testid="error-state"]',
          (el) => el.textContent
        );
        console.log("Page is in error state:", errorText);
        throw new Error(`Preview page error: ${errorText}`);
      }

      // Try waiting for any content in the body
      try {
        await page.waitForFunction(
          () =>
            document.body.textContent &&
            document.body.textContent.trim().length > 100,
          { timeout: 5000 }
        );
        console.log("Page has substantial content");
      } catch (contentError) {
        console.log("Content check also failed, proceeding anyway");
      }
    }

    console.log("Waiting for content to stabilize...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Wait for all images to load
    console.log("Waiting for images to load...");
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              })
          )
      );
    });
    console.log("Images loaded");

    // Wait for any remaining network requests
    console.log("Waiting for network requests to complete...");
    let waitCount = 0;
    while (pendingRequests.size > 0 && waitCount < 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitCount++;
    }
    console.log(
      `Network requests completed. Remaining: ${pendingRequests.size}`
    );

    // Additional wait for CSS and font loading
    console.log("Waiting for styles and fonts...");
    await page.evaluate(() => {
      return document.fonts.ready;
    });

    // Final stabilization wait
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Content stabilized");

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: {
        top: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
        right: "0.5in",
      },
      timeout: 60000,
    });
    console.log("PDF generated successfully");

    await browser.close();
    console.log("Browser closed");

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="travel-itinerary.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);

    // Ensure browser is closed even if there's an error
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed after error");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    return NextResponse.json(
      {
        error: "PDF generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
