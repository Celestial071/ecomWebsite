import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
        type: String,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true, 
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Minimum Legth of password is 8"] //can be checked in frontend?
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product:{
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
},{
    timestamps: true,
});

//Pre-Save hook
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    try{
        const salt = await(bcrypt.genSalt(10));
        this.password = await(bcrypt.hash(this.password, salt));
        next();
    }catch(error){
        next(error)
    }
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema)
export default User
