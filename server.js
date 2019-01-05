const express = require('express')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))



const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get('/', (req, res) => res.sendFile('auth.html', {
    root: __dirname
}))



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('App listening on port ' + port)
})



/* PASSPORT SETUP */

const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

app.get('/success', (req, res) => {
    res.send("You have successfully logged in")
})
app.get('/error', (req, res) => res.send("error logging in"))

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((obj, cd) => {
    cb(null, obj)
})



/* FACEBOOK AUTH */

const FacebookStrategy = require('passport-facebook').Strategy

const FACEBOOK_APP_ID = '216136155960531'
const FACEBOOK_APP_SECRET = '57bee9443c6964d6725391937acc3460'

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback"
    },

    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile)
    }
))

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/error/'
}), (req, res) => {
    res.redirect('/success')
})




/* GITHUB AUTH */


const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "Iv1.3cc7ee40badc94a0"
const GITHUB_CLIENT_SECRET = "07c906890c53fee6314e80d61ec49c444e25edeb";

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/error'
    }),
    function (req, res) {
        console.log('----------')
        console.log(req.body)
        console.log('---------')
        console.log('This should be the cookies', req.cookies)
        res.redirect('/success');
    });