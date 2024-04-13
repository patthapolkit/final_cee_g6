import mongoose from 'mongoose';

const GolfBallSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    currentPosition: {
        posX: {
            type: Number,
            required: true
        },
        posY: {
            type: Number,
            required: true
        }
    }
});

const Golfball = mongoose.model('GolfBall', GolfBallSchema);

export default Golfball;