const flashMessages = (req, res, next) => {
    if (!req.session) {
        throw new Error("Flash middleware requires session support. Use `express-session`.");
    }

    // Initialize flash storage as an object grouped by type
    req.session.flash = req.session.flash || {};

    // Load flash messages from cookies (if any)
    if (req.cookies) {
        const cookieFlash = req.cookies.tempFlash;
        if (cookieFlash) {
            try {
                const tempMessages = JSON.parse(decodeURIComponent(cookieFlash));
                // Merge cookie flash messages into session flash
                for (const { type, message } of tempMessages) {
                    if (!req.session.flash[type]) req.session.flash[type] = [];
                    req.session.flash[type].push(message);
                }
                res.clearCookie('tempFlash');
            } catch {
                res.clearCookie('tempFlash');
            }
        }
    }

    // Override session.destroy to save flash messages in cookie before destroying
    const originalDestroy = req.session.destroy.bind(req.session);
    req.session.destroy = (callback) => {
        if (req.session.flash && Object.keys(req.session.flash).length > 0 && res.cookie) {
            try {
                // Flatten flash messages to array of {type, message}
                const flashData = [];
                for (const type in req.session.flash) {
                    req.session.flash[type].forEach(msg => {
                        flashData.push({ type, message: msg });
                    });
                }
                const flashString = encodeURIComponent(JSON.stringify(flashData));
                res.cookie('tempFlash', flashString, {
                    maxAge: 60000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
            } catch {
                console.warn('Flash middleware: Could not save flash messages to cookie');
            }
        }
        originalDestroy(callback);
    };

    // Add req.flash(type, message) method
    req.flash = (type, message) => {
        if (!req.session.flash[type]) {
            req.session.flash[type] = [];
        }
        req.session.flash[type].push(message);
    };

    // Pass flash messages to res.locals.flash and clear session flash
    res.locals.flash = req.session.flash;
    req.session.flash = {};

    next();
};

export default flashMessages;
