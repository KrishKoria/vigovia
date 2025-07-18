import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let browser;
  try {
    const formData = await req.json();
    console.log("Received form data for PDF generation");

    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const previewUrl = `${baseUrl}/preview-itinerary`;
    console.log("Preview URL:", previewUrl);

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
            "--force-color-profile=srgb",
            "--enable-print-background",
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
            "--force-color-profile=srgb",
            "--enable-print-background",
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

    const cookies = req.headers.get("cookie");
    if (cookies) {
      await page.setExtraHTTPHeaders({
        Cookie: cookies,
      });
    }

    await page.emulateMediaType("print");

    await page.setRequestInterception(true);

    let pendingRequests = new Set();

    page.on("request", (request) => {
      pendingRequests.add(request.url());
      request.continue();
    });

    page.on("response", (response) => {
      pendingRequests.delete(response.url());
    });

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

    await page.addStyleTag({
      content: `
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .bg-gradient-to-r.from-vigovia-cta.to-vigovia-accent {
          background: linear-gradient(to right, #541C9C, #936FE0) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        [class*="bg-gradient-to-r"][class*="from-vigovia-cta"] {
          background: linear-gradient(to right, #541C9C, #936FE0) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .text-vigovia-light {
          color: #FBF4FF !important;
        }
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        .fixed-footer {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          background: white !important;
          border-top: 1px solid #e5e5e5 !important;
          padding: 16px !important;
          font-size: 12px !important;
          z-index: 1000 !important;
          page-break-inside: avoid !important;
        }
        .pdf-content {
          margin-bottom: 120px !important;
          padding-bottom: 20px !important;
        }
        .regular-footer {
          display: none !important;
        }
      `,
    });
    console.log("Additional CSS injected for PDF rendering");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Waiting for itinerary content...");
    try {
      await page.waitForSelector('[data-testid="itinerary-content"]', {
        timeout: 20000,
      });
      console.log("Itinerary content found");
    } catch (selectorError) {
      console.log("Primary selector not found, trying fallbacks...");

      const isLoading = await page.$('[data-testid="loading-state"]');
      if (isLoading) {
        console.log("Page is still in loading state, waiting more...");
        await page.evaluate((data) => {
          console.log("Re-injecting data:", data);
          (window as any).ITINERARY_DATA = data;
          window.dispatchEvent(
            new CustomEvent("itineraryDataReady", { detail: data })
          );
        }, formData);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          await page.waitForSelector('[data-testid="itinerary-content"]', {
            timeout: 10000,
          });
          console.log("Itinerary content found after retry");
        } catch (retryError) {
          console.log("Still no content, checking for error state");
        }
      }

      try {
        await page.waitForSelector('[data-testid="loading-state"]', {
          hidden: true,
          timeout: 5000,
        });
        console.log("Loading state disappeared");
      } catch (loadingError) {
        console.log("Loading state selector also failed");
      }

      const hasError = await page.$('[data-testid="error-state"]');
      if (hasError) {
        const errorText = await page.$eval(
          '[data-testid="error-state"]',
          (el) => el.textContent
        );
        console.log("Page is in error state:", errorText);
        throw new Error(`Preview page error: ${errorText}`);
      }

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

    console.log("Waiting for network requests to complete...");
    let waitCount = 0;
    while (pendingRequests.size > 0 && waitCount < 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitCount++;
    }
    console.log(
      `Network requests completed. Remaining: ${pendingRequests.size}`
    );

    console.log("Waiting for styles and fonts...");
    await page.evaluate(() => {
      return document.fonts.ready;
    });

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

    const destination =
      formData.destination?.replace(/[^a-zA-Z0-9-_]/g, "-") || "destination";
    const startDate = formData.startDate
      ? new Date(formData.startDate).toISOString().split("T")[0]
      : "";
    const endDate = formData.endDate
      ? new Date(formData.endDate).toISOString().split("T")[0]
      : "";
    const customerName =
      formData.customerName?.replace(/[^a-zA-Z0-9-_]/g, "-") || "customer";
    const numberOfTravellers = formData.numberOfTravellers || 1;

    let filename = `${destination}-itinerary`;
    if (startDate && endDate) {
      filename = `${destination}-${startDate}-to-${endDate}-${numberOfTravellers}pax-${customerName}`;
    } else if (startDate) {
      filename = `${destination}-${startDate}-${numberOfTravellers}pax-${customerName}`;
    } else {
      filename = `${destination}-${numberOfTravellers}pax-${customerName}-itinerary`;
    }
    filename = filename.toLowerCase().replace(/--+/g, "-") + ".pdf";

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);

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
