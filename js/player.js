



let formX = document.querySelector('.log-player-x')
let formO = document.querySelector('.log-player-o')
let contPlayerX = document.querySelector('.sub-cont-player-scroll-x');
let contPlayerO = document.querySelector('.sub-cont-player-scroll-o');


let playerXContainer = document.querySelector('.player_x'); //Revisar
let playerOContainer = document.querySelector('.player_o'); //Revisar

let playerTox = document.querySelector('.p-player-x');
let playerToo = document.querySelector('.p-player-o');

// En usuarios tengo mi array de usuarios
let lsPlayerX = JSON.parse(localStorage.getItem('log-player-x'));
let lsPlayerO = JSON.parse(localStorage.getItem('log-player-o'));

loadPlayers();

formX.addEventListener('submit', async (e) => {
    e.preventDefault();
    let playerName = document.querySelector('#nombreX').value.trim();
    let gender = document.querySelector('input[name="genderX"]:checked')?.value;

    if (playerName && gender) {

        try {
            let macht = false;
            while (!macht) {
                let response = await fetch('https://randomuser.me/api/');
                let datos = await response.json();
                if (datos.results[0].gender == gender) {
                    let thumbnailImg = datos.results[0].picture.thumbnail;
                    let largeImg = datos.results[0].picture.large;
                    savePlayerX(playerName, gender, largeImg, thumbnailImg);
                    macht = true;
                }
            }
        } catch (error) {
            mjsErrorFech(error);
        }

        document.querySelector('#nombreX').value = '';
        document.querySelectorAll('input[name="genderX"]').forEach(radio => radio.checkec = false);
        loadPlayers();
    } else {
        messageAlertForm("Porfavor, seleccione nombre y genero");
    }
});

formO.addEventListener('submit', async (e) => {
    e.preventDefault();
    let playerName = document.querySelector('#nombreO').value.trim();
    let gender = document.querySelector('input[name="genderO"]:checked')?.value;

 

    if(playerName && gender) {

        try {
            let macht = false;
            while (!macht) {
                let response = await fetch('https://randomuser.me/api/');
                let datos = await response.json();
                if(datos.results[0].gender == gender){
                    let thumbnailImg = datos.results[0].picture.thumbnail;
                    let largeImg = datos.results[0].picture.large;
                    savePlayerO(playerName, gender, largeImg, thumbnailImg);
                    macht = true;
                }
            }
        } catch (error) {
            mjsErrorFech(error);
        }

        document.querySelector('#nombreO').value = '';
        document.querySelectorAll('input[name="genderO"').forEach(radio => radio.checkec = false);
        loadPlayers();
    } else {
        messageAlertForm("Porfavor, seleccione nombre y genero");
    }
});

function savePlayerX(name, gender, largeImg, thumbnailImg) {
    let players = JSON.parse(localStorage.getItem('playerX')) || [];
    players.push({name, gender, largeImg, thumbnailImg});
    localStorage.setItem('playerX', JSON.stringify(players));
}

function savePlayerO(name, gender, largeImg, thumbnailImg) {
    let players = JSON.parse(localStorage.getItem('playerO')) || [];
    players.push({name, gender, largeImg, thumbnailImg});
    localStorage.setItem('playerO', JSON.stringify(players));
}

function loadPlayers() {
    contPlayerX.innerHTML = '';
    contPlayerO.innerHTML = '';

    let playersX = JSON.parse(localStorage.getItem('playerX')) || [];
    let playersO = JSON.parse(localStorage.getItem('playerO')) || [];
    let selectedPlayerX = localStorage.getItem('selectedPlayerX');
    let selectedPlayerO = localStorage.getItem('selectedPlayerO');

    for (const player of playersX) {
        let template = document.querySelector('.tmpl-users').content.cloneNode(true);
        let cardElement = template.querySelector('.card');
        let textElement = template.querySelector('.card-title');
        template.querySelector('.card-title').innerText = player.name;  
        template.querySelector('.img-fluid').src = player.thumbnailImg;

        textElement.addEventListener('click', () => {
            selectPlayer(player.name, 'X', cardElement);
        });
        template.querySelector('.btn-danger').addEventListener('click', (e) => {
            e.preventDefault();
            deletePlayer(player.name, 'X');
        });
        if (player.name == selectedPlayerX) {
            cardElement.classList.add('selected');
        }
        contPlayerX.append(template);
    }

    for (const player of playersO) {
        let template = document.querySelector('.tmpl-users').content.cloneNode(true);
        let cardElement = template.querySelector('.card');
        let textElement = template.querySelector('.card-title');
        template.querySelector('.card-title').innerText = player.name;
        template.querySelector('.img-fluid').src =player.thumbnailImg;        
       
        textElement.addEventListener('click', () => {
            selectPlayer(player.name, 'O', cardElement);
        });
        template.querySelector('.btn-danger').addEventListener('click', () => {
            deletePlayer(player.name, 'O');
        });
        if (player.name == selectedPlayerO) {
            cardElement.classList.add('selected');
        }
        contPlayerO.append(template);
    }
    showSelectedPlayer();
}

function selectPlayer(player, role, cardElement) {
    let selectedX = document.querySelector('.sub-cont-player-scroll-x .selected');
    let selectedO = document.querySelector('.sub-cont-player-scroll-o .selected');

    if (role === 'X') {
        if (selectedX) {
            selectedX.classList.remove('selected');
        }
        cardElement.classList.add('selected');
        localStorage.setItem('selectedPlayerX', player);
    } else if (role === 'O') {
        if (selectedO) {
            selectedO.classList.remove('selected');
        }
        cardElement.classList.add('selected');
        localStorage.setItem('selectedPlayerO', player);
    }

    showSelectedPlayer();

}

function deletePlayer(playerName, role) {
    let players = JSON.parse(localStorage.getItem(`player${role}`)) || [];
    players = players.filter(player => player.name !== playerName);
    localStorage.setItem(`player${role}`, JSON.stringify(players));

    if(localStorage.getItem(`selectedPlayer${role}`) === playerName){
        localStorage.setItem(`selectedPlayer${role}`, '');
    }
    showSelectedPlayer();
    loadPlayers();
}

// Redirigir a la página del juego
document.querySelector('.play').addEventListener('submit', (e) => {
    e.preventDefault();
    let selectedX = document.querySelector('.sub-cont-player-scroll-x .selected');
    let selectedO = document.querySelector('.sub-cont-player-scroll-o .selected');

    if (selectedX && selectedO) {
        window.location.href = 'game.html';
    } else {
        Toastify({
            text: "Debe seleccionar 2 juadores",
            backgroundColor: 'red',
            duration: 2000,
            style: {
                fontSize: '2rem'
            }
        }).showToast();
    }
});

function messageAlertForm(mjs){
    Toastify({
        text: mjs,
        backgroundColor: 'red',
        duration: 2000,
        gravity: top,
        style: {
            fontSize: '2rem'
        }
    }).showToast();
    
}

function mjsErrorFech(error){
    Toastify({
        text: error,
        backgroundColor: 'red',
        duration: 2000,
        style: {
            fontSize: '2rem'
        }
    }).showToast();
}

function showSelectedPlayer() {
    let selectPlayerX = localStorage.getItem('selectedPlayerX');
    let selectPlayerO = localStorage.getItem('selectedPlayerO');
    let playerForPlay = document.querySelector('.player-for-play');

    if(selectPlayerX && selectPlayerO) {
        playerForPlay.innerText = `${selectPlayerX} juega contra ${selectPlayerO}`; 
    } else {
        playerForPlay.innerText = '';
    }


}