import { Router } from "express";
import _ from "lodash";
import Bundle from "../bundle";
import Middleware from "../middleware/middleware";
import { isAppError, getUserExistsError, getNotFoundError, ErrorType } from "../../application/common/errors";
import { generateUser } from "../../application/users/user";
import { formatUser } from "../formatting";

const createAuthApi = ({ userRepo, tokens, validators }: Bundle, authMiddleware: Middleware) => {
    const authApi = Router();

    authApi.route("/users").post(async (req, res) => {
        try {
            const data = validators.validateSignUp(req.body);
            const user = await generateUser(data);

            const check = await userRepo.checkUser(user);
            if (check) throw getUserExistsError(check);

            await userRepo.save(user);

            const token = await tokens.getToken(user.id);

            return res
                .status(201)
                .header("JWT", token)
                .json({ user: formatUser(user) });
        } catch (e) {
            console.log("Cannot create user:", e);
            if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
            return res.status(400).json({ error: e });
        }
    });

    authApi
        .route("/account")
        .get(authMiddleware, (req, res) => {
            return res.status(200).json({ user: formatUser(res.locals.user) });
        })
        .delete(authMiddleware, async (req, res) => {
            await userRepo.delete(res.locals.user);
            return res.status(204).send();
        });

    authApi
        .route("/tokens")
        .post(async (req, res) => {
            try {
                const data = validators.validateSignIn(req.body);
                const user = await userRepo.getUserByEmail(data.email);

                if (!user) throw getNotFoundError();

                const passCheck = await user.password.check(data.password);

                if (!passCheck) throw getNotFoundError();

                const token = await tokens.getToken(user.id);

                return res
                    .status(200)
                    .header("JWT", token)
                    .json({ user: formatUser(user) });
            } catch (e) {
                console.log("Cannot Sign In:", e);
                if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
                if (e.type == ErrorType.NotFound) return res.status(404).json({ type: "Invalid Email / Password" });
                return res.status(400).json({ error: e });
            }
        })
        .delete(authMiddleware, async (req, res) => {
            await tokens.invalidateToken(res.locals.token);
            return res.status(204).send();
        });

    return authApi;
};

export default createAuthApi;
