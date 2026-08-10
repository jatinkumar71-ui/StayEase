const { check, validationResult } = require("express-validator");
const Home = require("../models/homes");


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login',
        currentPage: 'Login',
        isLoggedIn: false,
    })
}

exports.postLogin = (req, res, next) => {
    console.log(req.body);
    req.session.isLoggedIn = true;
    // res.cookie('isLoggedIn', true);
    res.redirect('/');
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() =>{
        res.redirect('/login');
    }); 
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle : 'sign up',
        currentPage: 'signup',
        isLoggedIn: false,
        errors: [],
        oldInput: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            userType: 'guest'
        }
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
    .withMessage('Passward should be atleast 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Passward should contain atleast one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Passward should contain atleast one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Passward should contain atleast one number.')
    .matches(/[!@&]/)
    .withMessage('Passward should contain atleast one special character.')
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
                oldInput:{firstName, lastName, email, userType}
            });
        }
        res.redirect('/');
    }
]
