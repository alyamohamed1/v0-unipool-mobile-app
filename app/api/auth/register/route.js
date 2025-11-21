import { NextResponse } from "next/server";
import { registerUser } from "../../../../services/authService";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const uid = await registerUser(name, email, password);

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
