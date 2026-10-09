const { check, validationResult } = require("express-validator");
const Home = require("../models/homes");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/login', {
        pageTitle : 'Login',
        currentPage: 'Login',
        errors: [],
        oldInput: {email: ""},
        user: {},
    })
}

exports.postLogin = async (req, res, next) => {
    const {email,password} = req.body;
    console.log("REQ.BODY:", req.body);
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);
    const user = await User.findOne({email});
    if(!user){
        return res.status(422).render('auth/login',{
            pageTitle: 'login',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ["User does not exist"],
            oldInput:{email},
            user: {},
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(422).render('auth/login',{
            pageTitle: 'login',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ["Invalid Password"],
            oldInput:{email},
            user: {},
        });
    }
    req.session.isLoggedIn = true;
    req.session.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
    };
    await req.session.save();
    console.log("SESSION AFTER SAVE:", req.session);

    res.redirect('/');
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() =>{
        res.redirect('/login');
    }); 
}

exports.getSignUp = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signup', {
        pageTitle : 'sign up',
        currentPage: 'signup',
        errors: [],
        oldInput: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            userType: '',
        },
        user: {},
    })
}

exports.postSignUp = [
    check('firstName')
    .trim()
    .isLength({min: 2})
    .withMessage("First Name should be atleast 2 characters long.")
    .matches(/^[A-za-z\s]+$/)
    .withMessage("First Name should contains only alphabets."),

    check('lastName')
    .matches(/^[A-za-z\s]*$/)
    .withMessage("First Name should contains only alphabets."),

    check('email')
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

    check('password')
    .isLength({min: 8})
    .withMessage('Password should be atleast 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password should contain atleast one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password should contain atleast one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password should contain atleast one number.')
    .matches(/[!@&]/)
    .withMessage('Password should contain atleast one special character.')
    .trim(),

    check('confirmPassword')
    .trim()
    .custom( (value, {req}) =>{
        if(value !== req.body.password){
            throw new Error("password do not match");
        }
        return true;
    } ),
    
    check('userType')
    .notEmpty()
    .withMessage("Please select a user type.")
    .isIn(['guest','host'])
    .withMessage("Invalid user type."),

    check('terms')
    .notEmpty()
    .custom( (value, {req}) =>{
        if(value !== "on"){
            throw new Error("Please accept the terms and conditions");
        }
        return true;
    } ),

    (req, res, next) => {
        const {firstName, lastName, email, password, userType} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('auth/signup',{
                pageTitle: 'sign up',
                currentPage: 'signup',
                isLoggedIn: false,
                errors: errors.array().map(err => err.msg),
                oldInput:{firstName, lastName, email, userType},
                user: {},
            });
        }
        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                firstName: firstName, 
                lastName: lastName, 
                email: email, 
                password: hashedPassword, 
                userType: userType
            });
            return user.save();
        })
        .then(() => {
            res.redirect('/login');
        }).catch((error) => {
            return res.status(422).render('auth/signup',{
                pageTitle: 'sign up',
                currentPage: 'signup',
                isLoggedIn: false,
                errors: [error.message],
                oldInput:{firstName, lastName, email, userType},
                user: {},
            });
        })
    }
]
