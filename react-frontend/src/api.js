export function getFirebase() {
    return fetch('/firebase');
}

export function addWord(word) {
    return fetch('/addWord?gameId=-Ll2kMaVAN7LeHFGpO8f&word=' + word);
}