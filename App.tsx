import React, { useState, useEffect, useRef, FC, useMemo, useCallback } from 'react';
import { Task } from './types';

// SVG Icon Components defined outside the main component
const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 0 0-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const DotsVerticalIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
);

const CheckIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const ChevronRightIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const ChevronLeftIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const FunnelIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.577a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
);

const ArrowsUpDownIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);

const SparklesIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


type SortKey = 'text' | 'date' | 'time' | 'whom';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingDate, setEditingDate] = useState<string>('');
  const [editingTime, setEditingTime] = useState<string>('');
  const [editingWhom, setEditingWhom] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMobileCreatorVisible, setIsMobileCreatorVisible] = useState<boolean>(false);
  
  // Sorting and Filtering State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'sort' | 'filter'>('main');
  const menuRef = useRef<HTMLDivElement>(null);
  const allFiltersCheckboxRef = useRef<HTMLInputElement>(null);
  const editingTaskRef = useRef<HTMLDivElement>(null);

  const getDefaultDate = () => {
    const date = new Date();
    date.setFullYear(2025);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [creatorText, setCreatorText] = useState('');
  const [creatorDate, setCreatorDate] = useState(getDefaultDate());
  const [creatorTime, setCreatorTime] = useState('');
  const [creatorWhom, setCreatorWhom] = useState('');

  const [focusOnField, setFocusOnField] = useState<'text' | 'date' | 'time' | 'whom' | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const whomInputRef = useRef<HTMLInputElement>(null);
  const creatorTextRef = useRef<HTMLInputElement>(null);
  const creatorDateRef = useRef<HTMLInputElement>(null);
  const creatorTimeRef = useRef<HTMLInputElement>(null);
  const creatorWhomRef = useRef<HTMLInputElement>(null);


  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const uniqueAssignees = useMemo(() => {
    const assignees = tasks.map(t => t.whom.trim()).filter(Boolean);
    return [...new Set(assignees)];
  }, [tasks]);

  const areAllFiltersSelected = useMemo(() => 
    uniqueAssignees.length > 0 && activeFilters.length === uniqueAssignees.length,
    [activeFilters, uniqueAssignees]
  );
  
  const areSomeFiltersSelected = useMemo(() =>
    activeFilters.length > 0 && activeFilters.length < uniqueAssignees.length,
    [activeFilters, uniqueAssignees]
  );

  const filteredAndSortedTasks = useMemo(() => {
    let tasksCopy = [...tasks];

    if (activeFilters.length > 0) {
      tasksCopy = tasksCopy.filter(task => activeFilters.includes(task.whom));
    }
    
    tasksCopy.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        if (sortConfig.key) {
            const key = sortConfig.key;
            const aValue = a[key];
            const bValue = b[key];

            if (!aValue) return 1;
            if (!bValue) return -1;

            const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' });
            
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        return 0;
    });
    
    return tasksCopy;
  }, [tasks, sortConfig, activeFilters]);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);
    
    return correctedDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (hours === undefined || minutes === undefined) return '';
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', timeFormatOptions);
  };
  
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        const defaultTasks = [
          { id: 1, text: 'Design the UI mockups for the new feature that the product team requested last week', completed: true, date: '2024-07-31', time: '10:00', whom: 'Alice' },
          { id: 2, text: 'Develop the main dashboard component', completed: false, date: '2024-08-01', time: '14:30', whom: 'Bob' },
          { id: 3, text: 'Integrate state management and write tests for all the new reducers.', completed: false, date: '2024-08-02', time: '11:00', whom: 'Charlie' },
        ];
        setTasks(defaultTasks);
      }
    } catch (error) {
        console.error("Failed to load tasks from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to local storage", error);
        }
    }
  }, [tasks, isLoaded]);
  
  useEffect(() => {
    if (editingTaskId === null) return;

    setTimeout(() => {
      if (focusOnField === 'text' && textInputRef.current) {
        textInputRef.current.focus();
      } else if (focusOnField === 'date' && dateInputRef.current) {
        dateInputRef.current.focus();
      } else if (focusOnField === 'time' && timeInputRef.current) {
        timeInputRef.current.focus();
      } else if (focusOnField === 'whom' && whomInputRef.current) {
        whomInputRef.current.focus();
      }
    }, 0);
  }, [editingTaskId, focusOnField]);
  
  useEffect(() => {
    if (allFiltersCheckboxRef.current) {
      allFiltersCheckboxRef.current.indeterminate = areSomeFiltersSelected;
    }
  }, [areSomeFiltersSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setMenuView('main');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCancelEditing = useCallback(() => {
    setEditingTaskId(null);
    setEditingText('');
    setEditingDate('');
    setEditingTime('');
    setEditingWhom('');
    setFocusOnField(null);
  }, []);

  const saveTask = useCallback((): Task[] | null => {
    if (editingTaskId === null || editingText.trim() === '') {
      handleCancelEditing();
      return null;
    }
    
    const updatedTasks = tasks.map(task =>
        task.id === editingTaskId ? { ...task, text: editingText.trim(), date: editingDate, time: editingTime, whom: editingWhom.trim() } : task
    );
    setTasks(updatedTasks);
    return updatedTasks;
  }, [tasks, editingTaskId, editingText, editingDate, editingTime, editingWhom, handleCancelEditing]);
  
  const handleSaveEdit = useCallback(() => {
    const updatedTasks = saveTask();
    if (updatedTasks) {
      handleCancelEditing();
    }
  }, [saveTask, handleCancelEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingTaskRef.current && !editingTaskRef.current.contains(event.target as Node)) {
        handleSaveEdit();
      }
    };

    if (editingTaskId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTaskId, handleSaveEdit]);

  const handleToggleAllFilters = () => {
    if (areAllFiltersSelected) {
      setActiveFilters([]);
    } else {
      setActiveFilters(uniqueAssignees);
    }
  };

  const handleClearCompletedTasks = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    setIsMenuOpen(false);
    setMenuView('main');
  };

  const handleAddTask = () => {
    if (creatorText.trim() === '') return;

    const newTask: Task = {
      id: Date.now(),
      text: creatorText.trim(),
      completed: false,
      date: creatorDate,
      time: creatorTime,
      whom: creatorWhom.trim(),
    };
    setTasks([newTask, ...tasks]);
    
    setCreatorText('');
    setCreatorDate(getDefaultDate());
    setCreatorTime('');
    setCreatorWhom('');
    
    if (isMobileCreatorVisible) {
      setIsMobileCreatorVisible(false);
    } else {
      creatorTextRef.current?.focus();
    }
  };
  
  const handleCreatorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'text' | 'date' | 'time' | 'whom') => {
    const colOrder: ('text' | 'date' | 'time' | 'whom')[] = ['text', 'date', 'time', 'whom'];
    const currentColIndex = colOrder.indexOf(field);

    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            handleAddTask();
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (filteredAndSortedTasks.length > 0) {
                const firstUncompleted = filteredAndSortedTasks.find(t => !t.completed) || filteredAndSortedTasks[0];
                handleStartEditing(firstUncompleted, field);
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (filteredAndSortedTasks.length > 0) {
                handleStartEditing(filteredAndSortedTasks[filteredAndSortedTasks.length - 1], field);
            }
            break;
        case 'ArrowRight':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== (e.target as HTMLInputElement).value.length) return;
            e.preventDefault();
            const nextColIndex = (currentColIndex + 1) % colOrder.length;
            const nextFieldToFocus = colOrder[nextColIndex];
            if (nextFieldToFocus === 'date' && creatorDateRef.current) creatorDateRef.current.focus();
            else if (nextFieldToFocus === 'time' && creatorTimeRef.current) creatorTimeRef.current.focus();
            else if (nextFieldToFocus === 'whom' && creatorWhomRef.current) creatorWhomRef.current.focus();
            else if (nextFieldToFocus === 'text' && creatorTextRef.current) creatorTextRef.current.focus();
            break;
        case 'ArrowLeft':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== 0) return;
            e.preventDefault();
            const prevColIndex = (currentColIndex - 1 + colOrder.length) % colOrder.length;
            const prevFieldToFocus = colOrder[prevColIndex];
            if (prevFieldToFocus === 'date' && creatorDateRef.current) creatorDateRef.current.focus();
            else if (prevFieldToFocus === 'time' && creatorTimeRef.current) creatorTimeRef.current.focus();
            else if (prevFieldToFocus === 'whom' && creatorWhomRef.current) creatorWhomRef.current.focus();
            else if (prevFieldToFocus === 'text' && creatorTextRef.current) creatorTextRef.current.focus();
            break;
        case 'Escape':
            e.preventDefault();
            setCreatorText('');
            setCreatorDate('');
            setCreatorTime('');
            setCreatorWhom('');
            if (isMobileCreatorVisible) {
                setIsMobileCreatorVisible(false);
            }
            break;
        default:
            break;
    }
  };

  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStartEditing = (task: Task, fieldToFocus: 'text' | 'date' | 'time' | 'whom' = 'text') => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
    setEditingDate(task.date);
    setEditingTime(task.time);
    setEditingWhom(task.whom);
    setFocusOnField(fieldToFocus);
  };

  const handleSaveAndMove = (currentTaskIndex: number, direction: 'up' | 'down' | 'left' | 'right' | 'enter') => {
    saveTask();

    if (filteredAndSortedTasks.length === 0) {
      handleCancelEditing();
      return;
    }
    
    const colOrder: ('text' | 'date' | 'time' | 'whom')[] = ['text', 'date', 'time', 'whom'];
    const currentColIndex = colOrder.indexOf(focusOnField || 'text');
    const totalRows = filteredAndSortedTasks.length;
    
    let nextRowIndex = currentTaskIndex;
    let nextColIndex = currentColIndex;

    switch (direction) {
        case 'enter':
        case 'down':
            nextRowIndex = (currentTaskIndex + 1) % totalRows;
            break;
        case 'up':
            nextRowIndex = (currentTaskIndex - 1 + totalRows) % totalRows;
            break;
        case 'right':
            nextColIndex = (currentColIndex + 1) % colOrder.length;
            break;
        case 'left':
            nextColIndex = (currentColIndex - 1 + colOrder.length) % colOrder.length;
            break;
    }

    const nextTaskToEdit = filteredAndSortedTasks[nextRowIndex];
    const nextFieldToFocus = colOrder[nextColIndex];
    handleStartEditing(nextTaskToEdit, nextFieldToFocus);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, taskIndex: number, field: 'text' | 'date' | 'time' | 'whom') => {
    if (e.key === 'ArrowUp' && taskIndex === 0) {
        e.preventDefault();
        saveTask();
        handleCancelEditing();

        if (field === 'date' && creatorDateRef.current) creatorDateRef.current.focus();
        else if (field === 'time' && creatorTimeRef.current) creatorTimeRef.current.focus();
        else if (field === 'whom' && creatorWhomRef.current) creatorWhomRef.current.focus();
        else if (creatorTextRef.current) creatorTextRef.current.focus();
        return;
    }

    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            handleSaveAndMove(taskIndex, 'enter');
            break;
        case 'ArrowDown':
            e.preventDefault();
            handleSaveAndMove(taskIndex, 'down');
            break;
        case 'ArrowUp':
            e.preventDefault();
            handleSaveAndMove(taskIndex, 'up');
            break;
        case 'ArrowRight':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== (e.target as HTMLInputElement).value.length) return; 
            e.preventDefault();
            handleSaveAndMove(taskIndex, 'right');
            break;
        case 'ArrowLeft':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== 0) return;
            e.preventDefault();
            handleSaveAndMove(taskIndex, 'left');
            break;
        case 'Escape':
            e.preventDefault();
            handleCancelEditing();
            break;
        default:
            break;
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isFilterOrSortActive = activeFilters.length > 0 || sortConfig.key !== null;

  const renderSortOption = (label: string, key: SortKey | null, direction: 'asc' | 'desc') => {
    const isActive = sortConfig.key === key && sortConfig.direction === direction;
    return (
        <button
            onClick={() => {
                setSortConfig({ key, direction });
                setIsMenuOpen(false);
                setMenuView('main');
            }}
            className={`w-full text-left flex justify-between items-center px-4 py-2 text-sm ${isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-700'} hover:bg-slate-100 transition-colors`}
            role="menuitem"
        >
            <span>{label}</span>
            {isActive && <CheckIcon className="w-4 h-4 text-sky-600" />}
        </button>
    );
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-800 flex justify-center md:items-center p-4" style={{ colorScheme: 'light' }}>
      <main className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/60 p-4 md:p-6">
          <header className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">To-Do Dashboard</h1>
              <p className="text-slate-500 mt-1">Hello there, here are your tasks for today.</p>
            </div>
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(prev => !prev);
                      if (isMenuOpen) setMenuView('main');
                    }}
                    className={`relative p-2 rounded-full ${isFilterOrSortActive ? 'text-sky-600 bg-sky-100' : 'text-slate-500'} hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500`}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open options</span>
                    <DotsVerticalIcon className="w-5 h-5" />
                     {isFilterOrSortActive && (
                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
                    )}
                </button>
                {isMenuOpen && (
                    <div
                        ref={menuRef}
                        className={`absolute right-0 mt-2 ${menuView === 'main' ? 'w-auto' : 'w-56 md:w-64'} origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                    >
                        {menuView === 'main' && (
                            <div className="p-1 flex items-center space-x-1">
                                <button
                                    onClick={() => setMenuView('sort')}
                                    className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    aria-label="Sort tasks"
                                    title="Sort tasks"
                                >
                                    <ArrowsUpDownIcon className="w-5 h-5" />
                                </button>
                                <div className="h-5 w-px bg-slate-200" aria-hidden="true"></div>
                                <button
                                    onClick={() => setMenuView('filter')}
                                    className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    aria-label="Filter tasks"
                                    title="Filter tasks"
                                >
                                    <FunnelIcon className="w-5 h-5" />
                                    {activeFilters.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
                                    )}
                                </button>
                                {completedTasks > 0 && (
                                    <>
                                        <div className="h-5 w-px bg-slate-200" aria-hidden="true"></div>
                                        <button
                                            onClick={handleClearCompletedTasks}
                                            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            aria-label="Clear completed tasks"
                                            title="Clear completed tasks"
                                        >
                                            <SparklesIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                        {menuView === 'sort' && (
                            <div className="py-1">
                                <button onClick={() => setMenuView('main')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors font-semibold">
                                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                    Back
                                </button>
                                <div className="border-t border-slate-100 mb-1"></div>
                                <div className="px-4 py-2 text-xs text-slate-500 uppercase font-semibold tracking-wider">Sort by</div>
                                {renderSortOption('Date (Newest first)', 'date', 'desc')}
                                {renderSortOption('Date (Oldest first)', 'date', 'asc')}
                                {renderSortOption('Time (Earliest first)', 'time', 'asc')}
                                {renderSortOption('Time (Latest first)', 'time', 'desc')}
                                {renderSortOption('Assignee (A-Z)', 'whom', 'asc')}
                                {renderSortOption('Assignee (Z-A)', 'whom', 'desc')}
                                <div className="border-t border-slate-100 my-1"></div>
                                {renderSortOption('Default Order', null, 'asc')}
                            </div>
                        )}
                        {menuView === 'filter' && (
                            <div className="py-1">
                                <button onClick={() => setMenuView('main')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors font-semibold">
                                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                    Back
                                </button>
                                <div className="border-t border-slate-100 mb-1"></div>
                                <div className="px-4 py-2 text-xs text-slate-500 uppercase font-semibold tracking-wider">Filter by Assignee</div>
                                <div className="max-h-60 overflow-y-auto px-2">
                                    <label className="w-full text-left flex items-center px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer rounded-md">
                                        <input
                                            ref={allFiltersCheckboxRef}
                                            type="checkbox"
                                            checked={areAllFiltersSelected}
                                            onChange={handleToggleAllFilters}
                                            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 focus:ring-1 focus:ring-offset-0 mr-3"
                                        />
                                        <span>All</span>
                                    </label>
                                    <div className="border-t border-slate-200 my-1 mx-2"></div>
                                    {uniqueAssignees.length > 0 ? (
                                        uniqueAssignees.map(assignee => (
                                            <label key={assignee} className="w-full text-left flex items-center px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer rounded-md">
                                                <input
                                                    type="checkbox"
                                                    checked={activeFilters.includes(assignee)}
                                                    onChange={() => {
                                                        setActiveFilters(prev => 
                                                            prev.includes(assignee) 
                                                            ? prev.filter(a => a !== assignee) 
                                                            : [...prev, assignee]
                                                        )
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 focus:ring-1 focus:ring-offset-0 mr-3"
                                                />
                                                <span>{assignee}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-slate-500">No assignees found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </header>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600">Progress</span>
                <span className="text-sm font-bold text-slate-600">{completedTasks} / {totalTasks} Completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{width: `${progress}%`}}
                ></div>
            </div>
          </div>

          <div className="hidden md:flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 pt-4">
            <div className="flex-1 flex items-center">
                <div className="w-5 h-5 flex-shrink-0" aria-hidden="true"></div>
                <div className="ml-4 flex-1">Task</div>
            </div>
            <div className="flex items-center flex-shrink-0 text-center">
                <div className="w-28">Date</div>
                <div className="w-24">Time</div>
                <div className="w-28">Whom</div>
                <div className="w-20">Actions</div>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="hidden md:block bg-slate-50 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0" aria-hidden="true"></div>
                    <div className="ml-4 flex-1">
                        <input
                            ref={creatorTextRef}
                            type="text"
                            value={creatorText}
                            onChange={(e) => setCreatorText(e.target.value)}
                            onKeyDown={(e) => handleCreatorKeyDown(e, 'text')}
                            placeholder="Add a new task..."
                            className="w-full text-slate-700 p-0 m-0 border-none bg-transparent focus:ring-0 focus:outline-none placeholder-slate-400 text-sm"
                        />
                    </div>
                    <div className="w-28">
                        <input
                            ref={creatorDateRef}
                            type="date"
                            value={creatorDate}
                            onChange={(e) => setCreatorDate(e.target.value)}
                            onKeyDown={(e) => handleCreatorKeyDown(e, 'date')}
                            className="w-full text-sm text-slate-500 border-none bg-transparent p-0 text-center focus:ring-0 focus:outline-none hide-picker-indicator"
                        />
                    </div>
                    <div className="w-24">
                        <input
                            ref={creatorTimeRef}
                            type="time"
                            value={creatorTime}
                            onChange={(e) => setCreatorTime(e.target.value)}
                            onKeyDown={(e) => handleCreatorKeyDown(e, 'time')}
                            className="w-full text-sm text-slate-500 border-none bg-transparent p-0 text-center focus:ring-0 focus:outline-none hide-picker-indicator"
                        />
                    </div>
                    <div className="w-28">
                        <input
                            ref={creatorWhomRef}
                            type="text"
                            value={creatorWhom}
                            onChange={(e) => setCreatorWhom(e.target.value)}
                            onKeyDown={(e) => handleCreatorKeyDown(e, 'whom')}
                            placeholder="Assign to..."
                            className="w-full text-sm text-slate-500 border-none bg-transparent p-0 text-center focus:ring-0 focus:outline-none placeholder-slate-400"
                        />
                    </div>
                    <div className="w-20 flex items-center justify-center">
                        <button
                            onClick={handleAddTask}
                            className="text-slate-400 hover:text-sky-600 p-2 rounded-full hover:bg-sky-100 transition-colors"
                            aria-label="Add new task"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            
            {isMobileCreatorVisible && (
              <div className="md:hidden bg-slate-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="creator-text-mobile" className="text-sm font-medium text-slate-600 block mb-1">Task</label>
                    <input
                      id="creator-text-mobile"
                      ref={creatorTextRef}
                      type="text"
                      value={creatorText}
                      onChange={(e) => setCreatorText(e.target.value)}
                      onKeyDown={(e) => handleCreatorKeyDown(e, 'text')}
                      placeholder="What needs to be done?"
                      className="w-full text-slate-700 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="creator-date-mobile" className="text-sm font-medium text-slate-600 block mb-1">Date</label>
                      <input
                        id="creator-date-mobile"
                        ref={creatorDateRef}
                        type="date"
                        value={creatorDate}
                        onChange={(e) => setCreatorDate(e.target.value)}
                        onKeyDown={(e) => handleCreatorKeyDown(e, 'date')}
                        className="w-full text-sm text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="creator-time-mobile" className="text-sm font-medium text-slate-600 block mb-1">Time</label>
                      <input
                        id="creator-time-mobile"
                        ref={creatorTimeRef}
                        type="time"
                        value={creatorTime}
                        onChange={(e) => setCreatorTime(e.target.value)}
                        onKeyDown={(e) => handleCreatorKeyDown(e, 'time')}
                        className="w-full text-sm text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="creator-whom-mobile" className="text-sm font-medium text-slate-600 block mb-1">Assignee</label>
                    <input
                      id="creator-whom-mobile"
                      ref={creatorWhomRef}
                      type="text"
                      value={creatorWhom}
                      onChange={(e) => setCreatorWhom(e.target.value)}
                      onKeyDown={(e) => handleCreatorKeyDown(e, 'whom')}
                      placeholder="Assign to..."
                      className="w-full text-sm text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button onClick={handleAddTask} className="flex-1 bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Add Task</button>
                    <button onClick={() => setIsMobileCreatorVisible(false)} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((task, index) => {
                const isFirstCompleted = task.completed && (index === 0 || !filteredAndSortedTasks[index - 1].completed);
                return (
                <React.Fragment key={task.id}>
                  {isFirstCompleted && (
                    <div className="flex items-center my-1" aria-hidden="true">
                        <span className="flex-shrink text-xs font-semibold text-slate-400 uppercase">Completed</span>
                        <div className="flex-grow border-t border-slate-200 ml-2"></div>
                    </div>
                  )}
                  <div
                    className={`bg-slate-50 px-4 py-3 rounded-lg flex items-center transition-all duration-300 hover:shadow-md hover:bg-white ${task.completed ? 'opacity-70' : ''}`}
                  >
                    {editingTaskId === task.id ? (
                      <div ref={editingTaskRef} className="w-full flex flex-col md:flex-row md:items-center">
                        <div className="flex items-center flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id)}
                            className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer bg-white flex-shrink-0"
                          />
                          <div className="ml-4 flex-1 min-w-0">
                              <input
                                  ref={textInputRef}
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'text')}
                                  className="w-full text-sm text-slate-700 p-0 m-0 border-none bg-transparent focus:ring-0 focus:outline-none"
                              />
                          </div>
                        </div>
                    
                        <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
                           <div className={`flex items-center md:w-28 transition-transform duration-300 ${focusOnField === 'date' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`date-${task.id}`} className="text-sm text-slate-500 w-20 md:hidden">Date</label>
                              <input
                                  id={`date-${task.id}`}
                                  ref={dateInputRef}
                                  type="date"
                                  value={editingDate}
                                  onChange={(e) => setEditingDate(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                                  className="w-full text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none md:text-center"
                              />
                          </div>
                    
                          <div className={`flex items-center mt-2 md:mt-0 md:w-24 transition-transform duration-300 ${focusOnField === 'time' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`time-${task.id}`} className="text-sm text-slate-500 w-20 md:hidden">Time</label>
                              <input
                                  id={`time-${task.id}`}
                                  ref={timeInputRef}
                                  type="time"
                                  value={editingTime}
                                  onChange={(e) => setEditingTime(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'time')}
                                  className="w-full text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none hide-picker-indicator md:text-center"
                              />
                          </div>
                    
                           <div className={`flex items-center mt-2 md:mt-0 md:w-28 transition-transform duration-300 ${focusOnField === 'whom' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`whom-${task.id}`} className="text-sm text-slate-500 w-20 md:hidden">Assignee</label>
                              <input
                                  id={`whom-${task.id}`}
                                  ref={whomInputRef}
                                  type="text"
                                  value={editingWhom}
                                  onChange={(e) => setEditingWhom(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'whom')}
                                  placeholder="Assign to..."
                                  className="w-full text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none md:text-center placeholder-slate-400"
                              />
                          </div>
                          
                          <div className="flex items-center justify-end md:justify-center md:w-20 mt-4 md:mt-0">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                              aria-label="Delete task"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id)}
                            className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer bg-white flex-shrink-0"
                          />
                          <div className="ml-4 flex-1 cursor-pointer min-w-0" onClick={() => handleStartEditing(task, 'text')}>
                              <span className={`text-sm text-slate-700 break-words ${task.completed ? 'line-through text-slate-400' : ''}`}>
                              {task.text}
                              </span>
                               <div className="flex items-center gap-2 text-xs text-slate-400 md:hidden flex-wrap">
                                  {task.date && <span className="cursor-pointer hover:text-sky-600" onClick={(e) => { e.stopPropagation(); handleStartEditing(task, 'date'); }}>{formatDateForDisplay(task.date)}</span>}
                                  {task.date && task.time && <span className="text-slate-300">&middot;</span>}
                                  {task.time && <span className="cursor-pointer hover:text-sky-600" onClick={(e) => { e.stopPropagation(); handleStartEditing(task, 'time'); }}>{formatTimeForDisplay(task.time)}</span>}
                                  {(task.date || task.time) && task.whom && <span className="text-slate-300">&middot;</span>}
                                  {task.whom && <span className="cursor-pointer hover:text-sky-600" onClick={(e) => { e.stopPropagation(); handleStartEditing(task, 'whom'); }}>{task.whom}</span>}
                              </div>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center flex-shrink-0">
                          <span className="text-sm text-slate-500 w-28 text-center cursor-pointer" onClick={() => handleStartEditing(task, 'date')}>{formatDateForDisplay(task.date)}</span>
                          <span className="text-sm text-slate-500 w-24 text-center cursor-pointer" onClick={() => handleStartEditing(task, 'time')}>{formatTimeForDisplay(task.time)}</span>
                          <span className="text-sm text-slate-500 w-28 text-center cursor-pointer" onClick={() => handleStartEditing(task, 'whom')}>{task.whom}</span>
                          <div className="flex items-center justify-center w-20">
                              <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                              aria-label="Delete task"
                              >
                              <TrashIcon />
                              </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:hidden">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                            aria-label="Delete task"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </React.Fragment>
              )})
            ) : (
                <div className="text-center py-8 border-t border-slate-200 mt-4">
                    <p className="text-slate-500">{ activeFilters.length > 0 ? `No tasks found for the selected filters.` : "You have no tasks yet. Add one to get started!"}</p>
                </div>
            )}
          </div>
        </div>
        {!isMobileCreatorVisible && (
          <button
            onClick={() => {
              setIsMobileCreatorVisible(true);
              setTimeout(() => creatorTextRef.current?.focus(), 100);
            }}
            className="md:hidden fixed bottom-6 right-6 bg-sky-500 text-white p-4 rounded-full shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 z-10"
            aria-label="Add new task"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        )}
      </main>
    </div>
  );
};

export default App;