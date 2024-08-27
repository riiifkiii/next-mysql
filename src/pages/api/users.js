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
