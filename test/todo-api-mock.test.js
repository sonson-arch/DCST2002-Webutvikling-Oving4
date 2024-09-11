import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";
import e from "express";


//npx jest --testPathPattern=todo-api-mock.test.js


axios.defaults.baseURL = "http://localhost:3001";

jest.mock("../task-service");

const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

let webServer;
beforeAll(() => webServer = todoApi.listen(3001));
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        const response = await axios.get("/api/v1/tasks");
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    test("Fetch task (200 OK)", async () => {
        taskService.get = jest.fn(() => Promise.resolve(testData[0]));

        const response = await axios.get("/api/v1/tasks/1");
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData[0]);
    });

    test("Fetch all tasks (500 Internal Server Error)", async () => {
        taskService.getAll = jest.fn(() => Promise.reject(new Error("Server error")));

        expect.assertions(1);
        try {
            await axios.get("/api/v1/tasks");
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });

    test("Fetch task (404 Not Found)", async () => {
        taskService.get = jest.fn(() => Promise.resolve([]));

        expect.assertions(1);
        try {
            await axios.get("/api/v1/tasks/:id");
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });

    test("Fetch task (500 Internal Server error)", async () => {
        taskService.get = jest.fn(() => Promise.reject(new Error("Server error")));

        expect.assertions(1);
        try {
            await axios.get("/api/v1/tasks/1");
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        taskService.create = jest.fn(() => Promise.resolve({}));

        const response = await axios.post("/api/v1/tasks", testData[0]);
        expect(response.status).toEqual(201);
        expect(response.data).toEqual("");
    });

    test("Create new task (400 Bad Request)", async () => {
        taskService.create = jest.fn(() => Promise.reject(new Error("Bad request")));

      expect.assertions(1);
        try {
            await axios.post("/api/v1/tasks", {});
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    test("Create new task (500 Internal Server error)", async () => {
        taskService.create = jest.fn(() => Promise.reject(new Error("Server error")));

       expect.assertions(1);
        try {
            await axios.post("/api/v1/tasks", testData[0]);
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        taskService.delete = jest.fn(() => Promise.resolve({ affectedRows: 1 }));

        const response = await axios.delete("/api/v1/tasks/1");
        expect(response.status).toEqual(200);
    });
});
