import { Schema, model, Document } from "mongoose";

interface IApi extends Document {
  user: string;
  method: string;
  endpoint: string;
  requests: number;
}

const ApiSchema: Schema = new Schema({
  user: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  requests: {
    type: Number,
    default: 0,
  },
});

const Api = model<IApi>("Api", ApiSchema);
export default Api;
