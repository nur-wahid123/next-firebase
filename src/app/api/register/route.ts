import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/dbConfig";
import { addUser } from "./../../../lib/controller";
export async function POST(req: Request) {
  const body = await req.json();
  if (await checkEmailExists(body.email)) {
    return Response.json({
      error: true,
      message:
        "This email address is already associated with an account. Please use a different email or log in if you already have an account.",
    });
  }
  addUser(body.firstName, body.lastName, body.password, body.email);
  return Response.json({
    error: false,
    message: "Your Account has succesfully added",
  });
}

export async function checkEmailExists(email: string) {
  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", email));
  const data = await getDocs(q);
  return !data.empty;
}
