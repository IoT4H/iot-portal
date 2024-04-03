import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Params }) {

    // Given an incoming request...
    const newHeaders = new Headers()
// Add a new header
    newHeaders.set('Content-Type', 'application/json')

    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    return NextResponse.json({ StrapiURL: url }, { status: 200,headers:  newHeaders }, )
}
