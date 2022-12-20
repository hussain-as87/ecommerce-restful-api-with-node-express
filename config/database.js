import mongoose from "mongoose";
import "colors";

export const db_connection = () => {
    mongoose.connect(process.env.DB_URL).then((conn) => {
        console.log(
            `Database Connection Successfully : ${conn.connection.host}`.green
        );
    });
    /*     .catch((err) => {
        console.error(`Database Error ${err.message}`);
        process.exit(1);
      }); */
};
