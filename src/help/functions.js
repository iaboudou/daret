// function take a start date then it return the next tour  based on periodicite
export function getNextDate(start, etat) {
    let date = new Date(start || etat.circle.date_start);
    switch (etat.circle.periodicite) {
        case 'hebdomadaire':
            date.setDate(date.getDate() + 7);
            break;
        case 'quinzaine':
            date.setDate(date.getDate() + 15);
            break;
        case 'mensuelle':
            date.setMonth(date.getMonth() + 1);
            break;
    }
    etat.circle.date_end = date;
    return date;
}

export function formatDate(date) {
    if (!date) return '';
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

export function showDialog(etat, participantID) {
    let ind = etat.circle.participants.findIndex(({ id }) => id === participantID)
    let ben = etat.circle.participants[ind]
    let otherParticipants = document.getElementById('detail-contributeurs')
    otherParticipants.innerHTML = ''

    document.getElementById('detail-titre').textContent = `tour N° ${ind + 1}`
    document.getElementById('detail-date').textContent = formatDate(etat.circle.dates_tour[ind])
    document.getElementById('detail-beneficiaire').textContent = ben.nom
    document.getElementById('detail-montant').textContent = `${Number(etat.circle.cotisation) * etat.circle.participants.length} MAD`

    etat.circle.participants.forEach((par, index) => {
        if (index === ind) return
        let otherp = document.createElement('li')
        otherp.textContent = par.nom
        otherParticipants.append(otherp)
    })

    document.getElementById('detail-tour').showModal()
}


export function getDetails(etat, buttonType) {
    if (buttonType == "random") {
        let e = structuredClone(etat)
        for (let i = e.circle.participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [e.circle.participants[i], e.circle.participants[j]] = [e.circle.participants[j], e.circle.participants[i]];
        }
        openDetails(e, etat)
        return
    }
    openDetails(etat)
}

// it  show up the tour informations
export function openDetails(etat, originalEtat = etat) {
    let c = document.getElementById('calendrier-corps');
    c.innerHTML = '';

    for (let i = 0; i < etat.circle.participants.length; i++) {
        let participant = etat.circle.participants[i]
        let tr = document.createElement('tr')
        tr.classList.add('line-tour', 'h-[50px]')

        // id
        let ind = document.createElement('td');
        ind.textContent = i + 1;
        tr.appendChild(ind)

        // date
        let date = document.createElement('td')
        date.textContent = formatDate(etat.circle.dates_tour[i])
        tr.appendChild(date)

        // name
        let ben = document.createElement('td')
        let ben_btn = document.createElement('button')
        ben_btn.type = 'button'
        ben_btn.classList.add("bg-gray-300")
        ben_btn.textContent = participant.nom
        ben_btn.addEventListener('click', () => showDialog(etat, participant.id))
        ben.appendChild(ben_btn)
        tr.appendChild(ben)


        // person cotisation
        let cot = document.createElement('td')
        cot.textContent = etat.circle.cotisation
        tr.appendChild(cot)

        // status
        let status = document.createElement('td')
        status.classList.add("w-[200px]")
        let wrap = document.createElement('div')
        wrap.classList.add("flex", "justify-center", "items-center")

        let div = document.createElement('div')
        div.classList.add("etiquette-statut", "w-1/2")
        div.textContent = participant.termine ? "terminé" : "à venir"

        let div2 = document.createElement("div")

        div2.classList.add("w-1/2")
        let pressDone = document.createElement('button')
        pressDone.type = "button"
        pressDone.classList.add("w-[120px]", "h-[40px]", "p-2", "bg-blue-500", "text-xs", "rounded-lg", "font-semibold", "text-white", "cursor-pointer", "flex", "justify-center", "items-center")
        pressDone.textContent = participant.termine ? "annuller" : "marqué comme terminé"

        pressDone.addEventListener('click', () => {
            let participantSource = originalEtat.circle.participants.find(({ nom }) => nom === participant.nom)
            if (div.textContent === "à venir") {
                div.textContent = "terminé"
                pressDone.textContent = "annuller"
                participant.termine = true
                if (participantSource) participantSource.termine = true
            } else if (div.textContent === "terminé") {
                div.textContent = "à venir"
                pressDone.textContent = "marqué comme terminé"
                participant.termine = false
                if (participantSource) participantSource.termine = false
            }
            updateTourProgress(etat)
        });
        div2.append(pressDone)
        wrap.append(div, div2)
        status.append(wrap)
        tr.append(status)

        c.appendChild(tr)
    }

    updateTourProgress(etat, originalEtat)
}

// update the progress of the tour when its updated
function updateTourProgress(etat) {
    document.getElementById('compteur-tours').textContent = `${etat.circle.participants.filter((p) => p.termine).length} tours terminés sur ${etat.circle.participants.length}`
}