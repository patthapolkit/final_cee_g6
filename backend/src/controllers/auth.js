import User from "../models/auth.js";

//@desc    User login or register
//@route   POST /api/auth/logreg
export const loginOrRegister = async (req, res) => {
    try {
        // Extract username and password from request body
        console.log("REQ BODY IS: ", req.body);
        const { name, password } = req.body;

        // Check if username and password are provided
        if (!name || !password) {
            return res.status(400).json({success: false, msg: "Please provide name and password"});
        }
        let user = await User.findOne({ name });

        if (!user) {
            // If user does not exist, find an available room number and create a new user
            const availableRoom = await findAvailableRoom();
            user = await User.create({ 
                name, 
                password, 
                roomNumber: availableRoom 
            });
            return res.status(201).json({success: true, msg: "User registered successfully", user});
        }

        // User exists, redirect to their assigned room
        res.status(200).json({success: true, msg: "Redirecting to user's assigned room", user});
    } catch (error) {
        // Return error response if something goes wrong
        console.error("Error in login or register:", error);
        res.status(401).json({success: false, msg: "Login or registration failed"});
    }
};

// Function to find an available room number
const findAvailableRoom = async () => {
    //Need to implement function that finds all the available rooms
    const availableRooms = [1, 2, 3, 4]; //example
    return availableRooms[0];
};
