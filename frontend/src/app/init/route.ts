import { getUrls } from "@iot-portal/frontend/lib/urls";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request, context: { params: Params }) {

    // Given an incoming request...
    const newHeaders = new Headers()
// Add a new header
    newHeaders.set('Content-Type', 'application/json')

    console.log("send init parameter ", getUrls())

    return NextResponse.json(getUrls(), { status: 200, headers: newHeaders } )
}
