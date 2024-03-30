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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error occurred while deleting user:", err);
        res.status(500).send("Internal Server Error");
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, email, admin, api_calls } = req.body;
        const user = await User.findByIdAndUpdate(id, { name, email, admin, api_calls }, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        console.error("Error occurred while updating user:", err);
        res.status(500).send("Internal Server Error");
    }
}