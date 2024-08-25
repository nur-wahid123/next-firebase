import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./dbConfig";
import bcrypt from "bcryptjs";

const user = collection(db, "users");

export async function addUser(firstName, lastName, password, email) {
  const salt = bcrypt.genSaltSync(10); // You can adjust the salt rounds as needed
  const hashedPassword = bcrypt.hashSync(password, salt);
  await setDoc(doc(user), {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roles: "user",
    rememberToken: "",
  });
}

export async function getUser() {
  const userCollection = collection(db, "users");
  const userSnap = await getDocs(userCollection);
  let data = [];
  userSnap.forEach((uss) => {
    const user = uss.data();
    user.id = uss.id;
    user.name = user.firstName + " " + user.lastName;
    data.push(user);
  });
  return data;
}
export async function getUserIdByEmail(email) {
  const user = collection(db, "users");
  const q = query(user, where("email", "==", "fajar@email.com"), limit(1));
  const data = await getDocs(q);

  let myUser = [];
  data.forEach((doc) => {
    myUser.push(doc.id);
  });
  return myUser[0];
}
