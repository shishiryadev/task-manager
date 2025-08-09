// This code runs when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Django app loaded successfully!');
    
    // Initialize all the cool features
    initTaskForm();
    initAjaxDemo();
    initAnimations();
    addFunFeatures();
});

// Makes the task form work with AJAX (no page refresh!)
function initTaskForm() {
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the form from refreshing the page
            
            const title = taskTitle.value.trim();
            if (!title) {
                showMessage('Please enter a task title! 📝', 'error');
                return;
            }
            
            // Prepare the data to send
            const taskData = {
                title: title,
                description: taskDescription.value.trim()
            };
            
            // Send it to Django!
            submitTask(taskData);
        });
    }
}

// Sends the task to Django using AJAX
function submitTask(taskData) {
    const submitBtn = document.querySelector('#taskForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading animation
    submitBtn.innerHTML = '<span class="loading"></span> Adding Magic...';
    submitBtn.disabled = true;
    
    fetch('/api/data/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('✨ Task added:', data);
        
        // Add the task to the page without refreshing!
        addTaskToDOM(data);
        
        // Clear the form
        document.getElementById('taskForm').reset();
        
        // Show success message
        showMessage('🎉 Task added successfully!', 'success');
    })
    .catch(error => {
        console.error('❌ Error adding task:', error);
        showMessage('😱 Oops! Something went wrong. Try again!', 'error');
    })
    .finally(() => {
        // Reset the button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Adds a new task to the page dynamically
function addTaskToDOM(task) {
    const tasksList = document.getElementById('tasksList');
    const noTasksMsg = tasksList.querySelector('.no-tasks');
    
    // Remove "no tasks" message if it exists
    if (noTasksMsg) {
        noTasksMsg.remove();
    }
    
    // Create the new task element
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.dataset.id = task.id;
    
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    taskCard.innerHTML = `
        <h4>${escapeHtml(task.title)}</h4>
        ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
        <div class="task-meta">
            <span class="task-status pending">⏳ To Do</span>
            <span class="task-date">${dateString}</span>
        </div>
    `;
    
    // Add cool entrance animation
    taskCard.style.opacity = '0';
    taskCard.style.transform = 'translateY(20px) scale(0.9)';
    
    // Add it to the top of the list
    tasksList.insertBefore(taskCard, tasksList.firstChild);
    
    // Animate it in!
    setTimeout(() => {
        taskCard.style.transition = 'all 0.5s ease';
        taskCard.style.opacity = '1';
        taskCard.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    // Add hover effects
    addTaskCardEffects(taskCard);
}

// AJAX demo functionality
function initAjaxDemo() {
    const loadDataBtn = document.getElementById('loadDataBtn');
    const ajaxResult = document.getElementById('ajaxResult');
    
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', function() {
            loadDataBtn.innerHTML = '<span class="loading"></span> Loading Magic...';
            loadDataBtn.disabled = true;
            
            fetch('/api/data/')
                .then(response => response.json())
                .then(data => {
                    console.log('📊 Data loaded:', data);
                    displayAjaxResult(data.tasks);
                })
                .catch(error => {
                    console.error('❌ Error loading data:', error);
                    ajaxResult.innerHTML = '<p style="color: red;">😱 Error loading data</p>';
                })
                .finally(() => {
                    loadDataBtn.textContent = '✨ Load Data via AJAX';
                    loadDataBtn.disabled = false;
                });
        });
    }
}

// Display the AJAX result with style!
function displayAjaxResult(tasks) {
    const ajaxResult = document.getElementById('ajaxResult');
    
    if (tasks.length === 0) {
        ajaxResult.innerHTML = '<p>🎯 No tasks found in the database yet!</p>';
        return;
    }
    
    let html = '<div style="text-align: left;"><h4>🎉 Tasks from Database:</h4><ul style="margin-top: 1rem;">';
    tasks.forEach((task, index) => {
        html += `<li style="margin-bottom: 0.5rem;">
            <strong>${escapeHtml(task.title)}</strong>`;
        if (task.description) {
            html += ` - ${escapeHtml(task.description)}`;
        }
        html += ` (${task.completed ? '✅ Done!' : '⏳ To Do'})`;
        html += `</li>`;
    });
    html += '</ul></div>';
    
    ajaxResult.innerHTML = html;
    
    // Add a little animation
    ajaxResult.style.transform = 'scale(0.9)';
    setTimeout(() => {
        ajaxResult.style.transition = 'transform 0.3s ease';
        ajaxResult.style.transform = 'scale(1)';
    }, 10);
}

// Add cool animations
function initAnimations() {
    // Animate existing task cards
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(addTaskCardEffects);
    
    // Animate elements when they come into view
    const observeElements = document.querySelectorAll('.task-card, .add-task-form, .tasks-container, .demo-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    observeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Add hover effects to task cards
function addTaskCardEffects(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
}

// Fun extra features
function addFunFeatures() {
    // Add sparkle effect when clicking buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            createSparkle(e.target);
        }
    });
    
    // Double-click task titles to edit them
    document.addEventListener('dblclick', function(e) {
        if (e.target.tagName === 'H4' && e.target.closest('.task-card')) {
            editTaskTitle(e.target);
        }
    });
}

// Create sparkle effect
function createSparkle(element) {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        // Animate the sparkle
        sparkle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-30px) scale(0)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

// Edit task title by double-clicking
function editTaskTitle(h4Element) {
    const currentText = h4Element.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.style.cssText = `
        width: 100%;
        padding: 0.5rem;
        font-size: 1.2rem;
        border: 3px solid #667eea;
        border-radius: 10px;
        background: white;
    `;
    
    h4Element.style.display = 'none';
    h4Element.parentNode.insertBefore(input, h4Element.nextSibling);
    input.focus();
    input.select();
    
    function finishEdit() {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            h4Element.textContent = newText;
            showMessage('🎉 Task title updated!', 'success');
        }
        h4Element.style.display = 'block';
        input.remove();
    }
    
    input.addEventListener('blur', finishEdit);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            finishEdit();
        }
        if (e.key === 'Escape') {
            h4Element.style.display = 'block';
            input.remove();
        }
    });
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.textContent = message;
    
    // Add some style for error messages
    if (type === 'error') {
        messageDiv.style.cssText = `
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            color: #721c24;
            padding: 1rem;
            border-radius: 15px;
            margin: 1rem 0;
            border: 3px solid #f5c6cb;
            font-weight: bold;
        `;
    }
    
    // Insert after form
    const form = document.getElementById('taskForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 4000);
}

console.log('🎉 JavaScript loaded! Your Django app is ready for action!');