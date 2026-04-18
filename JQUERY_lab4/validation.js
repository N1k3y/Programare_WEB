
function valideaza(dataStr, format) {
    const dataParts = dataStr.split('/');
    const formatParts = format.split('/');

    // Trebuie să avem exact 3 segmente (zi, lună, an)
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
            // Presupunem că 0-50 reprezintă anii 2000+, iar > 50 reprezintă anii 1900+
            year = val > 50 ? 1900 + val : 2000 + val;
        }
    }

    // Verificări de bază
    if (!day || !month || !year) return 'data invalida';
    if (month < 1 || month > 12) return 'data invalida';

    // Calculăm zilele din luna respectivă (incluzând anii bisecți)
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

        // Construim bulina
        const dot = document.createElement('span');
        dot.style.display = 'inline-block';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.marginLeft = '5px';
        dot.style.verticalAlign = 'middle';
        
        // Construim pop-up-ul de eroare
        const popup = document.createElement('div');
        popup.className = 'error-popup';

        input.parentNode.insertBefore(dot, input.nextSibling);
        input.parentNode.insertBefore(popup, dot.nextSibling);

        // Atașăm o funcție personalizată pe elementul input pentru a o refolosi la Submit
        input.checkValidityState = () => {
            const value = input.value;
            if (value === "") return { isValid: false, msg: "Câmpul este obligatoriu." };

            // 1. Validare USERNAME (litere mici și cifre)
            if (input.id === 'username') {
                if (!/^[a-z0-9]+$/.test(value)) {
                    return { isValid: false, msg: "Doar litere mici și cifre sunt permise." };
                }
            } 
            
            // 2. Validare PAROLĂ
            else if (input.id === 'parola') {
                if (!/[a-z]/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o literă mică." };
                if (!/[A-Z]/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o literă mare." };
                if (!/\d/.test(value)) return { isValid: false, msg: "Adaugă cel puțin o cifră." };
                if (!/!/.test(value)) return { isValid: false, msg: "Adaugă caracterul '!'." };
            } 

            else if (input.id === 'confirmare') {
                // Luăm valoarea din câmpul principal de parolă
                const parolaPrincipala = document.getElementById('parola').value;
                
                if (value !== parolaPrincipala) {
                    return { isValid: false, msg: "Parolele nu coincid." };
                }
            }
            
            // 3. Validare EMAIL
            else if (input.id === 'email') {
                // Verificăm caracterele permise
                if (/[^a-zA-Z0-9_@.]/.test(value)) return { isValid: false, msg: "Sunt permise doar litere, cifre, _, @ și ." };
                // Verificăm să existe exact un @
                const atCount = (value.match(/@/g) || []).length;
                if (atCount !== 1) return { isValid: false, msg: "Trebuie să conțină exact un caracter '@'." };
                // Verificăm să existe minim un punct
                if (!value.includes('.')) return { isValid: false, msg: "Trebuie să conțină cel puțin un punct ('.')." };
            } 
            
            // 4. Validare TELEFON Format: (+40) 777 777 777
            else if (input.id === 'telefon') {
                const regexTelefon = /^\(\+40\) \d{3} \d{3} \d{3}$/;
                if (!regexTelefon.test(value)) return { isValid: false, msg: "Format obligatoriu: (+40) 777 777 777" };
            } 
            
            // 5. Validare DATĂ (Ex: 31/01/2006)
            else if (input.id === 'data_nasterii') {
                // Apelăm funcția calendaristică creată mai sus cu formatul fixat pe zz/ll/aaaa
                const rez = valideaza(value, 'zz/ll/aaaa');
                if (rez === 'data invalida') return { isValid: false, msg: "Data este invalidă sau nu respectă formatul zz/ll/aaaa." };
            }

            // Dacă trece de toate if-urile aferente ID-ului său, e valid
            return { isValid: true, msg: "" };
        };

        const triggerUIUpdate = () => {
            const state = input.checkValidityState();
            
            if (state.isValid) {
                dot.style.backgroundColor = 'green';
                dot.style.boxShadow = '0 0 5px green';
                popup.style.display = 'none';
                input.dataset.valid = "true"; // Salvăm starea pentru momentul de Submit
            } else {
                dot.style.backgroundColor = 'red';
                dot.style.boxShadow = '0 0 5px red';
                input.dataset.valid = "false";
                
                if (input.value !== "") {
                    popup.textContent = state.msg;
                    popup.style.display = 'inline-block';
                } else {
                    popup.style.display = 'none'; // Dacă e gol, lăsăm doar bulina roșie, fără pop-up
                }
            }
        };

        // Evenimente pentru validarea la tastare
        input.addEventListener('input', triggerUIUpdate);
        
        input.addEventListener('blur', () => { popup.style.display = 'none'; });
        input.addEventListener('focus', () => {
            if (input.dataset.valid === "false" && input.value !== "") {
                popup.style.display = 'inline-block';
            }
        });

        // Apelăm o dată pentru starea de start
        triggerUIUpdate();
    });

    // ==========================================
    // VALIDARE GENERALĂ LA SUBMIT
    // ==========================================
    form.addEventListener('submit', function(event) {
        let isFormValid = true;

        inputs.forEach(input => {
            const state = input.checkValidityState();
            if (!state.isValid) {
                isFormValid = false;
                // Forțăm declanșarea evenimentului de input pentru a arăta bulinele/mesajele
                input.dispatchEvent(new Event('input')); 
            }
        });

        if (!isFormValid) {
            // Oprim formularul din a se trimite
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

    // 2. Funcția care construiește opțiunile pentru oraș
    function actualizeazaOrase() {
        // Golim complet dropdown-ul de orașe înainte de a pune altele noi
        orasSelect.innerHTML = '';
        
        // Citim ce județ este selectat în acest moment (ex: 'cluj')
        const judetSelectat = judetSelect.value;
        
        // Luăm lista de orașe corespunzătoare
        const orase = orasePeJudet[judetSelectat];

        // Parcurgem lista și creăm elemente <option> pentru fiecare oraș
        if (orase) {
            orase.forEach(oras => {
                const option = document.createElement('option');
                // Setăm valoarea pe care o va trimite formularul (ex: "cluj_napoca")
                option.value = oras.toLowerCase().replace(/[\s-]/g, '_'); 
                // Setăm textul afișat utilizatorului (ex: "Cluj-Napoca")
                option.textContent = oras;
                
                // Adăugăm opțiunea în <select>-ul de orașe
                orasSelect.appendChild(option);
            });
        }
    }
    judetSelect.addEventListener('change', actualizeazaOrase);

    actualizeazaOrase();
}

function setupTableSorting() {
    // ==========================================
    // 1. Funcțiile de comparare separate
    // ==========================================
    
    // Sortare standard (text)
    const compareAlfabetic = (textA, textB) => {
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
    };

    // Sortare personalizată (ierarhie medalii)
    const compareMedalii = (textA, textB) => {
        const ierarhie = {
            "aur": 1,
            "argint": 2,
            "bronz": 3,
            "mențiune": 4
        };
        
        // Dacă textul nu este în ierarhie, primește rangul 99 (merge la final)
        const rangA = ierarhie[textA] || 99;
        const rangB = ierarhie[textB] || 99;
        
        if (rangA < rangB) return -1;
        if (rangA > rangB) return 1;
        return 0;
    };
    
    // Căutăm absolut TOATE tabelele din pagină care au clasa "styled-table"
    const tables = document.querySelectorAll('.styled-table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        const tbody = table.querySelector('tbody');

        // Adăugăm funcționalitate de click pe fiecare celulă din Antet (<th>)
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                
                // --- Gestiunea direcției și a claselor (Săgețile) ---
                const isCurrentlyAscending = header.classList.contains('sort-asc');
                const sortDirection = isCurrentlyAscending ? -1 : 1; // 1 pentru crescător, -1 pentru descrescător

                // Ștergem clasele de sortare de pe TOATE coloanele
                headers.forEach(th => {
                    th.classList.remove('sort-asc', 'sort-desc');
                });

                // Adăugăm clasa pe coloana apăsată
                if (isCurrentlyAscending) {
                    header.classList.add('sort-desc');
                } else {
                    header.classList.add('sort-asc');
                }

                // --- Alegerea funcției de sortare ---
                const tipSortare = header.getAttribute('data-sort-type');
                let functieComparare = compareAlfabetic; // Implicit e alfabetic

                if (tipSortare === 'medalie') {
                    functieComparare = compareMedalii;
                }

                // --- Sortarea efectivă ---
                const rows = Array.from(tbody.querySelectorAll('tr'));

                rows.sort((rowA, rowB) => {
                    const textA = rowA.children[index].textContent.trim().toLowerCase();
                    const textB = rowB.children[index].textContent.trim().toLowerCase();

                    // Folosim funcția aleasă dinamic și o înmulțim cu direcția
                    return functieComparare(textA, textB) * sortDirection;
                });

                // Introducem rândurile sortate înapoi în tabel
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}

// Apelăm funcția când se încarcă documentul
document.addEventListener('DOMContentLoaded', setupTableSorting);
document.addEventListener('DOMContentLoaded', setupDropdowns);
document.addEventListener('DOMContentLoaded', setupValidation);