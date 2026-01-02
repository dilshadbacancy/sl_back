import app from "./app";
import { SequelizeConnection } from "./config/database.config";
import "./associations";

const PORT = process.env.PORT;


const sequelize = SequelizeConnection.getInstance();


app.listen(PORT, () => {
    sequelize.sync({ alter: true })
        .then(() => console.log("---------------------Database is Connected--------------"))
        .catch(err => console.error("DB Connection Error:", err));
    console.log(`Server running on port http://localhost:${PORT}`);
});

app.get("/api", (req, res) => {
    res.json({ message: "Server Running" });
});