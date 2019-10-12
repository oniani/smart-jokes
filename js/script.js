/* jshint esversion: 7 */
/* jshint node: true */
"use strict";

// Asynchronous utility function for data retrieval
async function getData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}

// Header generator
function generateHeader(headerName) {
  let header = document.createElement("div");
  header.className = "rounded mx-auto";
  header.style.margin = "69px";
  header.style.padding = "5px";
  header.style.boxShadow = "8px 8px 8px grey";
  header.style.backgroundColor = "#007bff";
  header.style.color = "#ffffff";

  let h1 = document.createElement("h1");
  h1.className = "text-center";
  h1.innerText = headerName;

  header.appendChild(h1);

  return header;
}

// Quote generator
function generateQuote(quote, color, author) {
  let header = document.createElement("div");
  header.className = "rounded";
  header.style.margin = "15px";
  header.style.padding = "15px";
  header.style.boxShadow = "8px 8px 8px grey";
  header.style.backgroundColor = color;
  header.style.color = "#ffffff";

  let h = document.createElement("h4");
  h.className = "text-center my-4";
  h.innerText = quote + "\n\n" + author;

  header.appendChild(h);

  return header;
}

// Button generator
function generateButton(buttonName, buttonId, onClickFunction, color) {
  let button = document.createElement("button");
  button.id = buttonId;
  button.setAttribute("onclick", onClickFunction);
  button.className = `btn btn-block btn-${color} text-center mx-auto`;
  button.innerText = buttonName;
  button.style.margin = "25px";
  return button;
}

// Input generator
function generateInput(inputName, inputId) {
  let input = document.createElement("input");
  input.id = inputId;
  input.className = "text-center form-control mx-auto";
  input.placeholder = inputName;
  input.style.margin = "25px";
  return input;
}

// Generate a card {
function generateCard(imageUrl, title, setup, punchline, onClickEvent) {
  let cardDiv = document.createElement("div");
  cardDiv.className = "card text-center my-3";

  // Append this to cardDiv
  let img = document.createElement("img");
  img.className = "card-img-top mx-auto d-block";
  img.src = imageUrl;
  img.style.boxShadow = "8px 8px 8px grey";
  img.width = 300;
  img.height = 300;

  // Another level
  let cardTextDiv = document.createElement("div");
  cardTextDiv.className = "card-body";
  cardTextDiv.style.boxShadow = "8px 8px 8px grey";
  cardTextDiv.style.height = "15rem";

  let h5 = document.createElement("h5");
  h5.innerHTML = title;

  let p1 = document.createElement("p");
  p1.className = "card-text";
  p1.innerHTML = setup;

  let button = document.createElement("button");
  button.className = "btn btn-primary text-center text-white";
  button.innerHTML = "Reveal";
  button.setAttribute("onclick", onClickEvent);

  let p2 = document.createElement("p");
  p2.className = "reveal card-text bg-danger text-white rounded p-2";
  p2.innerHTML = punchline;
  p2.style.display = "none";

  cardTextDiv.appendChild(h5);
  cardTextDiv.appendChild(p1);
  cardTextDiv.appendChild(p2);
  cardTextDiv.appendChild(button);

  cardDiv.appendChild(cardTextDiv);
  cardDiv.appendChild(img);

  return cardDiv;
}

function togglePunchline(button) {
  let punchline = button.parentNode.children[2];
  if (punchline.style.display === "none") {
    punchline.style.display = "block";
  } else if (punchline.style.display === "block") {
    punchline.style.display = "none";
  }
}

// Generate stuff
async function interfaceGenerator() {
  document.body.style.backgroundColor = "#efe2ba";

  let body = document.querySelector("body");

  let contentDiv = document.createElement("div");
  contentDiv.id = "content";
  contentDiv.className = "container";

  contentDiv.appendChild(generateHeader('"Smart Jokes"', ""));

  contentDiv.appendChild(generateInput("How Many Rows?", "rowCountSpecifier"));
  contentDiv.appendChild(
    generateButton(
      "Generate Smart Jokes",
      "generatePosts",
      "populate()",
      "primary"
    )
  );
  contentDiv.appendChild(
    generateButton(
      "Clear Smart Jokes",
      "generateJokes",
      "removePosts()",
      "danger"
    )
  );

  let jokes = document.createElement("div");
  jokes.id = "jokes";
  contentDiv.appendChild(jokes);

  body.prepend(contentDiv);
}

// Asynchronous utility function utilizing memes API for meme retrieval
async function getMemes() {
  return new Promise(resolve =>
    resolve(getData("https://api.imgflip.com/get_memes"))
  );
}

// Asynchronous utility function utilizing memes API for joke retrieval
async function getRandomJoke() {
  return new Promise(resolve =>
    resolve(getData("https://official-joke-api.appspot.com/random_joke"))
  );
}

// Meme generator
async function jokeGenerator(numberOfPosts = 3) {
  let jokesDiv = document.querySelector("#jokes");
  let memes = await getMemes();

  let jokesRow = document.createElement("div");
  jokesRow.className = "row jokesRow";

  jokesDiv.appendChild(jokesRow);

  for (let i = 0; i < numberOfPosts; i++) {
    let jokes = await getRandomJoke();

    // Generate `numberOfMemes` number of memes
    let joke = document.createElement("div");
    joke.className = "col";

    // Pick memes at random (there are 100 memes [0 - 99] in total)
    let randomNumber = Math.floor(Math.random() * 100);

    // Append to the document
    joke.appendChild(
      generateCard(
        memes.data.memes[randomNumber].url,
        memes.data.memes[randomNumber].name,
        jokes.setup,
        jokes.punchline,
        "togglePunchline(this)"
      )
    );
    jokesRow.appendChild(joke);
  }
}

// Remove memes
function removePosts() {
  let jokes = document.querySelector("#jokes");
  while (jokes.lastChild) {
    jokes.removeChild(jokes.lastChild);
  }
}

// Function for generating memes and on-click events
function populate() {
  for (let i = 0; i < document.querySelector("#rowCountSpecifier").value; i++) {
    jokeGenerator();
  }
}

// Populate
window.onload = function() {
  interfaceGenerator();
};
