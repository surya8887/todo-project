import { Schema, model, models } from "mongoose"

interface IUser {
    name: string
    email: string
    password?: string,
    provider:string,
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String
        },
        email: { type: String, unique: true },
        password: {
            type: String,
            required: true
        },
        provider: { type: String, default: "credentials" }
    },
    { timestamps: true }
)

export default models.User || model<IUser>("User", UserSchema)
