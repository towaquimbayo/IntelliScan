import { Request, Response } from "express";
import User from "../models/User";

export const sampleController = async (req: Request, res: Response) => {
    res.status(200).json({ data: 'This is only accessible using JWT', user: req.user })
}

export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({ users });
    } catch (err) {
        console.error("Error occurred while fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
}