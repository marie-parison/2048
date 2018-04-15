$.fn._2048 = function(){

var table;
var score = 0;

$(document).ready(function() {
    createHeader();
    createElementGrid();
    initialize_game();

    // Réinitialise le jeu lorsqu'on clique sur le bouton Reset game
    $('button').click(function() {
        initialize_game();
        resetScore();
     });
});

// Annule les commandes initiales des touches haut, bas, droite, gauche
window.addEventListener("keydown",function (e) {
    if ([37,38,39,40].indexOf(e.keyCode)> -1){
        e.preventDefault();
    }
 },false);

 // Appelle la fonction correspondante à la direction saisie au clavier
 $(document).keydown(function(e){

     if (e.which === 37) {
         move_left = move_toLeft();
     }
     else if (e.which === 38) {
         move_top = move_toTop();
     }
     else if (e.which === 39) {
         move_right = move_toRight();
     }
     else if (e.which === 40) {
         move_bottom = move_toBottom();
     }
 });

 // Effectue l'action correspondante à l'état de la partie
 function gameStatus(merged){

    if(is_lost()){
        displayGrid();
        loose();
    } else if (!is_won()){
        if(inArray(0) && merged == true)
            setTile();
        displayGrid();
    }
 }

 // Retourne true si la valeur passée en paramètre est trouvée dans table
 function inArray(value){

    for(i=0; i < 4; i ++){
        if($.inArray(value, table[i]) != -1)
            return true;
    }
    return false;
 }

 // Crée la grille vide
function createElementGrid() {
    var htmlstr = '<div class="game-container"><div class="grid-container">';
    for (var i = 0; i < 4; i++) {
        htmlstr += '<div class="grid-row">';
        for (var j = 0; j < 4; j++) {
            htmlstr +="<div class='grid-element'></div>";
        }
        htmlstr += '</div>';
    }
    htmlstr += '</div></div>';
    $('body').append(htmlstr);
}

// (Ré)Initialise le jeu
function initialize_game(){

    table = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    setTile();
    setTile();
    displayGrid();
}

// Si il n'y a plus de place dans la grille, vérifie qu'il y a encore des mouvements possibles
function is_lost(){

    if(inArray(0))
        return false;
    
    for(i=0; i < 4; i++){
        for(j=0; j < 3; j++){
            if((i < 3 && (table[i][j] == table[i+1][j])) || table[i][j] == table[i][j+1])
                return false;
        }
    }
    return true;
}

// Informe le joueur de sa défaite et permet de réinitialiser le jeu
function loose(){
    if(confirm("You loose, Press OK to start a new game")){
        initialize_game();
        resetScore();
    };
}

// Vérifie s'il existe une case 2048 et permet de reinitialiser le jeu; retourne false si il n'y en a pas
function is_won(){

    if(inArray(2048)){
        if(confirm("You win ! Press OK to start a new game") == true){
            initialize_game();
            resetScore();
        }
    } else {
        return false;
    }
}

// Déplace et additionne les cases en haut
function move_toTop()
{   
    shift_top();
    var merged = merge_top();
    shift_top();
    gameStatus(merged);
}

// Décale les cases vers le haut
function shift_top(){

    for(i = 0; i < 4; i++){
        for(var col = 0; col < 4; col++){
            for(var row = 0; row < 3; row++){
                if((table[row][col] == 0)){
                    table[row][col] = table[row+1][col];
                    table[row+1][col] = 0;
                }
            }
        }
    }
}

// Additionne deux à deux les cases égales de bas en haut
function merge_top(){

    var merged = false;

    for(var col = 0; col < 4; col++){
        for(var row = 0; row < 3; row++){
            if (table[row][col] == table[row+1][col]){
                table[row][col] = table[row][col] + table[row+1][col];
                table[row+1][col] = 0;
                merged = true;
                addToScore(table[row][col]);
            }
        }
    }

    return merged;
}

// Déplace et additionne les cases en bas
function move_toBottom()
{   
    shift_bottom();
    var merged = merge_bottom();
    shift_bottom();
    gameStatus(merged);
}

// Décale les cases vers le bas
function shift_bottom(){
     
    for(i = 0; i < 4; i++){
        for(var col = 3; col >= 0; col--){
            for(var row = 3; row > 0; row--){
                if((table[row][col] === 0)){
                    table[row][col] = table[row-1][col];
                    table[row-1][col] = 0;
                }
            }
        }
    }
}

//Additionne deux à deux les cases égales de haut en bas
function merge_bottom(){

    var merged = false;

    for(var col = 3; col >= 0; col--){
        for(var row = 3; row > 0; row--){

            if (table[row][col] === table[row-1][col]){
                table[row][col] = table[row][col] + table[row-1][col];
                table[row-1][col] = 0;
                merged = true;
                addToScore(table[row][col]);
            }
        }
    }

    return merged;
}

// Déplace et additionne les cases à droite
function move_toRight(){

    shift_right()
    var merged = merge_right();
    shift_right()
    gameStatus(merged);
}

// Décale les cases à droite
function shift_right(){

    for(i = 0; i < 4; i++){
        for(var row = 3; row >= 0; row--){
            for(var col = 3; col > 0; col--){
                if((table[row][col] === 0)){
                    table[row][col] = table[row][col-1];
                    table[row][col-1] = 0;
                }
            }
        }
    }
}

// Additionne deux à deux les cases égales de gauche à droite
function merge_right(){

    var merged = false;

    for(var row = 3; row >= 0; row--){
        for(var col = 3; col > 0; col--){            
            if (table[row][col] === table[row][col-1]){
                table[row][col] = table[row][col] + table[row][col-1];
                table[row][col-1] = 0;
                merged = true;
                addToScore(table[row][col]);
            }
        }
    }
    
    return merged;
}

// Déplace et additionne les cases à gauche
function move_toLeft(){
    
    shift_left();
    var merged = merge_left();
    shift_left();  
    gameStatus(merged);
}

// Additionne deux à deux les cases égales de droite à gauche
function merge_left(){
    
    var merged = false;

    for(var row = 0; row < 4; row++){
        for(var col = 0; col < 3; col++){

            if (table[row][col] === table[row][col+1]){
                table[row][col] = table[row][col] + table[row][col+1];
                table[row][col+1] = 0;
                merged = true;
                addToScore(table[row][col]);
            }
        }
    }

    return merged;
}

// Décale les cases à gauche
function shift_left(){

    for(i = 0; i < 4; i++){
        for(var row = 0; row < 4; row++){
            for(var col = 0; col < 3; col++){                    
                if((table[row][col] === 0)){
                    table[row][col] = table[row][col+1];
                    table[row][col+1] = 0;
                }
            }
        }
    }
}

// Créée le header
function createHeader(){
    var htmlstr = "<header><h1>2048</h1><p id='score'>Score : " + score + "</p><button>Reset game</button><header>"
    $('body').append(htmlstr);
}

// Reset le score
function resetScore(){
    score = 0;
    displayScore();
}

// Affiche le score
function displayScore(){
    $('#score').replaceWith("<p id='score'>Score : " + score + "</p>");
}

//Incremente le score
function addToScore(number){
    score += number;
}

// Affiche les cases sur la grille
function displayGrid() {

    displayScore();

    for (var i = 0; i < 4; i++) {
        var row = $('.grid-container').children()[i];
        for (var j = 0; j < 4; j++) {
            if(table[i][j] != 0){
                $(row).children()[j].innerText = table[i][j];
            } else {
                $(row).children()[j].innerText = "";
            }
            defClass(i, j)
        }
    }
}

// Attribue une class CSS à la div grid-element en fonction de son contenu
function defClass(i, j){

    var row = $('.grid-container').children()[i];

    switch(table[i][j]){
        case 0:
            $(row).children()[j].setAttribute("class", "grid-element");
            break;
        case 2:
            $(row).children()[j].setAttribute("class", "grid-element tile-2");
            break;
        case 4:
            $(row).children()[j].setAttribute("class", "grid-element tile-4");
            break;
        case 8:
            $(row).children()[j].setAttribute("class", "grid-element tile-8");
            break;
        case 16:
            $(row).children()[j].setAttribute("class", "grid-element tile-16");
            break;
        case 32:
            $(row).children()[j].setAttribute("class", "grid-element tile-32");
            break;
        case 64:
            $(row).children()[j].setAttribute("class", "grid-element tile-64");
            break;
        case 128:
            $(row).children()[j].setAttribute("class", "grid-element tile-128");
            break;
        case 256:
            $(row).children()[j].setAttribute("class", "grid-element tile-256");
            break;
        case 512:
            $(row).children()[j].setAttribute("class", "grid-element tile-512");
            break;
        case 1024:
            $(row).children()[j].setAttribute("class", "grid-element tile-1024");
            break;
        case 2048:
            $(row).children()[j].setAttribute("class", "grid-element tile-2048");
            break;
    }

}

// Cherche et renvoie la position des cases vides dans la grille
function find_empty_grids(){

    var empty_grids = new Array();

    for(var row = 0; row < 4; row++){
        for(var col = 0; col < 4; col++){
            if(table[row][col] === 0){
                empty_grids.push([row, col]);
            }
        }
    }
    return empty_grids;
}

// Génère aléatoirement un 2 (90%) ou un 4 (10%)
function getRandomInt(){

    var random = Math.floor(Math.random() * (11 - 1));

    if(random !== 4)
    random = 2;
    
    return random;
}

// Place une nouvelle case sur la grille
function setTile(){

    var empty_grids = find_empty_grids();
    var random_position = Math.floor(Math.random() * (empty_grids.length - 0));

    var row = empty_grids[random_position][0];
    var col = empty_grids[random_position][1];

    table[row][col] = getRandomInt();
}

}(jQuery);