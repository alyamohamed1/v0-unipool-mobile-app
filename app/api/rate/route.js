import { NextResponse } from "next/server";
import { rateUser } from "../../../services/ratingService";

export async function POST(req) {
  try {
    const ratingData = await req.json();

    await rateUser(ratingData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
