import Golfball from "../models/golfball.js";
//Still not implemented, test the methods first.

//@desc    Get all player's golfballs
//@route   GET /api/v1/golfballs
export const getGolfBalls = async (req, res) => {
    res.status(200).json({success: true, msg: "Show all golfballs"});
};


//@desc    Get ONE player's golfballs
//@route   GET /api/v1/golfballs/:id
export const getGolfBall = async (req, res) => {
    res.status(200).json({success: true, msg: `Show golfballs : ${req.params.id}`});
};


//@desc    Create a golfball
//@route   POST /api/v1/golfballs
export const createGolfBall = async (req, res) => {
    res.status(200).json({success: true, msg: "create golfball"});
};


//@desc    Update a position of that golfball
//@route   PUT /api/v1/golfballs/:id
export const updateGolfBallPosition = async (req, res) => {
    res.status(200).json({success: true, msg: `update golfball position for : ${req.params.id}`});
};


//@desc    Clear all golfballs
//@route   DELETE /api/v1/golfballs/clear
export const clearGolfBalls = async (req, res) => {
    res.status(200).json({success: true, msg: "clear all golfballs"})
};