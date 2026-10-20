
// the name shouold be between 3 and 40 chars
export function validateName(name) {
    if (typeof name !== 'string') return false;
    return /^[a-zA-Z0-9_]{3,40}$/.test(name.trim());
}

// cotisation should be a number between 100 and 50000
export function validateCotisation(value) {
    if ((value === '' || value === null || value === undefined)
        || (!(/^[0-9]+$/).test(value))
    ) {
        return false;
    }
    let nombre = Number(value)
    return nombre >= 100 && nombre <= 50000;
}


export function validatePeriodicite(value) {
    return ['hebdomadaire', 'quinzaine', 'mensuelle'].includes(value);
}


// validate the beginning date of the circle
export function validateDateDebut(value) {
    if (value === '' || value === null || value === undefined) return false;

    let now = new Date()
    let date = new Date(value);

    now.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    return !Number.isNaN(date) && now <= date;
}

// check if the user is already in the circle
export function isUserAlreadyInCircle(name, liste) {
    return liste.some((prenom) => prenom.trim().toLowerCase() == name.trim().toLowerCase());
}
