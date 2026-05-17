
function valideaza(dataStr, format) {
    const dataParts = dataStr.split('/');
    const formatParts = format.split('/');

    if (dataParts.length !== 3 || formatParts.length !== 3) return 'data invalida';

    let day, month, year;

    for (let i = 0; i < 3; i++) {
        const val = parseInt(dataParts[i], 10);
        const fmt = formatParts[i].toLowerCase();

        if (isNaN(val)) return 'data invalida';

        if (fmt === 'zz') day = val;
        else if (fmt === 'll') month = val;
        else if (fmt === 'aaaa') year = val;
        else if (fmt === 'aa') {
            year = val > 50 ? 1900 + val : 2000 + val;
        }
    }

    if (!day || !month || !year) return 'data invalida';
    if (month < 1 || month > 12) return 'data invalida';

    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day < 1 || day > daysInMonth[month - 1]) return 'data invalida';

    return 'data valida';
}

function setupValidation() {
    const form = document.querySelector('form');
    
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], input[type="tel"]');

    inputs.forEach(input => {
        input.parentNode.style.position = 'relative';

        const dot = document.createElement('span');
        dot.style.display = 'inline-block';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.marginLeft = '5px';
        dot.style.verticalAlign = 'middle';
        
        const popup = document.createElement('div');
        popup.className = 'error-popup';

        input.parentNode.insertBefore(dot, input.nextSibling);
        input.parentNode.insertBefore(popup, dot.nextSibling);

        input.checkValidityState = () => {
            const value = input.value;
            if (value === "") return { isValid: false, msg: "Câmpul este obligatoriu." };

            if (input.id === 'nume' || input.id === 'prenume') {
                if (!/^[a-z0-9]+$/.test(value)) {
                    return { isValid: false, msg: "Doar litere mici și cifre sunt permise." };
                }
            } 

            
            else if (input.id === 'parola') {
                if (!/[a-z]/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o literă mică." };
                if (!/[A-Z]/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o literă mare." };
                if (!/\d/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o cifră." };
                if (!/!/.test(value)) return { isValid: false, msg: "Adaugă caracterul '!'." };
            } 

            else if (input.id === 'confirmare') {
                const parolaPrincipala = document.getElementById('parola').value;
                
                if (value !== parolaPrincipala) {
                    return { isValid: false, msg: "Parolele nu coincid." };
                }
            }

            else if (input.id === 'email') {
               
                if (/[^a-zA-Z0-9_@.]/.test(value)) return { isValid: false, msg: "Sunt permise doar litere, cifre, _, @ și ." };
                const atCount = (value.match(/@/g) || []).length;
                if (atCount !== 1) return { isValid: false, msg: "Trebuie să conțină exact un caracter '@'." };
                if (!value.includes('.')) return { isValid: false, msg: "Trebuie să conțină cel puțin un punct ('.')." };
            } 
            
            else if (input.id === 'telefon') {
                const regexTelefon = /^\(\+40\) \d{3} \d{3} \d{3}$/;
                if (!regexTelefon.test(value)) return { isValid: false, msg: "Format obligatoriu: (+40) 777 777 777" };
            } 
            
            
            else if (input.id === 'data_nasterii') {
                                const rez = valideaza(value, 'zz/ll/aaaa');
                if (rez === 'data invalida') return { isValid: false, msg: "Data este invalidă sau nu respectă formatul zz/ll/aaaa." };
            }

          
            return { isValid: true, msg: "" };
        };

        const triggerUIUpdate = () => {
            const state = input.checkValidityState();
            
            if (state.isValid) {
                dot.style.backgroundColor = 'green';
                dot.style.boxShadow = '0 0 5px green';
                popup.style.display = 'none';
                input.dataset.valid = "true"; 
            } else {
                dot.style.backgroundColor = 'red';
                dot.style.boxShadow = '0 0 5px red';
                input.dataset.valid = "false";
                
                if (input.value !== "") {
                    popup.textContent = state.msg;
                    popup.style.display = 'inline-block';
                } else {
                    popup.style.display = 'none'; 
                }
            }
        };

        input.addEventListener('input', triggerUIUpdate);
        
        input.addEventListener('blur', () => { popup.style.display = 'none'; });
        input.addEventListener('focus', () => {
            if (input.dataset.valid === "false" && input.value !== "") {
                popup.style.display = 'inline-block';
            }
        });

        triggerUIUpdate();
    });

    form.addEventListener('submit', function(event) {
        let isFormValid = true;

        inputs.forEach(input => {
            const state = input.checkValidityState();
            if (!state.isValid) {
                isFormValid = false;
                input.dispatchEvent(new Event('input')); 
            }
        });

        if (!isFormValid) {
            event.preventDefault(); 
            alert('Formularul conține erori! Te rugăm să verifici câmpurile cu bulină roșie.');
        }
    });
}

function setupDropdowns() {
    const judetSelect = document.getElementById('judet');
    const orasSelect = document.getElementById('oras');

    const orasePeJudet = {
        cluj: ['Cluj-Napoca', 'Turda', 'Dej', 'Câmpia Turzii'],
        timis: ['Timișoara', 'Lugoj', 'Sânnicolau Mare', 'Jimbolia'],
        iasi: ['Iași', 'Pașcani', 'Hârlău', 'Târgu Frumos']
    };

    function actualizeazaOrase() {
        orasSelect.innerHTML = '';
        

        const judetSelectat = judetSelect.value;
        
        const orase = orasePeJudet[judetSelectat];

        if (orase) {
            orase.forEach(oras => {
                const option = document.createElement('option');
                option.value = oras.toLowerCase().replace(/[\s-]/g, '_'); 
               
                option.textContent = oras;
                
             
                orasSelect.appendChild(option);
            });
        }
    }
    judetSelect.addEventListener('change', actualizeazaOrase);

    actualizeazaOrase();
}

function setupTableSorting() {
    
    const compareAlfabetic = (textA, textB) => {
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
    };

    const compareMedalii = (textA, textB) => {
        const ierarhie = {
            "aur": 1,
            "argint": 2,
            "bronz": 3,
            "mențiune": 4
        };
        
        // dacă textul nu este în ierarhie, primește rangul 99 (merge la final)
        const rangA = ierarhie[textA] || 99;
        const rangB = ierarhie[textB] || 99;
        
        if (rangA < rangB) return -1;
        if (rangA > rangB) return 1;
        return 0;
    };
    
    const tables = document.querySelectorAll('.styled-table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        const tbody = table.querySelector('tbody');

        // functionalitatea de click
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                
                const isCurrentlyAscending = header.classList.contains('sort-asc');
                const sortDirection = isCurrentlyAscending ? -1 : 1; // 1 pentru crescător, -1 pentru descrescător

                // stergem clasele de sortare de pe TOATE coloanele
                headers.forEach(th => {
                    th.classList.remove('sort-asc', 'sort-desc');
                });

                // adaugam clasa pe coloana apăsată
                if (isCurrentlyAscending) {
                    header.classList.add('sort-desc');
                } else {
                    header.classList.add('sort-asc');
                }

                const tipSortare = header.getAttribute('data-sort-type');
                let functieComparare = compareAlfabetic; // Implicit e alfabetic

                if (tipSortare === 'medalie') {
                    functieComparare = compareMedalii;
                }

                const rows = Array.from(tbody.querySelectorAll('tr'));

                rows.sort((rowA, rowB) => {
                    const textA = rowA.children[index].textContent.trim().toLowerCase();
                    const textB = rowB.children[index].textContent.trim().toLowerCase();

                    // folosim functia aleasa
                    return functieComparare(textA, textB) * sortDirection;
                });

                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}
function setupMedalSelection() {
    const table = document.querySelector('.styled-table');
    if (!table) return;

    let summaryDiv = document.getElementById('rezultat-medalii');
    if (!summaryDiv) {
        summaryDiv = document.createElement('div');
        summaryDiv.id = 'rezultat-medalii';
        summaryDiv.style.marginTop = '15px';
        summaryDiv.style.padding = '10px';
        summaryDiv.style.backgroundColor = '#e9ecef';
        summaryDiv.style.borderLeft = '5px solid #1e3c72';
        summaryDiv.style.fontWeight = 'bold';
        summaryDiv.style.color = '#333';
        summaryDiv.style.display = 'none'; 
        
        table.parentNode.insertBefore(summaryDiv, table.nextSibling);
    }

    const badges = table.querySelectorAll('tbody .badge');

    badges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.stopPropagation();

            const medaliaSelectata = this.textContent.trim().toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            let counter = 0; 
            let numeEleviGasiti = []; 

            rows.forEach(row => {
                const celulaMedalie = row.querySelector('td:nth-child(3)');
                if (!celulaMedalie) return;

                const textMedalie = celulaMedalie.textContent.trim().toLowerCase();

                if (textMedalie === medaliaSelectata) {
                    row.classList.add('rand-selectat');
                    counter++;
                    
                    const numeElev = row.querySelector('td:nth-child(1) strong');
                    if (numeElev) {
                        numeEleviGasiti.push(numeElev.textContent.trim());
                    }
                } else {
                    row.classList.remove('rand-selectat');
                }
            });

            summaryDiv.style.display = 'block';
            const numeMedalieFormatat = medaliaSelectata.charAt(0).toUpperCase() + medaliaSelectata.slice(1);
            
            let mesajHTML = "";
            
            if (counter === 1) {
                mesajHTML = `A fost găsit <strong>1</strong> participant cu medalia de <strong>${numeMedalieFormatat}</strong>`;
            } else {
                mesajHTML = `Au fost găsiți <strong>${counter}</strong> participanți cu medalia de <strong>${numeMedalieFormatat}</strong>`;
            }

            if (numeEleviGasiti.length > 0) {
                mesajHTML += `: <span style="color: #1e3c72;">${numeEleviGasiti.join(', ')}</span>.`;
            } else {
                mesajHTML += `.`;
            }

            summaryDiv.innerHTML = mesajHTML;
        });
    });
}
document.addEventListener('DOMContentLoaded', setupMedalSelection);

document.addEventListener('DOMContentLoaded', setupTableSorting);
document.addEventListener('DOMContentLoaded', setupDropdowns);
document.addEventListener('DOMContentLoaded', setupValidation);