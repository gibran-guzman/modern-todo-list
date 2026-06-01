/*
 * =============================================================================
 * Modern To-Do List Application - Módulo de Lógica de Negocio (CRUD)
 * Versión: 1.0.0
 * Autor:   Gibran Guzmán
 * Fecha:   2026-06-01
 *
 * Responsabilidades:
 *   - Gestión del estado de las tareas (crear, leer, actualizar, eliminar)
 *   - Persistencia en localStorage
 *   - Filtrado de tareas por estado
 * =============================================================================
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Identificador único de la tarea
 * @property {string} text - Contenido de la tarea
 * @property {boolean} completed - Estado de completado
 * @property {number} createdAt - Timestamp de creación
 */

const Todo = (() => {
  /** @type {string} Clave para localStorage */
  const STORAGE_KEY = 'modern-todo-list';

  /**
   * Obtiene todas las tareas desde localStorage.
   * @returns {Task[]}
   */
  function getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda el listado completo de tareas en localStorage.
   * @param {Task[]} tasks
   */
  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Genera un identificador único para cada tarea.
   * @returns {string}
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  }

  /**
   * Valida que el texto de la tarea no esté vacío.
   * @param {string} text
   * @returns {boolean}
   */
  function isValidText(text) {
    return typeof text === 'string' && text.trim().length > 0;
  }

  /**
   * Crea una nueva tarea y la persiste.
   * @param {string} text - Texto de la tarea
   * @returns {{ ok: boolean, task?: Task, error?: string }}
   */
  function create(text) {
    if (!isValidText(text)) {
      return { ok: false, error: 'La tarea no puede estar vacía.' };
    }

    const task = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    return { ok: true, task };
  }

  /**
   * Actualiza el estado "completado" de una tarea.
   * @param {string} id
   * @param {boolean} completed
   * @returns {{ ok: boolean, tasks?: Task[], error?: string }}
   */
  function toggle(id) {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return { ok: false, error: 'Tarea no encontrada.' };
    }

    task.completed = !task.completed;
    saveTasks(tasks);

    return { ok: true, tasks };
  }

  /**
   * Elimina una tarea por su ID.
   * @param {string} id
   * @returns {{ ok: boolean, tasks?: Task[], error?: string }}
   */
  function remove(id) {
    let tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return { ok: false, error: 'Tarea no encontrada.' };
    }

    tasks.splice(index, 1);
    saveTasks(tasks);

    return { ok: true, tasks };
  }

  /**
   * Retorna todas las tareas.
   * @returns {Task[]}
   */
  function getAll() {
    return getTasks();
  }

  /**
   * Retorna las tareas según un filtro.
   * @param {'all' | 'pending' | 'completed'} filter
   * @returns {Task[]}
   */
  function getFiltered(filter) {
    const tasks = getTasks();

    switch (filter) {
      case 'pending':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }

  /**
   * Cuenta las tareas pendientes.
   * @returns {number}
   */
  function countPending() {
    return getTasks().filter((t) => !t.completed).length;
  }

  return {
    create,
    toggle,
    remove,
    getAll,
    getFiltered,
    countPending,
  };
})();
