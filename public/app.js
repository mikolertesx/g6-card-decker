const container = document.querySelector(".deck");
const button = document.querySelector("button");
const playerNumber = document.querySelector("#num_players");
const cardNumber = document.querySelector("#num_cards");

const flippedReferences = [];

button.addEventListener("click", (e) => {
	e.preventDefault();

	// Send the data.
	fetch("/get-cards", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			numPlayers: +playerNumber.value,
			cardsPerPlayer: +cardNumber.value,
		}),
	})
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
	const allCards = document.querySelectorAll(".card");
	allCards.forEach((card) =>
		card.removeEventListener(card, flippedReferences.shift())
	);
}

function mapCards(card) {
	const number = card.slice(0, -1);
	const symbol = card.slice(-1);
	return createCard(symbol, number);
}

function onFinishedFetching(res) {
	console.log(res);
	cleanCards();
	const { deck, hands } = res;

	const deckElements = deck.map(mapCards);
	container.innerHTML = deckElements.join("\n");

	hands.forEach((hand, index) => {
		const newHand = hand.map(mapCards);
		container.innerHTML += `<h2>Player ${index + 1}</h2>`;
		container.innerHTML += newHand.join("\n");
	});

	const allCards = document.querySelectorAll(".card");
	allCards.forEach((card) => {
		const flipFunction = () => flippedCard(card);
		flippedReferences.push(flipFunction);
		card.addEventListener("click", flipFunction);
	});
}

function createCard(symbol, number) {
	const isNumber = !isNaN(number) || number === "A";
	const fixedSize = number === "A" ? 1 : number;
	return `
	<div class="card card-${symbol}" number="${number}">
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
