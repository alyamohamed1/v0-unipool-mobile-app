import { NextResponse } from "next/server";
import { createRide } from "../../../../services/rideService";

export async function POST(req) {
  try {
    const rideData = await req.json();
    const rideId = await createRide(rideData);

    return NextResponse.json({ success: true, rideId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
