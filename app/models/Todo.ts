import mongoose, { Schema, models, Model, Document } from "mongoose"


export interface ITodo extends Document {
  title: string
  completed: boolean
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)


const Todo: Model<ITodo> =
  models.Todo || mongoose.model<ITodo>("Todo", TodoSchema)

export default Todo
