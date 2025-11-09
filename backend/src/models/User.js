import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//1. Create a schema
//2. Create a model based on schema
//3. Export the model to be used elsewhere

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    },
    {timestamps: true} //Mongoose will create "createdAt" and "updatedAt" when this field is used.
);

// Pre-save middleware — runs automatically before saving a user
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Compare entered password with stored hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Create a User model based off this schema
export default mongoose.model('User', userSchema);
