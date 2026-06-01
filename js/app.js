/*
 * =============================================================================
 * Modern To-Do List Application - Módulo Principal
 * Versión: 1.0.0
 * Autor:   Gibran Guzmán
 * Fecha:   2026-06-01
 *
 * Responsabilidades:
 *   - Inicialización de la aplicación
 *   - Manejo de eventos del DOM
 *   - Renderizado de la interfaz
 *   - Coordinación entre el DOM y el módulo Todo
 * =============================================================================
 */

const App = (() => {
  /** @type {string} Filtro activo actual */
  let currentFilter = 'all';

  /** Referencias a elementos del DOM */
  const elements = {
    form: null,
    input: null,
    list: null,
    count: null,
    error: null,
    filters: [],
  };

  /**
   * Inicializa la aplicación: cachea referencias, registra eventos y renderiza.
   */
  function init() {
    cacheElements();
    bindEvents();
    render();
  }

  /**
   * Cachea las referencias a los elementos del DOM para evitar consultas repetidas.
   */
  function cacheElements() {
    elements.form = document.getElementById('todo-form');
    elements.input = document.getElementById('todo-input');
    elements.list = document.getElementById('todo-list');
    elements.count = document.getElementById('todo-count');
    elements.error = document.getElementById('error-message');
    elements.filters = document.querySelectorAll('.filter-btn');
  }

  /**
   * Registra los manejadores de eventos.
   */
  function bindEvents() {
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.input.addEventListener('keydown', handleInputKeydown);
    elements.filters.forEach((btn) => {
      btn.addEventListener('click', () => handleFilterClick(btn));
    });
  }

  // ---------------------------------------------------------------------------
  // Manejadores de eventos
  // ---------------------------------------------------------------------------

  /**
   * Maneja el envío del formulario para agregar una nueva tarea.
   * @param {Event} event
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    const text = elements.input.value;
    const result = Todo.create(text);

    if (!result.ok) {
      showError(result.error);
      return;
    }

    clearError();
    elements.input.value = '';
    elements.input.focus();
    render();
  }

  /**
   * Permite agregar una tarea presionando Enter.
   * @param {KeyboardEvent} event
   */
  function handleInputKeydown(event) {
    if (event.key === 'Enter') {
      elements.form.dispatchEvent(new Event('submit'));
    }
  }

  /**
   * Maneja el clic en los botones de filtro.
   * @param {HTMLElement} btn
   */
  function handleFilterClick(btn) {
    elements.filters.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  }

  /**
   * Maneja el clic en el checkbox de una tarea.
   * @param {string} id
   */
  function handleToggle(id) {
    Todo.toggle(id);
    render();
  }

  /**
   * Maneja el clic en el botón de eliminar de una tarea.
   * @param {string} id
   */
  function handleDelete(id) {
    Todo.remove(id);
    render();
  }

  // ---------------------------------------------------------------------------
  // Renderizado
  // ---------------------------------------------------------------------------

  /**
   * Renderiza la lista de tareas y actualiza el contador.
   */
  function render() {
    const tasks = Todo.getFiltered(currentFilter);
    renderList(tasks);
    renderCount();
  }

  /**
   * Construye y muestra los elementos <li> de la lista de tareas.
   * @param {Task[]} tasks
   */
  function renderList(tasks) {
    elements.list.innerHTML = '';

    if (tasks.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'No hay tareas que mostrar.';
      empty.className = 'todo-item';
      empty.style.justifyContent = 'center';
      empty.style.color = '#777';
      elements.list.appendChild(empty);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = task.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => handleToggle(task.id));

      const span = document.createElement('span');
      span.className = `todo-text${task.completed ? ' completed' : ''}`;
      span.textContent = task.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.setAttribute('aria-label', `Eliminar tarea: ${task.text}`);
      deleteBtn.addEventListener('click', () => handleDelete(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      elements.list.appendChild(li);
    });
  }

  /**
   * Actualiza el contador de tareas pendientes.
   */
  function renderCount() {
    const pending = Todo.countPending();
    elements.count.textContent = `${pending} tarea${pending !== 1 ? 's' : ''} pendiente${pending !== 1 ? 's' : ''}`;
  }

  // ---------------------------------------------------------------------------
  // Retroalimentación al usuario
  // ---------------------------------------------------------------------------

  /**
   * Muestra un mensaje de error en la interfaz.
   * @param {string} message
   */
  function showError(message) {
    elements.error.textContent = message;
    elements.input.classList.add('error');
  }

  /**
   * Limpia el mensaje de error y el estilo de error del input.
   */
  function clearError() {
    elements.error.textContent = '';
    elements.input.classList.remove('error');
  }

  // Inicializar la aplicación al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
