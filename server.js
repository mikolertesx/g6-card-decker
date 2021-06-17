const express = require("express");
const app = express();
const { Deck, Hand } = require("./app/deck");

app.use(express.static("public"));
app.use(express.json());

app.post("/get-cards", (req, res) => {
	// const numPlayers = 5;
	const { numPlayers, cardsPerPlayer } = req.body;

	const deck = new Deck();
	const hands = [];
	for (let _ = 0; _ < numPlayers; _++) {
		hands.push(new Hand(deck, cardsPerPlayer));
	}

	return res.json({
		hands: hands.map((hand) => hand.cards),
		deck: deck.cards,
	});
});

app.listen(4001, () => {
	console.log("Server running on port 4001");
});
