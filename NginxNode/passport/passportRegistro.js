const passport = require('passport');
const LocalStratrgy = require('passport-local').Strategy;
const usuario = require('../models/usuarios.js');
passport.use(
    'signup',
    new LocalStratrgy(
        { passReqToCallback: true },
        (req, nombreUsuario, contraseña, done) => {
            usuario.findOne({ nombreUsuario }, function (err, usuario) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (usuario) {
                    console.log('usuario exixyente');
                    return done(null, false);
                }

                const newusuario = {
                    nombreUsuario: nombreUsuario,
                    contraseña: contraseña,
                };
                usuario.create(newusuario, (err, usuarioWintID) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    console.log(usuario);
                    console.log('usuario registrado');
                    return done(null, usuarioWintID);
                });
            });
        }
    )
);
