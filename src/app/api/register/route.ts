import { NextResponse } from "next/server";
import { signupSchema } from "@/schemas/auth.schema";

export async function POST(request: NextResponse): Promise<NextResponse> {
  const body: Record<string, unknown> = await request.json();
  console.log(body);
  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(result.error);
  }

  //Guardar datos en DB

  return NextResponse.json(result.data);
}
