import { createChampParticipant } from './participants.js'
import { etat } from './config.js'
import { getDetails, formatDate, getNextDate } from './functions.js';
import { reset, resetErrors } from './resrart.js';
import { validateName, validateCotisation, validatePeriodicite, validateDateDebut, nameAlreadyExists } from './validate.js';

export function init() {

  // immediatly add 3 participant input fields
  let participants = document.getElementById('participants-liste');
  document.getElementById("participants-compteur").textContent = etat.circle.nbr_participants + "participant"
  for (let i = 0; i < 2; i++) {
    participants.append(createChampParticipant());
  }

  participants.addEventListener("click", (e) => {
    e.preventDefault()
    if (e.target.type == "button" && etat.circle.nbr_participants >= 3) {
      e.target.parentElement.remove()
      etat.circle.nbr_participants--
      document.getElementById("participants-compteur").textContent = etat.circle.nbr_participants + "participant"
    }
  })

  // when the user click on 'add participant' button, add new input field ------------------------------
  document.getElementById('ajouter-participant').addEventListener('click', (e) => {
    e.preventDefault()
    resetErrors()

    if (etat.circle.nbr_participants >= 20) {
      document.getElementById('participants-erreur').textContent = 'vous pouvez pas avoir plus de 20 participants'
      return
    }

    participants.append(createChampParticipant())
  })

  // if the user click on 'generer' button, show the result section ------------------------------------
  document.getElementById('generer').addEventListener('click', (e) => {
    e.preventDefault()
    resetErrors()

    // name
    etat.circle.nom = document.getElementById('nom-cercle').value
    if (!validateName(etat.circle.nom)) {
      let err = document.getElementById('nom-cercle-erreur')
      err.classList.remove("hidden")
      err.textContent = 'le nom n\'est pas valide'
      return
    }

    // cotisation:
    etat.circle.cotisation = document.getElementById('cotisation').value
    if (!validateCotisation(etat.circle.cotisation)) {
      let err = document.getElementById('cotisation-erreur')
      err.classList.remove("hidden")
      err.textContent = 'cotisation doit être un nombre entre 100 et 50000'
      return
    }

    // periodicite
    etat.circle.periodicite = document.getElementById('periodicite').value
    if (!validatePeriodicite(etat.circle.periodicite)) {
      let err = document.getElementById('periodicite-erreur')
      err.classList.remove("hidden")
      err.textContent = 'sélectionner une périodicité valide'
      return
    }

    // date
    etat.circle.date_start = new Date(document.getElementById('date-debut').value)
    let [isvalid, msg] = validateDateDebut(document.getElementById('date-debut').value)

    if (!isvalid) {
      let err = document.getElementById('date-debut-erreur')
      err.classList.remove("hidden")
      err.textContent = msg
      return
    }

    // participants
    let par = document.querySelectorAll('.participant-input')
    etat.circle.participants = []
    for (let val of par) {
      if (val.value.trim() === '') {
        let err = document.getElementById('participants-erreur')
        err.classList.remove('hidden')
        err.textContent = 'vous lessez un champ vide'
        return
      }

      if (!validateName(val.value.trim())) {
        let err = document.getElementById('participants-erreur')
        err.classList.remove('hidden')
        err.textContent = 'les nom doit contient que les characters, nombres, et dois etre entre 3 et 40 chars'
        return
      }

      if (nameAlreadyExists(val.value.trim())) {
        let err = document.getElementById('participants-erreur')
        err.classList.remove('hidden')
        err.textContent = "y a des noms doublon"
        return
      }

      etat.circle.participants.push(val.value.trim())
    }


    // if all passed, show result
    document.getElementById('contenu-resultat').classList.remove('hidden')
    document.getElementById('etat-vide').classList.add('hidden')

    // save the tour dates
    etat.circle.dates_tour = []
    let dat = new Date(etat.circle.date_start)
    etat.circle.participants.forEach(() => {
      etat.circle.dates_tour.push(new Date(dat))
      dat = getNextDate(dat, etat)
    })

    // show cotiastion total
    document.getElementById('resume-cagnotte').textContent = etat.circle.cotisation * etat.circle.nbr_participants

    // show person cotisation
    document.getElementById('resume-total-cycle').textContent = etat.circle.cotisation * etat.circle.nbr_participants

    // show number of participants
    document.getElementById('resume-nb-tours').textContent = etat.circle.nbr_participants

    // add the dates to the resume section
    let t1 = document.createElement('h3')
    t1.textContent = `Debut: ${formatDate(etat.circle.date_start)}`

    let t2 = document.createElement('h3')
    let lastDate = etat.circle.dates_tour[etat.circle.dates_tour.length - 1]
    t2.textContent = `Fin: ${formatDate(lastDate)}`
    let d = document.getElementById('resume-dates')
    d.innerHTML = ''
    d.append(t1, t2)

    reset()
    getDetails(etat)




    // if the user click on ordre-saisie ----------------------------------------------
    document.getElementById("ordre-saisie").addEventListener("click", (e) => {
      e.preventDefault()
      getDetails(etat)
    })


    // if the user click on Tirer l'ordre au sort -------------------------------------
    document.getElementById("tirage-au-sort").addEventListener("click", (e) => {
      e.preventDefault()
      getDetails(etat, "random")
    })

  })
}
