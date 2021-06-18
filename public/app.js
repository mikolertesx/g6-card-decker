const deckContainer = document.querySelector(".deck");
const handContainer = document.querySelector(".hand");
const button = document.querySelector("button");
// const playerNumber = document.querySelector("#num_players");
// const cardNumber = document.querySelector("#num_cards");

const flippedReferences = [];

button.addEventListener("click", (e) => {
	e.preventDefault();

	// Send the data.
	fetch("/get-deck")
		.then((data) => data.json())
		.then(onFinishedFetching);
});

function flippedCard(element) {
	if (element.classList.contains("flipped")) {
		element.classList.remove("flipped");
	} else {
		element.classList.add("flipped");
	}
}

function cleanCards() {
	const allCards = document.querySelectorAll(".hand .card");
	allCards.forEach((card) =>
		card.removeEventListener(card, flippedReferences.shift())
	);
}

function mapCards(card) {
	const number = card.card.slice(0, -1);
	const symbol = card.card.slice(-1);
	const flipped = card.flipped;
	return createCard(symbol, number, flipped);
}

function onFinishedFetching(res) {
	const { hand, deck, error } = res;
	cleanCards();

	if (hand.length === 0) {
		handContainer.innerHTML = "<h2>No puedes unirte en este momento.</h2>";
		handContainer.innerHTML += `<h3>Razon: ${error}</h3>`;
	} else {
		const handElements = hand.map(mapCards);
		handContainer.innerHTML = "<h2>Hands</h2>";
		handContainer.innerHTML += handElements.join("\n");
	}

	const deckElements = deck.map(mapCards);
	deckContainer.innerHTML = "<h2>Deck</h2>";
	deckContainer.innerHTML += deckElements.join("\n");

	const handCards = document.querySelectorAll(".hand .card");
	handCards.forEach((card) => {
		const flipFunction = () => flippedCard(card);
		flippedReferences.push(flipFunction);
		card.addEventListener("click", flipFunction);
	});
}

function createCard(symbol, number, isFlipped = true) {
	const isNumber = !isNaN(number) || number === "A";
	const fixedSize = number === "A" ? 1 : number;
	return `
	<div class="card card-${symbol} ${
		isFlipped ? "flipped" : ""
	}" number="${number}">
		<div class="card-front">
			<div class="card-corner top-left">
				<div>${number}</div>
				<div>${symbol}</div>
			</div>
			<div class="symbols">
				${
					isNumber
						? `${new Array(parseInt(fixedSize))
								.fill(symbol)
								.map(
									(cardSymbol) => `
						<div>${cardSymbol}</div>
					`
								)
								.join("")}`
						: ""
				}
			</div>
			<div class="card-corner bottom-right">
				<div>${number}</div>
				<div>${symbol}</div>
			</div>
		</div>
		<div class="card-back">
		</div>
	</div>`;
}
