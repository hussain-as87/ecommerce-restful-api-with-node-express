import mongoose from "mongoose";

export const db_connection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log(`Database Connection Success : ${conn.connection.host}`);
    })
/*     .catch((err) => {
      console.error(`Database Error ${err.message}`);
      process.exit(1);
    }); */
};
