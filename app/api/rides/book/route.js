import { NextResponse } from "next/server";
import { createBooking } from "../../../../services/bookingService";
import { addPassenger } from "../../../../services/rideService";

export async function POST(req) {
  try {
    const { rideId, driverId, riderId } = await req.json();

    // Create booking history entry
    await createBooking({
      rideId,
      driverId,
      riderId,
      status: "confirmed"
    });

    // Add passenger to ride
    await addPassenger(rideId, riderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
