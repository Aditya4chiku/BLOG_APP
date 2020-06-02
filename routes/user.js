const routes = require('express').Router();
const User = require('../model/user');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

routes.post('/user/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already exists' }] });
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            s: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save()
        return res.status(200).json({ message: "user save successfully" })
    } catch (err) {
        res.status(500).json({ message: 'Server Issue' })
    }
})




routes.post('/user/login', async (req, res) => {
    const email = req.body.email
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User Not exist pls register" })
        }
        console.log(user)
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, "XCBGH", { expiresIn: 360000 }, (err, token) => {
            if (err) throw err
            return res.status(200).json({ user, token })
        })

    } catch (error) {
        return res.status(500).json({ message: "Server Issue" })
    }
})



module.exports = routes