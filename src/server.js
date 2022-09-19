import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

import { authMiddleware } from "./middleware/authMiddleware.js";
import { UserService } from "./services/user-services.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Imagine Shop!");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userService = new UserService();
  const userLogged = await userService.login(email, password);
  if (userLogged) {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign({ user: userLogged }, secretKey, {
      expiresIn: "3600s",
    });
    return res.status(200).json({ token });
  }
  return res.status(400).json({ message: "Email ou senha inválidos" });
});

app.use(authMiddleware);

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
  const id = req.params.id;
  //const valueId = ObjectId(id);
  //if (!valueId) {
  //return res.status(401).json({ message: "Id Inválido" });
  //}
  const userService = new UserService();
  const user = await userService.findByid(id);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const userService = new UserService();
  const user = await userService.findByid(id);
  if (user) {
    await userService.delete(id);
    return res.status(200).json({ message: "Usuário excluído com sucesso." });
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
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
