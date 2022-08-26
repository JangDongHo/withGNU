import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Place";
import "./models/Users";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
