/*
 * =============================================================================
 * Modern To-Do List Application - Módulo Principal
 * Versión: 1.0.0
 * Autor:   Gibrán Guzmán
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
   * @returns {boolean} true si la inicialización fue exitosa
   */
  function init() {
    if (!cacheElements()) {
      console.error('App: no se pudieron encontrar los elementos del DOM necesarios.');
      return false;
    }
    bindEvents();
    render();
    return true;
  }

  /**
   * Cachea las referencias a los elementos del DOM.
   * @returns {boolean} true si todos los elementos críticos existen
   */
  function cacheElements() {
    elements.form = document.getElementById('todo-form');
    elements.input = document.getElementById('todo-input');
    elements.list = document.getElementById('todo-list');
    elements.count = document.getElementById('todo-count');
    elements.error = document.getElementById('error-message');
    elements.filters = document.querySelectorAll('.filter-btn');

    return elements.form && elements.input && elements.list;
  }

  /**
   * Registra los manejadores de eventos.
   */
  function bindEvents() {
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.filters.forEach((btn) => {
      btn.addEventListener('click', () => handleFilterClick(btn));
    });
    elements.list.addEventListener('click', handleListClick);
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
   * Maneja clics dentro de la lista de tareas usando event delegation.
   * @param {MouseEvent} event
   */
  function handleListClick(event) {
    const target = event.target;
    const li = target.closest('.todo-item');

    if (!li) return;

    const id = li.dataset.id;
    if (!id) return;

    if (target.classList.contains('todo-checkbox')) {
      Todo.toggle(id);
      render();
    } else if (target.classList.contains('todo-delete')) {
      Todo.remove(id);
      render();
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
   * Construye y muestra los elementos <li> de la lista de tareas usando
   * DocumentFragment para minimizar reflows.
   * @param {Task[]} tasks
   */
  function renderList(tasks) {
    const fragment = document.createDocumentFragment();

    if (tasks.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'No hay tareas que mostrar.';
      empty.className = 'todo-item';
      empty.style.justifyContent = 'center';
      empty.style.color = '#777';
      fragment.appendChild(empty);
    } else {
      tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = task.completed;

        const span = document.createElement('span');
        span.className = `todo-text${task.completed ? ' completed' : ''}`;
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.setAttribute('aria-label', `Eliminar tarea: ${task.text}`);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        fragment.appendChild(li);
      });
    }

    elements.list.innerHTML = '';
    elements.list.appendChild(fragment);
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
