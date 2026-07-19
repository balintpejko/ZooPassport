const zooData = {
            id: 'nyiregyhaza',
            name: 'Nyíregyházi Állatpark',
            regions: [
                {
                    id: 'sarkvidek',
                    name: 'Sarkvidék',
                    icon: 'fa-snowflake',
                    color: 'from-sky-500 to-blue-600',
                    items: [
                        { id: 'sv_1', type: 'checkbox', label: 'Láttam a jegesmedvét úszni' },
                        { id: 'sv_2', type: 'checkbox', label: 'Megnéztem a kaliforniai oroszlánfókák tréningjét' },
                        { id: 'sv_3', type: 'photo', label: 'Fotó a Humboldt-pingvinekről', placeholder: 'Kattints kép feltöltéséhez' },
                        { id: 'sv_4', type: 'text', label: 'Milyen volt a hangulat a Sarkvidéken?', placeholder: 'Írd le az élményed ide...' }
                    ]
                },
                {
                    id: 'zold_piramis',
                    name: 'Zöld Piramis',
                    icon: 'fa-tree',
                    color: 'from-emerald-500 to-teal-600',
                    items: [
                        { id: 'zp_1', type: 'checkbox', label: 'Átsétáltam az Óceanárium üvegalagútján' },
                        { id: 'zp_2', type: 'checkbox', label: 'Megtaláltam a komodói varánuszt' },
                        { id: 'zp_3', type: 'photo', label: 'Fotó a lenyűgöző esőerdei vízesésről', placeholder: 'Tölts fel egy hangulatos képet' },
                        { id: 'zp_4', type: 'checkbox', label: 'Láttam az indonéz szőnyegmintás pitont' }
                    ]
                },
                {
                    id: 'tarzan_osveny',
                    name: 'Tarzan Ösvénye',
                    icon: 'fa-hippo',
                    color: 'from-amber-500 to-orange-600',
                    items: [
                        { id: 'to_1', type: 'checkbox', label: 'Megcsodáltam a hatalmas afrikai elefántokat' },
                        { id: 'to_2', type: 'checkbox', label: 'Láttam a ritka fehér oroszlánokat' },
                        { id: 'to_3', type: 'checkbox', label: 'Megvártam, amíg a szurikáták őrséget állnak' },
                        { id: 'to_4', type: 'photo', label: 'Fotó a flamingócsapatról', placeholder: 'Fénykép a rózsaszín madarakról' },
                        { id: 'to_5', type: 'text', label: 'Mit csináltak épp a zsiráfok?', placeholder: 'Legeltek, szaladtak v. aludtak?' }
                    ]
                },
                {
                    id: 'ausztralia_amerika',
                    name: 'Ausztrália és Amerika',
                    icon: 'fa-kiwi-bird',
                    color: 'from-red-500 to-rose-600',
                    items: [
                        { id: 'aa_1', type: 'checkbox', label: 'Láttam a vörös óriáskengurukat ugrálni' },
                        { id: 'aa_2', type: 'checkbox', label: 'Megfigyeltem a rejtőzködő jaguárt' },
                        { id: 'aa_3', type: 'photo', label: 'Fotó az alpakákról vagy a lámatanyáról', placeholder: 'Vicces fotó az alpakákról' }
                    ]
                },
                {
                    id: 'india_haz',
                    name: 'India-ház és Ázsia',
                    icon: 'fa-gopuram',
                    color: 'from-purple-500 to-indigo-600',
                    items: [
                        { id: 'ih_1', type: 'checkbox', label: 'Láttam az indiai orrszarvút' },
                        { id: 'ih_2', type: 'checkbox', label: 'Megtaláltam a fák között a szumátrai tigrist' },
                        { id: 'ih_3', type: 'text', label: 'Mi volt a legérdekesebb dolog az India-házban?', placeholder: 'Írd meg az észrevételed...' }
                    ]
                }
            ]
        };

let userProgress = JSON.parse(localStorage.getItem('zoo_passport_progress')) || {};
let activeRegionId = zooData.regions[0].id;

const menuView = document.getElementById('menuView');
const passportView = document.getElementById('passportView');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const regionTabs = document.getElementById('regionTabs');
const activePageContainer = document.getElementById('activePageContainer');

function openPassport(zooId) {
    menuView.classList.add('hidden');
    passportView.classList.remove('hidden');
    backToMenuBtn.classList.remove('hidden');
    renderRegionTabs();
    renderActivePage();
}

backToMenuBtn.addEventListener('click', () => {
    passportView.classList.add('hidden');
    menuView.classList.remove('hidden');
    backToMenuBtn.classList.add('hidden');
    updateGlobalProgressDOM();
});

function calculateRegionProgress(region) {
    let totalPoints = region.items.length;
    let earnedPoints = 0;

    region.items.forEach(item => {
        const value = userProgress[item.id];
        if (item.type === 'checkbox' && value === true) earnedPoints++;
        if (item.type === 'photo' && value && value.startsWith('data:image')) earnedPoints++;
        if (item.type === 'text' && value && value.trim().length > 3) earnedPoints++;
    });

    return totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
}

function isRegionUnlocked(regionIndex) {
    if (regionIndex === 0) return true; 
    
    const prevRegion = zooData.regions[baseIndex = regionIndex - 1];
    const prevProgress = calculateRegionProgress(prevRegion);
    return prevProgress >= 60;
}

function renderRegionTabs() {
    regionTabs.innerHTML = '';
    
    zooData.regions.forEach((region, index) => {
        const unlocked = isRegionUnlocked(index);
        const progress = calculateRegionProgress(region);
        const isActive = region.id === activeRegionId;
        
        const tab = document.createElement('button');
        tab.className = `snap-center shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-sm ${
            isActive 
            ? 'bg-[#2d5a3a] text-white scale-105 ring-2 ring-emerald-300' 
            : unlocked 
                ? 'bg-white text-slate-700 hover:bg-stone-100' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-60'
        }`;
        
        if (!unlocked) {
            tab.innerHTML = `<i class="fa-solid fa-lock text-[10px]"></i> <span>${region.name}</span>`;
            tab.disabled = true;
        } else {
            tab.innerHTML = `
                <i class="fa-solid ${region.icon} ${isActive ? 'text-amber-300' : 'text-emerald-600'}"></i>
                <span>${region.name}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-stone-100 text-stone-600'}">${progress}%</span>
            `;
            tab.addEventListener('click', () => {
                activeRegionId = region.id;
                renderRegionTabs();
                renderActivePage();
            });
        }
        
        regionTabs.appendChild(tab);
    });
}

function renderActivePage() {
    const region = zooData.regions.find(r => r.id === activeRegionId);
    const regionIndex = zooData.regions.findIndex(r => r.id === activeRegionId);
    const progress = calculateRegionProgress(region);
    
    let itemsHTML = '';
    
    region.items.forEach(item => {
        const savedValue = userProgress[item.id] || '';
        
        if (item.type === 'checkbox') {
            itemsHTML += `
                <label class="flex items-start gap-3 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm cursor-pointer hover:bg-stone-50 transition active:scale-[0.99]">
                    <input type="checkbox" onchange="updateProgress('${item.id}', this.checked)" ${savedValue ? 'checked' : ''} class="w-5 h-5 rounded-md accent-[#2d5a3a] text-white border-stone-300 mt-0.5">
                    <span class="text-sm font-medium text-slate-700 select-none">${item.label}</span>
                </label>
            `;
        } else if (item.type === 'photo') {
            itemsHTML += `
                <div class="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-2.5">
                    <span class="text-sm font-semibold text-slate-700"><i class="fa-solid fa-camera text-emerald-600 mr-1.5"></i>${item.label}</span>
                    <div class="relative w-full h-36 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition" onclick="document.getElementById('file_${item.id}').click()">
                        <input type="file" id="file_${item.id}" accept="image/*" class="hidden" onchange="handlePhotoUpload('${item.id}', this)">
                        ${savedValue ? 
                            `<img src="${savedValue}" class="w-full h-full object-cover">
                             <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white text-xs font-bold"><i class="fa-solid fa-rotate mr-1"></i> Kép cseréle</div>` : 
                            `<i class="fa-solid fa-image text-2xl text-stone-300 mb-1"></i>
                             <span class="text-xs text-stone-400 font-medium">${item.placeholder}</span>`
                        }
                    </div>
                </div>
            `;
        } else if (item.type === 'text') {
            itemsHTML += `
                <div class="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-2">
                    <span class="text-sm font-semibold text-slate-700"><i class="fa-solid fa-pen-to-square text-emerald-600 mr-1.5"></i>${item.label}</span>
                    <textarea oninput="updateProgress('${item.id}', this.value)" rows="2" placeholder="${item.placeholder}" class="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition custom-scrollbar">${savedValue}</textarea>
                </div>
            `;
        }
    });

    activePageContainer.innerHTML = `
        <div class="bg-gradient-to-br ${region.color} text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 opacity-15 text-7xl"><i class="fa-solid ${region.icon}"></i></div>
            <span class="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">Aktív Régió</span>
            <h3 class="heading-font text-xl font-bold mt-1.5 flex items-center gap-2"><i class="fa-solid ${region.icon}"></i> ${region.name}</h3>
            
            <div class="mt-4">
                <div class="flex justify-between text-xs mb-1 font-semibold text-stone-100">
                    <span>Régió teljesítve</span>
                    <span>${progress}%</span>
                </div>
                <div class="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div class="bg-white h-full rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
                <p class="text-[10px] text-stone-200 mt-2 font-medium">A következő régió megnyitásához érj el legalább <span class="font-bold text-amber-300">60%-ot</span> ezen a területen!</p>
            </div>
        </div>

        <div class="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar">
            ${itemsHTML}
        </div>
    `;
}

// Állapot frissítése és mentése
function updateProgress(itemId, value) {
    userProgress[itemId] = value;
    localStorage.setItem('zoo_passport_progress', JSON.stringify(userProgress));

    renderRegionTabs();

    const region = zooData.regions.find(r => r.id === activeRegionId);
    const progress = calculateRegionProgress(region);

    updateGlobalProgressDOM();
}

async function handlePhotoUpload(itemId, input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        let validKeywords = [];
        for (const region of zooData.regions) {
            const item = region.items.find(i => i.id === itemId);
            if (item && item.validKeywords) {
                validKeywords = item.validKeywords;
                break;
            }
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const originalImg = new Image();
            originalImg.src = e.target.result;

            originalImg.onload = async function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500; 
                let width = originalImg.width;
                let height = originalImg.height;

                if (width > height && width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                } else if (height > MAX_WIDTH) {
                    width *= MAX_WIDTH / height;
                    height = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(originalImg, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/webp', 0.75);

                const imgElement = new Image();
                imgElement.src = compressedBase64;

                imgElement.onload = async function() {
                    try {
                        const model = await mobilenet.load();
                        const predictions = await model.classify(imgElement);
                        
                        const isValid = predictions.some(prediction => 
                            validKeywords.some(keyword => 
                                prediction.className.toLowerCase().includes(keyword.toLowerCase())
                            ) && prediction.probability > 0.5
                        );

                        if (isValid || validKeywords.length === 0) {
                            alert("Sikeres validáció! A mérföldkő teljesítve. 🎉");
                            updateProgress(itemId, compressedBase64);
                            renderActivePage();
                        } else {
                            const legvaloszinubb = predictions[0] ? predictions[0].className : "ismeretlen objektum";
                            alert(`Hoppá! A mesterséges intelligencia szerint ezen a képen inkább ez van: "${legvaloszinubb}". Kérlek, próbálj meg egy tisztább képet készíteni az adott állatról! 📸`);
                        }

                    } catch (error) {
                        console.error("Hiba történt a képfelismerés során:", error);
                        alert("A képfelismerő rendszer jelenleg nem elérhető, de a képedet rögzítettük!");
                        updateProgress(itemId, compressedBase64);
                        renderActivePage();
                    }
                };
            };
        };
        reader.readAsDataURL(file);
    }
}

function updateGlobalProgressDOM() {
    let totalItems = 0;
    let completedItems = 0;

    zooData.regions.forEach(region => {
        region.items.forEach(item => {
            totalItems++;
            const value = userProgress[item.id];
            if (item.type === 'checkbox' && value === true) completedItems++;
            if (item.type === 'photo' && value && value.startsWith('data:image')) completedItems++;
            if (item.type === 'text' && value && value.trim().length > 3) completedItems++;
        });
    });

    const globalPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    
    const txt = document.getElementById('globalProgressTxt');
    const bar = document.getElementById('globalProgressBar');
    
    if(txt && bar) {
        txt.innerText = `${globalPercent}%`;
        bar.style.width = `${globalPercent}%`;
    }
}

updateGlobalProgressDOM();