const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gameSchema = new Schema(
    {
        player1: {
            type: String
        },
        player2: {
            type: String
        }
    },
    {
        timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);