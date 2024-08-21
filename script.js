// // 수행평가 데이터
// const tasks = [
//     { date: '0821', subject: '국어', description: '작문 과제 제출', image: 'https://via.placeholder.com/600x400?text=국어' },
//     { date: '0823', subject: '수학', description: '기말고사 준비', image: 'https://via.placeholder.com/600x400?text=수학' },
//     { date: '0821', subject: '영어', description: '듣기 평가', image: 'https://via.placeholder.com/600x400?text=영어' },
//     { date: '0825', subject: '확통', description: '문제 풀이 연습', image: 'https://via.placeholder.com/600x400?text=확통' },
//     { date: '0822', subject: '물리', description: '실험 보고서 제출', image: 'https://via.placeholder.com/600x400?text=물리' },
//     { date: '0824', subject: '생명', description: '이론 시험 준비', image: 'https://via.placeholder.com/600x400?text=생명' },
//     { date: '0827', subject: '화학', description: '화학식 암기', image: 'https://via.placeholder.com/600x400?text=화학' },
//     { date: '0828', subject: '지구', description: '지구과학 연습문제', image: 'https://via.placeholder.com/600x400?text=지구' },
//     { date: '0830', subject: '일본어', description: '어휘 시험', image: 'https://via.placeholder.com/600x400?text=일본어' },
//     { date: '0815', subject: '국어', description: '문학 분석 제출', image: 'https://via.placeholder.com/600x400?text=국어' },
//     { date: '0818', subject: '물리', description: '실험 결과 보고서', image: 'https://via.placeholder.com/600x400?text=물리' },
//     { date: '0819', subject: '화학', description: '화학 실험', image: 'https://via.placeholder.com/600x400?text=화학' },
//     { date: '0820', subject: '생명', description: '세포 구조 발표', image: 'https://via.placeholder.com/600x400?text=생명' },
//     { date: '0822', subject: '확통', description: '복습 시험', image: 'https://via.placeholder.com/600x400?text=확통' },
//     { date: '0931', subject: '지구', description: '지진학 레포트', image: 'https://via.placeholder.com/600x400?text=지구' },
//     { date: '0831', subject: '일본어', description: '문법 연습', image: 'https://via.placeholder.com/600x400?text=일본어' }
// ];

// let isDateSorted = true;

// GitHub에서 tasks.json 데이터를 가져오기
const fetchTasks = async () => {
    const response = await fetch('https://raw.githubusercontent.com/Jihun07/test22/main/tasks.json', {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    
    const tasks = await response.json();
    return tasks;
};

let isDateSorted = true;

// 문자열을 지정된 길이로 맞추기 위한 패딩 함수
function padString(str, length) {
    return str.padEnd(length, ' ');
}

// 날짜를 MM/DD 형식으로 포맷팅하는 함수
function formatDate(dateStr) {
    const month = dateStr.slice(0, 2);
    const day = dateStr.slice(2, 4);
    return `${month}/${day}`;
}

// D-Day 계산 함수
function calculateDday(dateStr) {
    const taskDate = new Date(`2024-${dateStr.slice(0, 2)}-${dateStr.slice(2, 4)}`);
    const today = new Date();
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day" : `D+${-diffDays}`;
}

// 현재 날짜 반환 함수
function getTodayDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}${day}`;
}

// 최대 길이 설정
const maxDateLength = 6;  // MM/DD (5) + padding
const maxSubjectLength = 8;  // 최대 과목 길이
const maxDescriptionLength = 30;  // 최대 설명 길이

async function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const tasks = await fetchTasks();
    const todayDate = getTodayDate();

    // 날짜가 지나지 않은 항목과 지난 항목으로 분리
    const notDueTasks = tasks.filter(task => task.date >= todayDate);
    const pastDueTasks = tasks.filter(task => task.date < todayDate);

    // 정렬 기준에 따라 각각의 리스트를 정렬
    const sortedNotDueTasks = [...notDueTasks].sort((a, b) => {
        if (isDateSorted) {
            return a.date.localeCompare(b.date);
        } else {
            return a.subject.localeCompare(b.subject);
        }
    });

    const sortedPastDueTasks = [...pastDueTasks].sort((a, b) => {
        if (isDateSorted) {
            return a.date.localeCompare(b.date);
        } else {
            return a.subject.localeCompare(b.subject);
        }
    });

    // 날짜가 지나지 않은 항목을 먼저 렌더링
    sortedNotDueTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <div class="task-item-content">
                <span class="task-item-date">${padString(formatDate(task.date), maxDateLength)}</span>
                <span class="task-item-subject">${padString(task.subject, maxSubjectLength)}</span>
                <span class="task-item-description">${padString(task.description, maxDescriptionLength)}</span>
                <span class="task-item-dday">${calculateDday(task.date)}</span>
                <span class="toggle-icon" onclick="toggleImage(${index})">[+]</span>
                <img src="${task.image}" alt="${task.subject}">
            </div>
        `;
        
        taskList.appendChild(li);
    });

    // 날짜가 지난 항목을 나중에 렌더링
    sortedPastDueTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <div class="task-item-content">
                <span class="task-item-date">${padString(formatDate(task.date), maxDateLength)}</span>
                <span class="task-item-subject">${padString(task.subject, maxSubjectLength)}</span>
                <span class="task-item-description">${padString(task.description, maxDescriptionLength)}</span>
                <span class="task-item-dday">${calculateDday(task.date)}</span>
                <span class="toggle-icon" onclick="toggleImage(${index + sortedNotDueTasks.length})">[+]</span>
                <img src="${task.image}" alt="${task.subject}">
            </div>
        `;
        
        li.style.textDecoration = 'line-through'; // 기한이 지난 항목에는 취소선 추가
        taskList.appendChild(li);
    });
}

function toggleSort() {
    isDateSorted = !isDateSorted;
    document.getElementById('sortButton').textContent = isDateSorted ? '과목순으로 보기' : '날짜순으로 보기';
    renderTasks();
}

function toggleImage(index) {
    const taskItem = document.querySelectorAll('.task-item')[index];
    const img = taskItem.querySelector('img');
    const toggleIcon = taskItem.querySelector('.toggle-icon');

    if (img.style.display === 'none' || img.style.display === '') {
        img.style.display = 'block';
        toggleIcon.textContent = '[-]';
    } else {
        img.style.display = 'none';
        toggleIcon.textContent = '[+]';
    }
}

document.getElementById('sortButton').addEventListener('click', toggleSort);

// 달력 렌더링
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function renderCalendar() {
    const tasks = await fetchTasks();
    
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
        const dayStr = `${String(currentMonth + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const hasTask = tasks.some(task => task.date === dayStr);
        if (hasTask) {
            dayElement.classList.add('has-task');
            dayElement.addEventListener('click', (event) => showPopup(event, dayStr));
        }

        calendarGrid.appendChild(dayElement);
    }

    document.getElementById('currentMonth').textContent = `${currentYear}년 ${currentMonth + 1}월`;
}

// function showPopup(event, dateStr) {
//     const popup = document.getElementById('popup');
//     const popupContent = document.getElementById('popupContent');
//     const task = tasks.find(task => task.date === dateStr);

//     if (task) {
//         popupContent.innerHTML = `<h3>${task.subject}</h3><p>${task.description}</p>`;
//         popup.style.display = 'block';
//         popup.style.top = `${event.clientY}px`;
//         popup.style.left = `${event.clientX}px`;
//     }
// }

// function closePopup() {
//     document.getElementById('popup').style.display = 'none';
// }

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// 초기 화면 렌더링
renderTasks();
renderCalendar();
