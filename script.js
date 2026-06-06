// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Set active class on clicked link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // 2. Feature Card Mouse Move Glow Effect (Spotlight Effect)
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 3. Highlight Active Nav Item on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 180; // offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
        
        // Default to home if top of page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.getElementById('nav-home').classList.add('active');
        }
    });

    // Initialize Quiz and progress states
    resetQuizState();
    updateTaskProgress();
    animateStatCounters();
});

function animateStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = Number(stat.dataset.count);
        const suffix = stat.dataset.suffix || '';
        if (Number.isNaN(target)) return;

        let current = 0;
        const duration = 900;
        const step = Math.max(1, Math.round(target / (duration / 16)));

        const update = () => {
            current += step;
            if (current >= target) {
                current = target;
                stat.textContent = `${current}${suffix}`;
                return;
            }
            stat.textContent = `${current}${suffix}`;
            requestAnimationFrame(update);
        };

        if (target === 0) {
            stat.textContent = `0${suffix}`;
            return;
        }

        requestAnimationFrame(update);
    });
}

// 4. Tasks & Athkar Checklist Interaction
let completedTasksCount = 0;
const totalTasksCount = 4;

function toggleTask(element) {
    element.classList.toggle('completed');
    
    const isCompleted = element.classList.contains('completed');
    if (isCompleted) {
        completedTasksCount++;
    } else {
        completedTasksCount--;
    }

    // Optional toast notification when all tasks are done
    if (completedTasksCount === totalTasksCount) {
        showCelebrationToast();
    }

    updateTaskProgress();
}

function updateTaskProgress() {
    const ring = document.getElementById('task-progress-ring');
    const text = document.getElementById('task-progress-text');
    if (!ring || !text) return;

    const percent = Math.round((completedTasksCount / totalTasksCount) * 100);
    const pathLength = ring.getTotalLength();
    const dash = (percent / 100) * pathLength;
    ring.setAttribute('stroke-dasharray', `${dash} ${pathLength}`);
    text.textContent = percent === 100 ? `مكتمل` : `${percent}%`;
}

function showCelebrationToast() {
    // Check if toast already exists
    let existingToast = document.getElementById('celebration-toast');
    if (existingToast) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'celebration-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.background = 'linear-gradient(135deg, #5D3CFF 0%, #00D2FF 100%)';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '16px 28px';
    toast.style.borderRadius = '16px';
    toast.style.boxShadow = '0 10px 30px rgba(93, 60, 255, 0.4)';
    toast.style.zIndex = '9999';
    toast.style.direction = 'rtl';
    toast.style.fontFamily = 'Cairo, sans-serif';
    toast.style.fontWeight = '700';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    toast.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>أحسنت يا بطل! لقد أنجزت روتينك بالكامل لليوم. درعك محمي!</span>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // Fade out after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4500);
}

// 5. Mini IQ Quiz Logic
let currentQuestion = 1;
let score = 0;
const totalQuestions = 3;

function resetQuizState() {
    currentQuestion = 1;
    score = 0;
    
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
        progressBar.style.width = '33.33%';
    }
    
    // Hide results, show Q1
    const resultPanel = document.getElementById('quiz-result');
    if (resultPanel) resultPanel.style.display = 'none';

    for (let i = 1; i <= totalQuestions; i++) {
        const qBox = document.getElementById(`q-${i}`);
        if (qBox) {
            qBox.style.display = i === 1 ? 'block' : 'none';
        }
    }
}

function submitAnswer(questionNum, answer) {
    // Check answer correctness
    if (questionNum === 1 && answer === 98) {
        score++;
    } else if (questionNum === 2 && answer === 12) {
        score++;
    } else if (questionNum === 3 && answer === 'echo') {
        score++;
    }

    // Go to next question or show result
    const currentBox = document.getElementById(`q-${questionNum}`);
    if (currentBox) {
        currentBox.style.display = 'none';
    }

    if (questionNum < totalQuestions) {
        currentQuestion++;
        const nextBox = document.getElementById(`q-${currentQuestion}`);
        if (nextBox) {
            nextBox.style.display = 'block';
        }
        // Update progress bar
        const progressBar = document.getElementById('quiz-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
        }
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
    }

    const resultPanel = document.getElementById('quiz-result');
    const scoreText = document.getElementById('quiz-score-text');
    const descText = document.getElementById('quiz-desc-text');

    if (resultPanel && scoreText && descText) {
        resultPanel.style.display = 'block';
        
        scoreText.textContent = `درجتك هي: ${score} من أصل 3`;
        
        if (score === 3) {
            descText.textContent = "مذهل! ذهنك متيقظ وتركيزك العقلي في أعلى مستوياته. خض التحديات والاختبارات الذهنية المعقدة في التطبيق لتطوير ذكائك يومياً!";
        } else if (score === 2) {
            descText.textContent = "أداء ممتاز! ذكاؤك رائع ولكن لديك بعض التشتت البسيط. يساعدك تطبيق أمراء في التخلص من التشتت تماماً والوصول لأقصى تركيز.";
        } else {
            descText.textContent = "بداية جيدة! لكن يبدو أن التشتت الرقمي يؤثر على تركيزك العام. تطبيق أمراء يوفر تمارين مخصصة لزيادة الانتباه والذاكرة بشكل ملحوظ.";
        }
    }
}

function restartQuiz() {
    resetQuizState();
}

// 6. Accordion FAQ Interaction (Smooth Height Transition)
function toggleFaq(headerElement) {
    const item = headerElement.parentElement;
    const body = item.querySelector('.faq-body');
    const isActive = item.classList.contains('active');

    // Close all other FAQ items first
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.faq-body');
        if (b) {
            b.style.maxHeight = null;
        }
    });

    // Toggle current item
    if (!isActive) {
        item.classList.add('active');
        // Set max-height to scrollHeight to enable smooth transition
        body.style.maxHeight = body.scrollHeight + "px";
    } else {
        item.classList.remove('active');
        body.style.maxHeight = null;
    }
}
