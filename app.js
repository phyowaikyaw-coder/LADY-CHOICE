// ==========================================================================
// 1. Initialize Mock Data (55 Items) - [ပြင်ဆင်ချက်: Status စာသားအသစ်များ ထည့်သွင်းခြင်း]
// ==========================================================================
const totalItems = 55;
let inventoryData = [];

for (let i = 1; i <= totalItems; i++) {
    let initialStatus = 'အခန်းဝင်ရန်အသင့်ရှိသည်။';
    if (i % 5 === 0) initialStatus = 'အခန်းဝင်နေသဖြင့် မအားပါ။';
    else if (i % 7 === 0) initialStatus = 'ခွင့်ယူထားပါသည်။';
    else if (i % 9 === 0) initialStatus = 'ကျန်းမာရေးကြောင့် အခန်းမဝင်နိုင်ပါ။';

    inventoryData.push({
        id: i,
        name: `Lady (${i})`,
        image: `https://picsum.photos/id/${(i + 10) % 100}/600/400`,
        status: initialStatus
    });
}

let currentSelectedItem = null;

// DOM Elements
const itemGrid = document.getElementById('item-grid');
const itemCount = document.getElementById('item-count');
const detailName = document.getElementById('detail-name');
const detailImage = document.getElementById('detail-image');
const detailStatus = document.getElementById('detail-status');
const imageUpload = document.getElementById('image-upload');
const saveBtn = document.getElementById('save-btn');
const addBtn = document.getElementById('add-btn');
const deleteBtn = document.getElementById('delete-btn');

// ==========================================================================
// 2. Render Left Side Grid (With Smart ID & Available Sorting)
// ==========================================================================
function renderGrid() {
    itemGrid.innerHTML = '';
    itemCount.innerText = `${inventoryData.length} Items`;

    // [ပြင်ဆင်ချက်] 'အခန်းဝင်ရန်အသင့်ရှိသည်။' ဖြစ်သူများကို အပေါ်ထားပြီး ကျန်တာအားလုံးကို အောက်ပို့ကာ ID အလိုက် စီမည့် Logic
    inventoryData.sort((a, b) => {
        const isA_Available = a.status === 'အခန်းဝင်ရန်အသင့်ရှိသည်။';
        const isB_Available = b.status === 'အခန်းဝင်ရန်အသင့်ရှိသည်။';

        if ((isA_Available && isB_Available) || (!isA_Available && !isB_Available)) {
            return a.id - b.id; 
        }
        if (isA_Available && !isB_Available) {
            return -1;
        }
        if (!isA_Available && isB_Available) {
            return 1;
        }
        return 0;
    });

    inventoryData.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        if (currentSelectedItem && currentSelectedItem.id === item.id) {
            gridItem.className += ' active';
        }

        // 'အခန်းဝင်ရန်အသင့်ရှိသည်။' မဟုတ်လျှင် ဘယ်ဘက်ကပုံကို မှိန်ထားပါမည်
        const dimClass = item.status !== 'အခန်းဝင်ရန်အသင့်ရှိသည်။' ? 'not-available' : '';

        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="${dimClass}">
            <p>${item.name}</p>
        `;

        gridItem.addEventListener('click', () => {
            selectItem(item);
        });

        itemGrid.appendChild(gridItem);
    });
}

// ==========================================================================
// 3. Select Item and Display in Right Panel (With Live Dimming)
// ==========================================================================
function selectItem(item) {
    currentSelectedItem = item;
    renderGrid();

    detailName.value = item.name;
    detailImage.src = item.image;
    detailStatus.value = item.status;

    updateImageDimming(item.status);
}

function updateImageDimming(status) {
    if (status !== 'အခန်းဝင်ရန်အသင့်ရှိသည်။') {
        detailImage.classList.add('not-available');
    } else {
        detailImage.classList.remove('not-available');
    }
}

detailStatus.addEventListener('change', (e) => {
    updateImageDimming(e.target.value);
});

// ==========================================================================
// 4. Image Upload Handle
// ==========================================================================
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && currentSelectedItem) {
        const reader = new FileReader();
        reader.onload = function(event) {
            detailImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ==========================================================================
// 5. Save Data Button Logic
// ==========================================================================
saveBtn.addEventListener('click', () => {
    if (!currentSelectedItem) {
        alert('Please select an item to edit first!');
        return;
    }

    currentSelectedItem.name = detailName.value;
    currentSelectedItem.image = detailImage.src;
    currentSelectedItem.status = detailStatus.value;

    renderGrid();
    alert(`"${currentSelectedItem.name}" data has been successfully saved!`);
});

// ==========================================================================
// 6. Add New Item Logic
// ==========================================================================
addBtn.addEventListener('click', () => {
    const newId = inventoryData.length > 0 ? Math.max(...inventoryData.map(o => o.id)) + 1 : 1;
    
    const newItem = {
        id: newId,
        name: `New Lady (${newId})`,
        image: 'https://via.placeholder.com/600x400?text=Click+To+Upload+Image',
        status: 'အခန်းဝင်ရန်အသင့်ရှိသည်။'
    };

    inventoryData.push(newItem);
    selectItem(newItem);
    
    itemGrid.scrollTop = itemGrid.scrollHeight;
});

// ==========================================================================
// 7. Delete Item Logic
// ==========================================================================
deleteBtn.addEventListener('click', () => {
    if (!currentSelectedItem) {
        alert('No item selected to delete!');
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${currentSelectedItem.name}" from the list?`);
    
    if (confirmDelete) {
        inventoryData = inventoryData.filter(item => item.id !== currentSelectedItem.id);
        
        if (inventoryData.length > 0) {
            selectItem(inventoryData[0]);
        } else {
            currentSelectedItem = null;
            renderGrid();
            detailName.value = 'No Item';
            detailImage.src = 'https://via.placeholder.com/600x400?text=No+Data';
            detailStatus.value = 'အခန်းဝင်ရန်အသင့်ရှိသည်။';
            updateImageDimming('အခန်းဝင်ရန်အသင့်ရှိသည်။');
        }
        alert('Item deleted successfully!');
    }
});

// ==========================================================================
// Initial Render
// ==========================================================================
renderGrid();
if(inventoryData.length > 0) {
    selectItem(inventoryData[0]);
}