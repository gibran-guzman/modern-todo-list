# Modern To-Do List Application

> Aplicación web To-Do List desarrollada bajo los requisitos de la norma ISO 9001
> para el diseño, desarrollo y liberación de productos de software.

---

## Parte A: Requisitos y Planificación (Diseño y Desarrollo)

### Especificaciones del Producto

#### Requisitos Funcionales

| ID  | Requisito | Descripción |
|-----|-----------|-------------|
| RF-01 | Gestión de tareas | El usuario debe poder agregar, marcar como completadas y eliminar tareas de la lista. |
| RF-02 | Persistencia local | Las tareas deben persistir en el navegador mediante localStorage para mantener el estado entre sesiones. |
| RF-03 | Filtro de visualización | El usuario debe poder filtrar las tareas por estado: todas, pendientes o completadas. |

#### Requisitos No Funcionales

| ID   | Requisito | Descripción |
|------|-----------|-------------|
| RNF-01 | Validación de entrada | Todos los formularios deben validar que los campos no estén vacíos y se debe mostrar retroalimentación visual al usuario. |
| RNF-02 | Código semántico y accesible | El HTML debe ser semántico, y el código debe seguir principios de clean code con comentarios y estructura modular. |

### Criterios de Aceptación

El software será considerado **"apto"** para su liberación cuando:

1. **CA-01**: El usuario puede agregar una tarea escribiendo texto y presionando Enter o haciendo clic en un botón.
2. **CA-02**: Se impide el ingreso de tareas vacías mostrando un mensaje de error claro.
3. **CA-03**: Las tareas persisten al recargar la página (verificable mediante localStorage).
4. **CA-04**: El usuario puede alternar el estado de una tarea entre pendiente y completada.
5. **CA-05**: El usuario puede eliminar una tarea individualmente.
6. **CA-06**: Los filtros (todas, pendientes, completadas) funcionan correctamente.
7. **CA-07**: El código HTML pasa la validación del W3C sin errores.
8. **CA-08**: El código incluye cabeceras con autor, fecha y versión del software.

---

## Parte C: Lista de Verificación de Calidad (Checklist ISO 9001 / Cláusula 8.6 Liberación)

| #  | Requisito | Estado |
|----|-----------|--------|
| 1  | El código pasa las pruebas de validación del W3C | ✓ |
| 2  | Existen controles de validación en los inputs de JavaScript (evitar campos vacíos) | ✓ |
| 3  | El código incluye cabeceras con autor, fecha y versión del software | ✓ |
| 4  | Buenas prácticas de desarrollo y clean code con versiones de código actualizadas | ✓ |

---

## Estructura del Proyecto

```
modern-todo-list/
├── index.html      # Punto de entrada con HTML semántico
├── css/
│   └── style.css   # Estilos de la aplicación
├── js/
│   ├── app.js      # Módulo principal - inicialización y coordinación
│   └── todo.js     # Módulo de lógica de negocio (CRUD de tareas)
├── README.md       # Documentación del proyecto
└── AGENTS.md       # Memoria de trabajo y convenciones
```

---

## Versión

**v1.0.0** — Primera versión estable del producto.
