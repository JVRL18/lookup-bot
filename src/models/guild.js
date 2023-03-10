import { Schema, model } from 'mongoose'

const guild = new Schema({

    id: { type: String, unique: true, required: true },

    allowed: { type: String, default: '' }
});

export const Guild = model("Guild", guild)