const mongoose = require("mongoose");
const bcrypt = require ('bcrypt')

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: [true, "Nombre obligatorio"],
        minLength: [3, "Nombre debe tener al menos 3 caracteres"]
    },
    LastName: {
        type: String,
        required: [true, "Apellido obligatorio"],
    },
    Email: {
        type: String,
        required: [true, "E-mail obligatorio"],
        validate:{
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message:"Ingrese un valor valido "
        },
        unique: true // no nos va a guardar cuando un email se repite  pero no es un validador
    },
    Password: {
        type: String,
        required: [true, "Pasword obligatorio"],
        minLength: [8, "Password debe tener al menos 3 caracteres"]
    },

}, {timestamps: true, versionKey:false})

UserSchema.virtual('confirmPassword')
    .get(()=> this._confirmPassword)
    .set(value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if(this.Password != this._confirmPassword) {
        this.invalidate('confirmPassword' ,'las contraseñas no coinciden');
    }
    next();
});

UserSchema.pre('save', function(next){
    bcrypt.hash(this.Password, 10)
        .then(hash =>{
            this.Password = hash;
            next();
        })
});

const Usuario = mongoose.model("usuarios", UserSchema);
module.exports = Usuario;

