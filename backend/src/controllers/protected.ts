import { Request, Response } from "express";
import User from "../models/User";
import Api from "../models/Api";

export const sampleController = async (req: Request, res: Response) => {
    res.status(200).json({ data: 'This is only accessible using JWT', user: req.user })
}

export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password')
        const userId = (req.user as any).id;

        if (!userId) {
            console.error("User not found");
            return res.status(404).send("User not found");
        }

        // find user api call
        const api = await Api.findOne({ user: userId, endpoint: "/api/v1/protected/users" });
        if (!api) {
            console.error("API not found for fetch users endpoint.");
            return res.status(400).send({ message: "API not found for fetch users endpoint." });
        }

        // update user's api call usage
        api.requests += 1;
        await api.save();

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
            console.error("User not found");
            return res.status(404).send("User not found");
        }

        // find user api call
        const api = await Api.findOne({
            user: req.userId,
            endpoint: "/api/v1/protected/users/:id",
            method: "DELETE"
        });

        if (!api) {
            console.error("API not found for delete user endpoint.");
            return res.status(400).send({ message: "API not found for delete user endpoint." });
        }

        // update user's api call usage
        api.requests += 1;
        await api.save();

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
            console.error('User not found')
            return res.status(404).send("User not found");
        }

        // find user api call
        const api = await Api.findOne({
            user: req.userId,
            endpoint: "/api/v1/protected/users/:id",
            method: "PUT"
        });

        if (!api) {
            console.error("API not found for edit user endpoint.");
            return res.status(400).send({ message: "API not found for edit user endpoint." });
        }

        // update user's api call usage
        api.requests += 1;
        await api.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        console.error("Error occurred while updating user:", err);
        res.status(500).send("Internal Server Error");
    }
}