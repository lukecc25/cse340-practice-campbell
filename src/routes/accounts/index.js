import express from 'express';
const router = express.Router();
 
/**
 * Display the login form
 */
router.get('/login', (req, res) => {
    // Check if user is already logged in
    if (req.session.isLoggedIn) {
        return res.redirect('/accounts/dashboard');
    }
 
    res.render('accounts/login', {
        title: 'Login'
    });
});
 
/**
 * Process login form submission
 * For this assignment, any form submission automatically logs the user in
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
 
    // Basic validation
    if (!username || !password) {
        res.locals.errors.push('Username and password are required');
        return res.render('accounts/login', {
            title: 'Login'
        });
    }
 
    // For this assignment, any valid form submission logs the user in
    // In a real application, you would verify credentials against a database
    req.session.isLoggedIn = true;
    req.session.username = username;
    req.session.loginTime = new Date();
 
    // Redirect to dashboard
    res.redirect('/accounts/dashboard');
});
 
/**
 * Display the user dashboard (protected route)
 */
router.get('/dashboard', (req, res) => {
    // Check if user is logged in
    if (!req.session.isLoggedIn) {
        res.locals.errors.push('Please log in to access the dashboard');
        return res.render('accounts/login', {
            title: 'Login'
        });
    }
 
    res.render('accounts/dashboard', {
        title: 'Account Dashboard',
        username: req.session.username,
        loginTime: req.session.loginTime
    });
});
 
/**
 * Process logout request
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.locals.errors.push('Logout failed. Please try again.');
            return res.render('accounts/dashboard', {
                title: 'Account Dashboard',
                username: req.session.username,
                loginTime: req.session.loginTime
            });
        }
 
        // Clear the session cookie
        res.clearCookie('sessionId');
        res.redirect('/');
    });
});
 
export default router;