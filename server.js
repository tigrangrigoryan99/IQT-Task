const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs").promises; // Используем асинхронные методы работы с файлами
const path = require("path");
const cors = require("cors");
const chokidar = require("chokidar"); // Надежное отслеживание изменений в файле

// Создаем сервер с помощью Express
const app = express();
const server = http.createServer(app);

// Используем CORS middleware для Express
app.use(
  cors({
    origin: "http://localhost:4200", // Разрешаем доступ только с этого источника
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Настройка CORS для socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Путь к файлу db.json
const dbFilePath = path.join(__dirname, "db.json");

// Функция для чтения данных из db.json
const getDataFromJson = async () => {
  try {
    const rawData = await fs.readFile(dbFilePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { tasks: [] }; // Возвращаем пустой массив задач в случае ошибки
  }
};

// Функция для обновления данных в db.json
const updateDbJson = async (newData) => {
  try {
    const tempFilePath = path.join(__dirname, "db_temp.json");
    await fs.writeFile(tempFilePath, JSON.stringify(newData, null, 2), "utf8");
    await fs.rename(tempFilePath, dbFilePath); // Атомарная замена файла
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
};

// Функция для добавления задачи
const addTask = async (newTask) => {
  const data = await getDataFromJson();
  data.tasks.push(newTask);
  await updateDbJson(data);
  io.emit("tasks", data.tasks); // Эмитируем обновленные данные
};

// Функция для удаления задачи
const deleteTask = async (taskId) => {
  const data = await getDataFromJson();
  const updatedTasks = data.tasks.filter((task) => task.id !== taskId);
  await updateDbJson({ tasks: updatedTasks });
  io.emit("tasks", updatedTasks); // Эмитируем обновленные данные
};

// Настройка событий для WebSocket
io.on("connection", (socket) => {
  console.log("Client connected");

  // При подключении отправляем текущие данные
  getDataFromJson().then((data) => socket.emit("tasks", data.tasks));

  // Обработка добавления и удаления задач
  socket.on("addTask", (newTask) => {
    console.log("Adding task:", newTask);
    addTask(newTask);
  });

  socket.on("deleteTask", (taskId) => {
    console.log("Deleting task with ID:", taskId);
    deleteTask(taskId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Отслеживание изменений в db.json с помощью chokidar
chokidar.watch(dbFilePath).on("change", async () => {
  console.log("db.json has been modified");
  const data = await getDataFromJson();
  io.emit("tasks", data.tasks); // Эмитируем актуальные данные
});

// Запуск сервера
server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
