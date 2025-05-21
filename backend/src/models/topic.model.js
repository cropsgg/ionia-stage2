import mongoose, {Schema} from "mongoose";

const topicSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        schoolId: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true
        },
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            index: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export const Topic = mongoose.model("Topic", topicSchema);