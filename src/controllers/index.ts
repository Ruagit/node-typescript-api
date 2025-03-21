import { Request, Response } from "express";
import { insertUser, fetchUserById } from "../models";
import { PartialUserResponse } from "../types";
import { userSchema } from "../utils";

export const createUser = async (req: Request, res: Response): Promise<Response<PartialUserResponse>> => {
  try {
    const userPayload = req.body;

    const isValidUserPayload = userSchema.safeParse(userPayload);
    if (!isValidUserPayload.success) {
      return res.status(400).json({ errors: isValidUserPayload.error.errors });
    }

    const user = await insertUser(userPayload);

    return res.status(201).json({ user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response<PartialUserResponse>> => {

  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await fetchUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching user details' });
  }
};
