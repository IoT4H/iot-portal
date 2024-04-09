import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request, context: { params: Params }) {

    // Given an incoming request...
    const newHeaders = new Headers()
// Add a new header
    newHeaders.set('Content-Type', 'application/json')

    const url = process.env.FRONTEND_STRAPI_API_URL;
    const serverUrl = process.env.SERVER_STRAPI_API_URL || process.env.FRONTEND_STRAPI_API_URL;

    return NextResponse.json({ StrapiURL: url, serverStrapiUrl: serverUrl }, { status: 200,headers:  newHeaders }, )
}
