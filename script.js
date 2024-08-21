// GitHub에서 tasks.json 데이터를 가져오기
const fetchTasks = async () => {
    const response = await fetch('https://raw.githubusercontent.com/사용자명/저장소명/브랜치명/tasks.json');
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
                <span class="toggle-icon" onclick="toggleImage(${index})">[+]</span>
                <img src="${task.image}" alt="${task.subject}">
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

// 과목 정렬 기준 토글 함수
function toggleSort() {
    isDateSorted = !isDateSorted;
    renderTasks();
}

// 초기에 tasks.json 파일을 불러와서 수행평가를 렌더링
renderTasks();

// 이미지 토글 함수
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
