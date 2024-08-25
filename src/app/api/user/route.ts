import { addUser, getUser } from "./../../../lib/controller";

export async function GET() {
  const data = await getUser();
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  addUser(body.name, body.password, body.email);
  return Response.json("Berhasil Menambahkan");
}
