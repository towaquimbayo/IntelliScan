import { Schema, model, Document } from "mongoose"

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    date: Date;
    token: string;
    admin: boolean;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024, //store hashes
        min: 6
    },
    date: {
        type: Date,
        default: Date.now()
    },
    token: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    }
})

const User = model<IUser>('User', UserSchema)
export default User;