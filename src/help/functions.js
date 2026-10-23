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


export function getDetails(etat, buttonType) {
    if (buttonType == "random") {
        let e = structuredClone(etat)
        for (let i = e.circle.participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [e.circle.participants[i], e.circle.participants[j]] = [e.circle.participants[j], e.circle.participants[i]];
        }
        openDetails(e)
        return
    }
    openDetails(etat)
}

// it  show up the tour informations
export function openDetails(etat) {
    let c = document.getElementById('calendrier-corps');
    c.innerHTML = '';

    for (let i = 0; i < etat.circle.participants.length; i++) {
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
        ben.textContent = etat.circle.participants[i]
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
        div.textContent = "à venir"

        let div2 = document.createElement("div")

        div2.classList.add("w-1/2")
        let pressDone = document.createElement('button')
        pressDone.type = "button"
        pressDone.classList.add("w-[120px]", "h-[40px]", "p-2", "bg-blue-500", "text-xs", "rounded-lg", "font-semibold", "text-white", "cursor-pointer", "flex", "justify-center", "items-center")
        pressDone.textContent = "marqué comme terminé"

        pressDone.addEventListener('click', () => {
            if (div.textContent === "à venir") {
                div.textContent = "terminé";
                pressDone.textContent = "annuller";
                if (etat.termines) etat.termines.add(i + 1);
            } else if (div.textContent == "terminé") {
                pressDone.textContent = "marqué comme terminé";
                div.textContent = "à venir"
                if (etat.termines) etat.termines.add(i - 1);
            }
        });
        div2.append(pressDone)
        wrap.append(div, div2)
        status.append(wrap)
        tr.append(status)

        c.appendChild(tr)
    }

}