import mongoose from "mongoose";
interface Post {
  title: string;
  content: string;
}
const postSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

// also check if the model already exists
export const PostModel =
  mongoose.models.Post || mongoose.model("Post", postSchema);

export default PostModel;
