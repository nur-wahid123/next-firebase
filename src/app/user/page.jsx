"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setData(data);
        }
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          document.getElementById("closeAddDataModal").submit();
          getData();
        }
      });
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };
  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
    }).then((res) => {
      router.push("/login");
    });
  };
  return (
    <div>
      <div className="bg-white flex flex-col gap-16 p-10">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          + Add User
        </button>
        <button onClick={handleLogout} className="btn btn-error">
          Logout
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form id="closeAddDataModal" method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <form
              encType="multipart/formdata"
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  type="text"
                  onChange={handleChange}
                  name="name"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  type="password"
                  onChange={handleChange}
                  name="password"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <button className="btn btn-success" type="submit">
                Tambah
              </button>
            </form>
          </div>
        </dialog>
        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Roles</td>
            </tr>
          </thead>
          <tbody>
            {data.map((data, i) => (
              <tr key={i}>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.roles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
