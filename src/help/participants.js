import { validateName, nameAlreadyExists } from './validate.js';
import { etat } from './config.js';

// add new participant to participants
export function addParticipant(nom) {

    if (!validateName(nom)) return
    if (nameAlreadyExists(nom)) return

    etat.circle.participants.push({ nom: nom.trim(), termine: false });
}

// create participant input field
export function createChampParticipant() {
    let li = document.createElement('li');
    li.classList.add("flex", "gap-2", "h-[30px]")
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'nom et prénom';
    input.classList.add('participant-input', 'w-full', 'rounded', 'border', 'border-daret-bordure', 'px-3', 'py-2');

    let b = document.createElement("button")
    b.classList.add("btns-delete-participant")
    b.type = "button"
    b.id = etat.circle.id
    etat.circle.id++

    b.classList.add("bg-daret-vert", "text-white", "text-bold", "p-[5px]", "rounded-lg", "cursor-pointer")
    b.textContent = "annulé"
    li.append(input, b);
    etat.circle.nbr_participants++
    document.getElementById("participants-compteur").textContent = etat.circle.nbr_participants + "participant"

    return li;
}