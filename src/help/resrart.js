export function reset() {
    const form = document.getElementById('daret-form');
    if (form) {
        form.reset();
    }
}

// reset input's feilds in case of validating it
export function resetErrors() {
    let eror_nom = document.getElementById('nom-cercle-erreur')
    if (!eror_nom.classList.contains("hidden")) {
        eror_nom.classList.add("hidden")
    }

    let cotisationErreur = document.getElementById('cotisation-erreur')
    if (!cotisationErreur.classList.contains("hidden")) {
        cotisationErreur.classList.add("hidden")
    }

    let periodiciteErreur = document.getElementById('periodicite-erreur')
    if (!periodiciteErreur.classList.contains("hidden")) {
        periodiciteErreur.classList.add("hidden")
    }

    let dateErreur = document.getElementById('date-debut-erreur')
    if (!dateErreur.classList.contains("hidden")) {
        dateErreur.classList.add("hidden")
    }

    let participantsErreur = document.getElementById('participants-erreur')
    if (!participantsErreur.classList.contains("hidden")) {
        participantsErreur.classList.add("hidden")
    }
}