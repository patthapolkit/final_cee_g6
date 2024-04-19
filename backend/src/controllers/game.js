import Game from '../models/game.js';

//@desc    Controller function to create a new game
//@route   POST /api/game
export const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json({ message: "Created!", game});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//@desc    Controller function to get a game by its ID
//@route   GET /api/game/:id
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.status(200).json({ message: "Got the game!", game });
  } catch (error) {
    res.status(404).json({ message: 'Game not found' });
  }
};

//@desc    Controller function to update a game by its ID
//@route   PUT /api/game/:id
export const updateGameById = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Updated!", game });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//@desc    Function to delete a game by its ID
//@route   GET /api/game/:id
export const deleteGameById = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
