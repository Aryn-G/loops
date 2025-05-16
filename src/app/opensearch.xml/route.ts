import { NextRequest } from "next/server";

export const runtime = "edge"; // avoid node cold-starts
export const revalidate = 0; // disable ISR caching

export async function GET(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;

  console.log(baseUrl);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>Loops</ShortName>
  <Description>Search for Upcoming NCSSM Loops</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">${baseUrl}/favicon.ico</Image>
  <Url type="text/html" template="${baseUrl}/loops?q={searchTerms}" />
  <moz:SearchForm>${baseUrl}/loops</moz:SearchForm>
</OpenSearchDescription>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml",
      // "Content-Disposition": "inline",
    },
  });
}
