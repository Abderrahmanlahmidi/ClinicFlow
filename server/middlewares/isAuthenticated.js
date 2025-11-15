import jwt from "jsonwebtoken";

export default function isAuthenticated(allowedRoles = []) {
    return (req, res, next) => {
        try {
            let token = req.get("authorization");

            if (!token) {
                return res.status(401).json({ success: false, msg: "Token not found" });
            }

            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = {
                id: decoded.id,
            };

            if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ success: false, msg: "Access denied" });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ success: false, msg: error.message });
        }
    };
}

