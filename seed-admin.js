require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./src/models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "Admin@12345";
  const name = process.argv.slice(4).join(" ") || "System Admin";

  const hash = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { username },
    {
      name,
      username,
      password: hash,
      role: "admin",
      isActive: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${user.username}`);
  console.log(`Password: ${password}`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
