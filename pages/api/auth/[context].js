import { createAuth } from "../../../utils/auth";
import absoluteUrl from 'next-absolute-url';
import config from "../../../utils/config";

export default async function (req, res) {
    const { context } = req.query;

    if (req?.cookies?.SessionId) {
        // Session ID is present (but may not be valid)
        // Create auth object
        const { origin } = absoluteUrl(req, 'localhost:3000');
        const auth = await createAuth(req.cookies.SessionId, origin);

        // Redirect to auth page
        res.setHeader('Location', `${config.AUTH_DOMAIN}/api/auth/${context}?state=${auth.ops[0].state}`);
        res.status(302).end();
    } else {
        // A session ID is not present
        res.statusCode = 400;
        res.end("No Session ID present");
    }
}
