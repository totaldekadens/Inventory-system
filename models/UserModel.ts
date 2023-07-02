import crypto from "crypto";
import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  hash: String,
  salt: String,
});

export interface UserDocument {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  setPassword: (password: string) => void;
  password?: string;
  hash?: string;
  salt?: string;
}

// Method to check the entered password is correct or not
UserSchema.methods.validPassword = function (password: string) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`) // testa denna sen: process.env.SECRET_KEY_HASH
    .toString(`hex`);
  return this.hash === hash;
};
// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`) // testa denna sen: process.env.SECRET_KEY_HASH
    .toString(`hex`);

  this.password = this.hash + this.salt;
};

export default module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema);
