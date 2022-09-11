import "dotenv/config";
import express from "express";

import { UserService } from "./services/user-services.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Imagine Shop!");
});

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const userService = new UserService();
  await userService.create(user);

  return res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const userService = new UserService();
  const user = await userService.findAll();
  return res.status(200).json(user);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params;
  const userService = new UserService();
  const user = await userService.findByid(id);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params;
  const userService = new UserService();
  const user = await userService.findByid(id);
  if (user) {
    await userService.delete(id);
    return res.status(200).json({ message: "Usuário excluído com sucesso." });
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.put("/users/:id", async (req, res) => {
  const id = req.params;
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const userService = new UserService();
  const findUser = await userService.findByid(id);
  if (findUser) {
    await userService.update(id, user);
    return res.status(200).json({ message: "Usuário atualizado com sucesso." });
  }
  return res.status(404).json({ message: "Usuário não encontrado." });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});