### 1. Install Dependencies

```bash
npm install mysql2
```

### 2. Membuat Koneksi ke MySQL

```javascript
// lib/db.js
import mysql from "mysql2/promise";

const connectToDatabase = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "next_mysql",
});

export default connectToDatabase;
```

### 3. Mengambil data melalui API Routes

```javascript
// pages/api/data.js
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await connectToDatabase.query("SELECT * FROM users");
      res.status(200).json(rows);
      console.log(req.method);
    } catch (error) {
      res.status(500).json({ message: "Ada kesalahan dalam mengambil data" });
    }
    return;
  }
}
```

### 4. Menampilkan data

```javascript
// pages/index.js
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

 //Code ................

  useEffect(() => {
    getData();
  }, [getData, inputData, deleteData, editData]);

  if (isLoading) return "Loading...";

  return (
    //Code ................
  );
}
```

```javascript
// pages/api/data.js
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await connectToDatabase.query("SELECT * FROM users");
      res.status(200).json(rows);
      console.log(req.method);
    } catch (error) {
      res.status(500).json({ message: "Ada kesalahan dalam mengambil data" });
    }
    return;
  }

  //Code ................
}
```

### 5. Menambah Data

```javascript
// pages/index.js
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState({});
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("Submit");

 //Code ................

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

  //Code ................

  return (
    //Code ................
  );
}

```

```javascript
// pages/api/data.js
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  //Code ................

  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      await connectToDatabase.query(
        "INSERT INTO users (name, email) VALUES (?,?)",
        [name, email]
      );
      res.status(201).json({ message: "Data berhasil disimpan" });
      console.log(req.method);
    } catch (error) {
      res.status(500).json({ message: "Ada kesalahan dalam menyimpan data" });
    }
    return;
  }

  //Code ................
}
```

### 6. Menghapus Data

```javascript
// pages/index.js
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState({});
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("Submit");

  //Code ................

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

  //Code ................

  return (
    //Code ................
  );
}

```

```javascript
// pages/api/data.js
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  //Code ................

  if (req.method === "DELETE") {
    console.log(req);
    try {
      const { id } = req.body;
      await connectToDatabase.query("DELETE FROM users WHERE id = ?", id);
      res.status(200).json({ message: "Data berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: "Data gagal dihapus" });
    }
  }

  //Code ................
}
```

### 7. Mengubah Data

```javascript
// pages/index.js
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState({});
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("Submit");

  //Code ................

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

  //Code ................

  return (
    //Code ................
  );
}

```

```javascript
// pages/api/data.js
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  //Code ................

  if (req.method === "PUT") {
    try {
      const { id, name, email } = req.body;
      await connectToDatabase.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id]
      );
      res.status(200).json({ message: "Berhasil di ubah" });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengubah" });
    }
  }
}
```
