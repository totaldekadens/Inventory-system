import caseInsensitive from "@/lib/caseCheck";
import dbConnect from "@/lib/dbConnect";
import User, { UserDocument } from "@/models/UserModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const getAllUsers: UserDocument[] | null = await User.find({});

        if (!getAllUsers) {
          return res.status(500).send({
            success: false,
            data: "Server problem",
          });
        }

        res.status(200).json({ success: true, data: getAllUsers });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;
    case "POST":
      try {
        if (!req.body) {
          return res.status(400).json({ success: false, data: "Bad request" });
        }
        const userTaken: UserDocument | null = await User.findOne({
          username: caseInsensitive(req.body.username),
        });
        if (userTaken) {
          return res
            .status(403)
            .send({ success: false, data: "Username already exist" });
        }

        let newUser: UserDocument = new User(req.body);

        newUser.setPassword(req.body.password);
        delete newUser.password;

        const user = await User.create(newUser);

        res.status(201).json({ success: true, data: user._id });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "PUT":
      try {
        if (!req.body) {
          return res
            .status(400)
            .json({ success: false, data: "Bad request, check body" });
        }

        const updateUser: UserDocument = new User();

        updateUser._id = req.body._id;
        updateUser.firstName = req.body.firstName;
        updateUser.lastName = req.body.lastName;
        updateUser.email = req.body.email;

        // Verifies old password before the new password sets. Took from [...nextauth].js
        if (req.body.newPassword) {
          const user = await User.findOne({ username: req.body.username }).then(
            (res) => {
              if (!res) {
                throw Error("invalid user");
              }
              if (res) {
                if (res.validPassword(String(req.body.oldPassword))) {
                  return res;
                }
                throw Error("incorrect password");
              }
              throw Error("invalid user");
            }
          );

          if (user) {
            updateUser.setPassword(req.body.newPassword);
            delete updateUser.password;
          }
        }

        const user = await User.findOneAndUpdate(
          { _id: req.body._id },
          updateUser,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;
    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
