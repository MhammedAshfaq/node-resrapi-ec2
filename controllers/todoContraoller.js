import {
  failureResponse,
  failureResponseWithData,
  successResponse,
  successResponseWithData,
} from "../utilities/errorHandling.js";
import { todoCreateValidator } from "../utilities/inputValidator/todovalidator.js";
import { Messages } from "../utilities/message.js";
import { Todo } from "../models/totdo.js";
import { client } from "../app.js";

export const createTodo = async (req, res) => {
  try {
    const { error } = todoCreateValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return failureResponseWithData(
        res,
        Messages.VALIDATION_ERROR,
        error.details[0].message.replace(/"/g, "")
      );
    }
    const { title, description } = req.body;

    const newTodo = new Todo({
      title: title,
      description: description,
      isChecked: false,
      userId: req.user.id,
    });
    await newTodo.save();
    return successResponse(res, Messages.TODO_CREATED);
  } catch (error) {
    return failureResponse(res, Messages.INTERNAL_SERVER_ERROR);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { isChecked } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { isChecked },
      { new: true } // This returns the updated document
    );

    return successResponse(res, Messages.TODO_UPDATE, updatedTodo);
  } catch (error) {
    return failureResponse(res, Messages.INTERNAL_SERVER_ERROR);
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    return successResponse(res, Messages.TODO_DELETE);
  } catch (error) {
    return failureResponse(res, Messages.INTERNAL_SERVER_ERROR);
  }
};

export const listTodo = async (req, res) => {
  try {
    const cacheKey = "todo_data";

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }
    const { title, isChecked, page = 1, limit = 10 } = req.body;
    const filter = {};
    filter.userId = req.user.id;
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (isChecked) {
      filter.isChecked = isChecked;
    }
    const skip = (page - 1) * limit;

    const todos = await Todo.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("userId", "username email");

    if (!todos.length) {
      return failureResponse(res, Messages.TODO_NOT_FOUND);
    }

    await client.set(cacheKey, JSON.stringify(todos), {
      EX: 60, // Expiry in 60 seconds
    });
    const totalTodos = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(totalTodos / Number(limit));
    return successResponseWithData(res, Messages.TODO_LIST, {
      todos,
      count: todos.length,
      totalTodo: totalTodos,
      totalPage: totalPages,
    });
  } catch (error) {
    return failureResponse(res, Messages.INTERNAL_SERVER_ERROR);
  }
};
