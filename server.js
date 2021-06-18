const express = require("express");
const app = express();
const { Deck, Hand } = require("./app/deck");

const HANDS_PER_DECK = 2;

app.use(express.static("public"));
app.use(express.json());

const deck = new Deck();
const deckCards = deck.dispatchCards(5);
app.get("/get-deck", (req, res) => {
	const fixedDeckCards = deckCards.map((card, index) => ({
		card,
		flipped: index > 1 ? false : true,
	}));

	if (deck.cards.length < HANDS_PER_DECK) {
		return res.json({
			hand: [],
			deck: fixedDeckCards,
			error: "No hay más cartas para unirse.",
		});
	}
	const hand = new Hand(deck, HANDS_PER_DECK);
	const fixedHand = {
		hand: hand.cards.map((card, index) => ({
			card,
			flipped: index > 2 ? false : true,
		})),
		deck: fixedDeckCards,
	};

	return res.json(fixedHand);
});

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
