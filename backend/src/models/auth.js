import mongoose from 'mongoose';

const UserSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    roomNumber: {
        type: Number,
        required: [true, 'Please apply room number']
    }
});

const User = mongoose.model('User', UserSchema);
export default User;