// ১. কুপন ডিসকাউন্ট মনে রাখার ভেরিয়েবল
let discountPercentage = 0;

// ২. ওপরের নেভিগেশন বারের ঝুড়ির কাউন্টার (লাল গোল সংখ্যা) আপডেট করার ফাংশন
const updateCartCounter = () => {
    const cart = JSON.parse(localStorage.getItem('freshCart')) || [];
    const cartDisplay = document.getElementById('cart-count');
    if (cartDisplay) {
        cartDisplay.innerText = cart.length; // কার্টে যতগুলো পণ্য আছে সেই সংখ্যা বসবে
    }
};

// ৩. শপ পেজ থেকে পণ্য মেমরিতে (LocalStorage) সেভ করা এবং সংখ্যা বাড়ানো
const addToCart = (name, price, img) => {
    const cart = JSON.parse(localStorage.getItem('freshCart')) || [];
    cart.push({ name, price, img });
    localStorage.setItem('freshCart', JSON.stringify(cart));
    
    // আইটেম যোগ হওয়ার সাথে সাথে ওপরের সংখ্যাটি আপডেট হবে
    updateCartCounter();
    alert(`${name} বাজারে যোগ হয়েছে!`);
};

// ৪. কার্ট পেজে মেমরি থেকে পণ্য নিয়ে এসে অটোমেটিক দেখানো (কোনো ইনলাইন সিএসএস ছাড়া)
const displayCart = () => {
    const list = document.getElementById('cart-items-container');
    const totalText = document.getElementById('cart-total-amount');
    if (!list) return; // কার্ট পেজে না থাকলে কোড এখানেই থেমে যাবে

    const cart = JSON.parse(localStorage.getItem('freshCart')) || [];
    let total = 0;

    // যদি কার্ট খালি থাকে
    if (cart.length === 0) {
        list.innerHTML = `<h3>আপনার বাজারের ঝুড়িটি খালি!</h3>`;
        if (totalText) totalText.innerText = "৳০";
        return;
    }

    // প্রোডাক্ট লিস্টের জন্য মেইন বক্স তৈরি
    let cartListHTML = `<div class="cart-list">`; 

    cart.forEach((item, index) => {
        total += item.price;
        cartListHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>পরিমাণ: ১ কেজি</p>
                    </div>
                </div>
                <span class="item-price">৳${item.price}</span>
                <button onclick="deleteItem(${index})">❌</button>
            </div>
        `;
    });

    cartListHTML += `</div>`; 
    list.innerHTML = cartListHTML;

    // হোম পেজের অফার অনুযায়ী যদি কুপন কোড সফল হয়, তবে ২০% দাম কমবে
    if (discountPercentage > 0) {
        let discountAmount = (total * discountPercentage) / 100;
        total = total - discountAmount;
    }

    // মোট টাকা স্ক্রিনে আপডেট করা
    if (totalText) {
        totalText.innerText = `৳${total}`;
    }
};

// ৫. কার্ট থেকে পণ্য ডিলিট করা
const deleteItem = (index) => {
    const cart = JSON.parse(localStorage.getItem('freshCart')) || [];
    cart.splice(index, 1); // ওই নম্বরের আইটেমটি মেমরি থেকে বাদ দেওয়া
    localStorage.setItem('freshCart', JSON.stringify(cart));
    
    displayCart();       // সাথে সাথে কার্ট পেজ আপডেট করা
    updateCartCounter(); // পণ্য ডিলিট হলে ওপরের সংখ্যাও কমে যাবে
};

// ৬. হোম পেজের ব্যানার অনুযায়ী কুপন কোড চেক করার সহজ ফাংশন
const applyCoupon = () => {
    const couponInput = document.getElementById('coupon-input');
    if (!couponInput) return;

    const code = couponInput.value.trim();

    if (code === 'FRESH20') {
        discountPercentage = 20; // ২০% ছাড় সেট হলো
        alert('কুপন সফল হয়েছে! ২০% ডিসকাউন্ট যুক্ত হয়েছে।');
        displayCart(); // ডিসকাউন্ট সহ দাম দেখানোর জন্য কার্ট রিফ্রেশ হলো
    } else {
        alert('ভুল কুপন কোড! আবার চেষ্টা করুন।');
    }
};

// ৭. অর্ডার কনফর্ম হওয়ার পর ঝুড়ির নম্বর ও পণ্য চিরতরে মুছে ফেলার ফাংশন
const clearCartAfterOrder = () => {
    localStorage.removeItem('freshCart'); // মেমরি খালি করা
    
    const cartDisplay = document.getElementById('cart-count');
    if (cartDisplay) {
        cartDisplay.innerText = '০'; // ওপরের ঝুড়ির লাল সংখ্যা ০ করা
    }
};

// ৮. ক্যাটাগরি ফিল্টার করার ফাংশন
function filterCategory(categoryName) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.shop-cat-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    products.forEach(product => {
        if (categoryName === 'all') {
            product.style.display = 'block';
        } else if (product.classList.contains(categoryName)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// পেজ লোড হওয়ার সাথে সাথে রান করা
document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    updateCartCounter(); 
});