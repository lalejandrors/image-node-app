import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret, options) {
        delete ret._id;
    }
});

export const UserModel = mongoose.model('User', userSchema);