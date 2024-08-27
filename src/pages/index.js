import { useCallback, useEffect, useState } from "react";
export default function Home() {
  const [users, setUsers] = useState({});
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("Submit");

  const getData = useCallback(async () => {
    const fetchingDataUsersFromDB = await fetch("/api/users");
    const dataUsersFromDB = await fetchingDataUsersFromDB.json();
    setUsers(dataUsersFromDB);
    setIsLoading(false);
  }, []);

  const inputData = useCallback(() => {
    if (!name || !email) {
      alert("Mohon isi data dengan lengkap!");
      return;
    }

    const dataToSend = { name, email };

    const sendingData = async () => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setName("");
      setEmail("");
    };

    sendingData();
  }, [name, email]);

  const deleteData = useCallback(async (id) => {
    const response = await fetch(`/api/users/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    getData();
  }, []);

  const editData = useCallback(async () => {
    await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: name,
        email: email,
      }),
    });
    setName("");
    setEmail("");
    setButtonStatus("Submit");
  }, [id, name, email]);

  useEffect(() => {
    getData();
  }, [getData, inputData, deleteData, editData]);

  if (isLoading) return "Loading...";

  return (
    <main className="h-screen">
      <div className="bg-slate-200 fixed left-0 top-0 h-screen w-[300px] p-5 flex items-center flex-col">
        <div className="font-bold text-2xl mb-5">
          <h1>Insert Data to MySQL</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 *:p-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <button
            className="bg-blue-500 text-white"
            onClick={() => {
              if (buttonStatus === "Submit") {
                inputData();
                return;
              }
              editData();
            }}
          >
            {buttonStatus}
          </button>
        </div>
      </div>
      <div className="ml-[300px] p-5">
        <table className="w-full">
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className={
                    "p-2 text-white mr-2 " +
                    (buttonStatus === "Edit"
                      ? id === user.id
                        ? "pointer-events-none bg-red-300"
                        : "bg-red-500"
                      : "bg-red-500")
                  }
                  onClick={() => {
                    deleteData(user.id);
                  }}
                >
                  Delete
                </button>
                <button
                  className={
                    "p-2 text-white " +
                    (buttonStatus === "Edit"
                      ? id === user.id
                        ? "pointer-events-none bg-green-300"
                        : "bg-green-500"
                      : "bg-green-500")
                  }
                  onClick={() => {
                    setName(user.name);
                    setEmail(user.email);
                    setId(user.id);
                    setButtonStatus("Edit");
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </main>
  );
}
