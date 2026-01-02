// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi komponen
    initNavbar();
    initGallery();
    initStudents();
    initMessages();
    initMusicPlayer();
    initModal();
    initSmoothScroll();
    
    // Set foto kelas default jika gambar tidak ditemukan
    setDefaultImage();
});

// Fungsi untuk navbar responsif
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Tutup menu mobile saat mengklik link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Fungsi untuk menginisialisasi galeri
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Render semua item galeri
    renderGalleryItems(galleryData);
    
    // Tambahkan event listener untuk filter
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas active dari semua button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tambahkan kelas active ke button yang diklik
            this.classList.add('active');
            
            // Dapatkan nilai filter
            const filterValue = this.getAttribute('data-filter');
            
            // Filter item galeri
            let filteredItems;
            if (filterValue === 'all') {
                filteredItems = galleryData;
            } else {
                filteredItems = galleryData.filter(item => item.category === filterValue);
            }
            
            // Render item yang difilter
            renderGalleryItems(filteredItems);
        });
    });
}

// Fungsi untuk merender item galeri
function renderGalleryItems(items) {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Kosongkan kontainer galeri
    galleryContainer.innerHTML = '';
    
    // Jika tidak ada item, tampilkan pesan
    if (items.length === 0) {
        galleryContainer.innerHTML = '<p class="no-items">Tidak ada gambar untuk kategori ini.</p>';
        return;
    }
    
    // Render setiap item
    items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);
        
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.alt}" loading="lazy">
            <div class="gallery-item-overlay">
                <p>${item.caption}</p>
            </div>
        `;
        
        // Tambahkan event listener untuk membuka modal
        galleryItem.addEventListener('click', function() {
            openModal(item.src, item.caption);
        });
        
        galleryContainer.appendChild(galleryItem);
    });
}

// Fungsi untuk menginisialisasi daftar siswa
function initStudents() {
    const studentsContainer = document.querySelector('.students-container');
    const showAllButton = document.getElementById('showAllStudents');
    
    // Render 8 siswa pertama
    renderStudents(studentsData.slice(0, 8));
    
    // Event listener untuk tombol "Lihat Semua Siswa"
    if (showAllButton) {
        showAllButton.addEventListener('click', function() {
            // Render semua siswa
            renderStudents(studentsData);
            
            // Sembunyikan tombol
            showAllButton.style.display = 'none';
        });
    }
}

// Fungsi untuk merender daftar siswa
function renderStudents(students) {
    const studentsContainer = document.querySelector('.students-container');
    
    // Kosongkan kontainer siswa
    studentsContainer.innerHTML = '';
    
    // Render setiap siswa
    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        
        // Tentukan avatar berdasarkan gender
        let avatarContent = '';
        if (student.gender === 'male') {
            avatarContent = '<i class="fas fa-male"></i>';
        } else {
            avatarContent = '<i class="fas fa-female"></i>';
        }
        
        studentCard.innerHTML = `
            <div class="student-avatar">
                ${avatarContent}
            </div>
            <h3 class="student-name">${student.name}</h3>
            <p class="student-nickname">${student.nickname}</p>
        `;
        
        studentsContainer.appendChild(studentCard);
    });
}

// Fungsi untuk menginisialisasi sistem pesan
function initMessages() {
    const messageForm = document.querySelector('.message-form');
    const submitButton = document.getElementById('submitMessage');
    const messagesList = document.getElementById('messagesList');
    
    // Render pesan yang sudah ada
    renderMessages();
    
    // Event listener untuk form pesan
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const senderName = document.getElementById('senderName').value;
            const messageText = document.getElementById('messageText').value;
            
            // Validasi input
            if (!senderName.trim() || !messageText.trim()) {
                alert('Harap isi nama dan pesan Anda!');
                return;
            }
            
            // Buat pesan baru
            const newMessage = {
                id: messagesData.length + 1,
                sender: senderName,
                date: getCurrentDate(),
                text: messageText
            };
            
            // Tambahkan ke array pesan
            messagesData.unshift(newMessage);
            
            // Render ulang pesan
            renderMessages();
            
            // Reset form
            document.getElementById('senderName').value = '';
            document.getElementById('messageText').value = '';
            
            // Tampilkan notifikasi
            showNotification('Pesan Anda berhasil dikirim!');
        });
    }
}

// Fungsi untuk merender pesan
function renderMessages() {
    const messagesList = document.getElementById('messagesList');
    
    if (!messagesList) return;
    
    // Kosongkan daftar pesan
    messagesList.innerHTML = '';
    
    // Render setiap pesan
    messagesData.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.sender}</span>
                <span class="message-date">${message.date}</span>
            </div>
            <div class="message-text">
                <p>${message.text}</p>
            </div>
        `;
        
        messagesList.appendChild(messageItem);
    });
}

// Fungsi untuk menginisialisasi pemutar musik
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (musicToggle && backgroundMusic) {
        let isPlaying = false;
        
        musicToggle.addEventListener('click', function() {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Putar Lagu Kenangan</span>';
                musicToggle.style.backgroundColor = 'var(--primary-color)';
            } else {
                backgroundMusic.play().catch(e => {
                    console.log("Autoplay diblokir oleh browser. Klik lagi untuk memutar.");
                    // Jika autoplay diblokir, minta interaksi pengguna
                    backgroundMusic.play();
                });
                musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Jeda Lagu</span>';
                musicToggle.style.backgroundColor = 'var(--secondary-color)';
            }
            
            isPlaying = !isPlaying;
        });
    }
}

// Fungsi untuk menginisialisasi modal gambar
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    
    // Tutup modal saat mengklik tombol close
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Tutup modal saat mengklik di luar gambar
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Tutup modal dengan tombol ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// Fungsi untuk membuka modal gambar
function openModal(src, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    
    if (modal && modalImg && captionText) {
        modal.style.display = 'flex';
        modalImg.src = src;
        captionText.innerHTML = caption;
    }
}

// Fungsi untuk smooth scroll
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Hitung offset untuk navbar tetap
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Smooth scroll ke target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Styling notifikasi
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.zIndex = '2000';
    notification.style.fontWeight = '500';
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Fungsi untuk mendapatkan tanggal saat ini dalam format Indonesia
function getCurrentDate() {
    const now = new Date();
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    return now.toLocaleDateString('id-ID', options);
}

// Fungsi untuk menetapkan gambar default jika gambar tidak ditemukan
function setDefaultImage() {
    const classPhoto = document.getElementById('class-photo');
    
    if (classPhoto) {
        classPhoto.onerror = function() {
            // Gunakan gambar placeholder jika gambar asli tidak ditemukan
            this.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
            this.alt = 'Foto Kelas Default';
        };
    }
}

// Efek scroll navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        navbar.style.padding = '10px 0';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animasi saat scroll (reveal effect)
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.about-content, .gallery-container, .students-container, .memories-container');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Panggil saat scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Panggil sekali saat halaman dimuat
    revealOnScroll();
}

// Panggil fungsi animasi scroll
setTimeout(initScrollAnimations, 500);