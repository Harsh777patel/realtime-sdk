import mongoose from "mongoose";

const url = "mongodb+srv://harsh:royalharsh4004@cluster0.i6jxwnb.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

mongoose
    .connect(url)
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.error(err);
    });

export default mongoose;