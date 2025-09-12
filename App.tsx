
import React, { useState, useEffect, useRef, FC, useMemo, useCallback } from 'react';
import { Task } from './types';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client Setup ---
// IMPORTANT: For security, these should be stored in environment variables, not hardcoded.
// This app assumes SUPABASE_URL and SUPABASE_KEY are set in the execution environment.
const supabaseUrl = process.env.SUPABASE_URL || 'https://pkjwbkmciosrvbhpzglx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrandia21jaW9zcnZiaHB6Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDIwNzEsImV4cCI6MjA3MDU3ODA3MX0.Xkuvbre2CMOxRQBsDTZApQ8_AGKC_nxhmXTzx3uU8kE';
const supabase = createClient(supabaseUrl, supabaseKey);


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

const SparklesIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const SortAscendingIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
    </svg>
);

const ArrowsUpDownIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);


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
  const [sortOrder, setSortOrder] = useState<'asc' | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'filter'>('main');
  const menuRef = useRef<HTMLDivElement>(null);
  const allFiltersCheckboxRef = useRef<HTMLInputElement>(null);
  const editingTaskRef = useRef<HTMLDivElement>(null);

  const getDefaultDate = () => {
    const date = new Date();
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
    const assignees = tasks.map(t => t.whom?.trim()).filter(Boolean) as string[];
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

  const sortTasks = useCallback((tasksToSort: Task[], sortOrder: 'asc' | null) => {
    const tasksCopy = [...tasksToSort];
    if (!sortOrder) {
        // Only sort by completion status then by creation order (implicit from fetch)
        tasksCopy.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
        });
        return tasksCopy;
    }

    tasksCopy.sort((a, b) => {
        // Rule 1: Completed tasks always go to the bottom.
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        const dateA = a.date || null;
        const dateB = b.date || null;

        // Rule 2: Tasks with dates come before tasks without dates.
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;

        // Rule 3: Sort by date if both exist.
        if (dateA && dateB) {
            const dateComparison = dateA.localeCompare(dateB);
            if (dateComparison !== 0) return dateComparison;
        }

        // If dates are the same (or both are null), sort by time.
        const timeA = a.time || null;
        const timeB = b.time || null;

        // Rule 4: Tasks with times come before tasks without times (on the same day).
        if (timeA && !timeB) return -1;
        if (!timeA && timeB) return 1;

        // Rule 5: Sort by time if both exist.
        if (timeA && timeB) {
             return timeA.localeCompare(timeB);
        }
        
        // If dates and times are equivalent, maintain original order.
        return 0;
    });
    return tasksCopy;
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let tasksCopy = [...tasks];

    if (activeFilters.length > 0) {
      tasksCopy = tasksCopy.filter(task => task.whom && activeFilters.includes(task.whom));
    }
    
    return sortTasks(tasksCopy, sortOrder);
  }, [tasks, sortOrder, activeFilters, sortTasks]);

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
  
  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      if (data) {
        // IMPORTANT: Only update state if data has changed to prevent UI flicker.
        setTasks(currentTasks => {
            if (JSON.stringify(data) !== JSON.stringify(currentTasks)) {
                return data;
            }
            return currentTasks;
        });
      }
    } catch (error) {
      const supabaseError = error as { message: string };
      console.error("Failed to fetch tasks from Supabase:", supabaseError.message || error);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    if (isSavingSettings) return; // Prevent fetching while a save is in progress
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('sort_order, active_filters')
            .eq('id', 1)
            .single();

        if (error) throw error;
        
        if (data) {
            setSortOrder(currentSortOrder =>
                currentSortOrder !== data.sort_order ? data.sort_order : currentSortOrder
            );
            setActiveFilters(currentFilters =>
                JSON.stringify(currentFilters) !== JSON.stringify(data.active_filters)
                ? (data.active_filters || [])
                : currentFilters
            );
        }
    } catch (error) {
        const supabaseError = error as { message: string };
        console.error("Failed to fetch settings from Supabase:", supabaseError.message || error);
    }
  }, [isSavingSettings]);

  // Initial data fetch and optimized polling
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoaded(false);
      await Promise.all([fetchTasks(), fetchSettings()]);
      setIsLoaded(true);
    };
    initialFetch();

    const POLLING_INTERVAL = 1000; // 1 second
    const intervalId = setInterval(() => {
      fetchTasks();
      fetchSettings();
    }, POLLING_INTERVAL);
      
    return () => clearInterval(intervalId);
  }, [fetchTasks, fetchSettings]);


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

  const saveTask = useCallback(async (): Promise<Task[] | null> => {
    if (editingTaskId === null || editingText.trim() === '') {
      handleCancelEditing();
      return null;
    }
    
    const taskUpdates = {
      text: editingText.trim(),
      date: editingDate || null,
      time: editingTime || null,
      whom: editingWhom.trim() || null,
    };
    
    const { error } = await supabase
      .from('tasks')
      .update(taskUpdates)
      .eq('id', editingTaskId);
    
    if (error) {
      console.error("Failed to save task:", error.message);
      return null; // Don't update state on failure
    }
    
    const updatedTasks = tasks.map(task =>
        task.id === editingTaskId ? { ...task, ...taskUpdates } : task
    );
    return updatedTasks;

  }, [tasks, editingTaskId, editingText, editingDate, editingTime, editingWhom, handleCancelEditing]);
  
  const handleSaveEdit = useCallback(async () => {
    const updatedTasks = await saveTask();
    if (updatedTasks) {
      setTasks(updatedTasks);
      handleCancelEditing();
    }
  }, [saveTask, handleCancelEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingTaskRef.current && !editingTaskRef.current.contains(event.target as Node)) {
        void handleSaveEdit();
      }
    };

    if (editingTaskId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTaskId, handleSaveEdit]);
  
  // FIX: Refactored to use async/await with a try/finally block to address the TypeScript error.
  const handleFilterChange = async (newFilters: string[]) => {
      setActiveFilters(newFilters);
      setIsSavingSettings(true);
      try {
        const { error } = await supabase
          .from('settings')
          .upsert({ id: 1, active_filters: newFilters });
        
        if (error) {
          console.error("Failed to sync filter settings:", error.message);
        }
      } finally {
        setIsSavingSettings(false);
      }
  };

  const handleToggleAllFilters = () => {
    const newFilters = areAllFiltersSelected ? [] : uniqueAssignees;
    handleFilterChange(newFilters);
  };
  
  const handleIndividualFilterToggle = (assignee: string) => {
    const newFilters = activeFilters.includes(assignee)
        ? activeFilters.filter(a => a !== assignee)
        : [...activeFilters, assignee];
    handleFilterChange(newFilters);
  };

  const handleClearCompletedTasks = async () => {
    const completedTaskIds = tasks.filter(t => t.completed).map(t => t.id);
    if(completedTaskIds.length === 0) return;

    // Optimistic update
    const originalTasks = tasks;
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    setIsMenuOpen(false);
    setMenuView('main');

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
      
      if (error) {
        setTasks(originalTasks); // Revert on error
        throw error;
      }
    } catch (error) {
      const supabaseError = error as { message: string };
      console.error('Error clearing completed tasks:', supabaseError.message || error);
    }
  };

  const handleAddTask = async () => {
    if (creatorText.trim() === '') return;

    const newTaskData = {
      text: creatorText.trim(),
      completed: false,
      date: creatorDate || null,
      time: creatorTime || null,
      whom: creatorWhom.trim() || null,
    };

    const originalTasks = tasks;
    // Optimistic update for adding a new task
    const tempId = Date.now(); // Use a temporary ID for the key
    const newTask = { ...newTaskData, id: tempId, created_at: new Date().toISOString() };
    setTasks([newTask, ...originalTasks]);


    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert(newTaskData)
            .select()
            .single();

        if (error) {
          setTasks(originalTasks); // Revert on error
          throw error;
        }

        // After successful insert, replace the temp task with the real one from the DB
        // This ensures the ID is correct for future edits/deletes.
        if (data) {
          setTasks(currentTasks => 
            [data, ...currentTasks.filter(t => t.id !== tempId)]
          );
        }
        
        setCreatorText('');
        setCreatorDate(getDefaultDate());
        setCreatorTime('');
        setCreatorWhom('');
        
        if (isMobileCreatorVisible) {
            setIsMobileCreatorVisible(false);
        } else {
            creatorTextRef.current?.focus();
        }
    } catch(error) {
        const supabaseError = error as { message: string };
        console.error('Error adding task:', supabaseError.message || error);
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
                if (firstUncompleted) handleStartEditing(firstUncompleted, field);
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

  const handleToggleComplete = async (id: number) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    
    const newCompletedStatus = !taskToUpdate.completed;

    // Optimistic update
    const originalTasks = tasks;
    setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: newCompletedStatus } : task
    ));
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompletedStatus })
        .eq('id', id);

      if (error) {
        setTasks(originalTasks); // Revert on error
        throw error;
      }
    } catch (error) {
       const supabaseError = error as { message:string };
       console.error('Error toggling complete status:', supabaseError.message || error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    // Optimistic update
    const originalTasks = tasks;
    setTasks(tasks.filter(task => task.id !== id));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        setTasks(originalTasks); // Revert on error
        throw error;
      }
    } catch (error) {
      const supabaseError = error as { message:string };
      console.error('Error deleting task:', supabaseError.message || error);
    }
  };

  const handleStartEditing = (task: Task, fieldToFocus: 'text' | 'date' | 'time' | 'whom' = 'text') => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
    setEditingDate(task.date || '');
    setEditingTime(task.time || '');
    setEditingWhom(task.whom || '');
    setFocusOnField(fieldToFocus);
  };

  const handleSaveAndMove = async (currentTaskIndex: number, direction: 'up' | 'down' | 'left' | 'right' | 'enter') => {
    const updatedTasks = await saveTask();
    if (!updatedTasks) {
        handleCancelEditing();
        return;
    }
    setTasks(updatedTasks);
    
    // Recalculate sorted/filtered tasks based on the updated list to avoid using stale data
    let tasksCopy = [...updatedTasks];
    if (activeFilters.length > 0) {
      tasksCopy = tasksCopy.filter(task => task.whom && activeFilters.includes(task.whom));
    }
    const sortedTasksCopy = sortTasks(tasksCopy, sortOrder);
    
    const colOrder: ('text' | 'date' | 'time' | 'whom')[] = ['text', 'date', 'time', 'whom'];
    const currentColIndex = colOrder.indexOf(focusOnField || 'text');
    const totalRows = sortedTasksCopy.length;
    
    // Find the new index of the just-edited task in the potentially re-sorted list
    const newCurrentTaskIndex = sortedTasksCopy.findIndex(t => t.id === editingTaskId);
    if (newCurrentTaskIndex === -1) { // Task might have been filtered out
        handleCancelEditing();
        return;
    }
    
    let nextRowIndex = newCurrentTaskIndex;
    let nextColIndex = currentColIndex;

    switch (direction) {
        case 'enter':
        case 'down':
            nextRowIndex = (newCurrentTaskIndex + 1) % totalRows;
            break;
        case 'up':
            nextRowIndex = (newCurrentTaskIndex - 1 + totalRows) % totalRows;
            break;
        case 'right':
            nextColIndex = (currentColIndex + 1) % colOrder.length;
            break;
        case 'left':
            nextColIndex = (currentColIndex - 1 + colOrder.length) % colOrder.length;
            break;
    }

    const nextTaskToEdit = sortedTasksCopy[nextRowIndex];
    if (nextTaskToEdit) {
      const nextFieldToFocus = colOrder[nextColIndex];
      handleStartEditing(nextTaskToEdit, nextFieldToFocus);
    } else {
      handleCancelEditing();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, taskIndex: number, field: 'text' | 'date' | 'time' | 'whom') => {
    if (e.key === 'ArrowUp' && taskIndex === 0) {
        e.preventDefault();
        const updatedTasks = await saveTask();
        if (updatedTasks) {
            setTasks(updatedTasks);
        }
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
            await handleSaveAndMove(taskIndex, 'enter');
            break;
        case 'ArrowDown':
            e.preventDefault();
            await handleSaveAndMove(taskIndex, 'down');
            break;
        case 'ArrowUp':
            e.preventDefault();
            await handleSaveAndMove(taskIndex, 'up');
            break;
        case 'ArrowRight':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== (e.target as HTMLInputElement).value.length) return; 
            e.preventDefault();
            await handleSaveAndMove(taskIndex, 'right');
            break;
        case 'ArrowLeft':
            if (field === 'text' && (e.target as HTMLInputElement).selectionStart !== 0) return;
            e.preventDefault();
            await handleSaveAndMove(taskIndex, 'left');
            break;
        case 'Escape':
            e.preventDefault();
            handleCancelEditing();
            break;
        default:
            break;
    }
  };
  
  // FIX: Refactored to use async/await with a try/finally block to address the TypeScript error.
  const handleSortClick = async () => {
    const newSortOrder = sortOrder === 'asc' ? null : 'asc';
    setSortOrder(newSortOrder); // Optimistic local update
    setIsMenuOpen(false);
    
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, sort_order: newSortOrder });

      if (error) {
        console.error("Failed to sync sort setting:", error.message);
      }
    } finally {
        setIsSavingSettings(false);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isFilterOrSortActive = activeFilters.length > 0 || sortOrder !== null;

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-800 flex justify-center p-4" style={{ colorScheme: 'light' }}>
      <main className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/60 p-4 md:p-6">
          <header className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">To-Do Dashboard</h1>
              <p className="text-slate-500 mt-1 text-base">Hello there, here are your tasks for today.</p>
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
                                    onClick={() => setMenuView('filter')}
                                    className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    aria-label="Filter tasks"
                                    title="Filter"
                                >
                                    <FunnelIcon className="w-5 h-5" />
                                    {activeFilters.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
                                    )}
                                </button>
                                <div className="h-5 w-px bg-slate-200" aria-hidden="true"></div>
                                <button
                                    onClick={handleSortClick}
                                    className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    aria-label="Sort tasks"
                                    title={
                                        sortOrder === 'asc' ? "Clear sorting" : "Sort by oldest date and time"
                                    }
                                >
                                    {sortOrder === 'asc' ? <SortAscendingIcon className="w-5 h-5" /> :
                                     <ArrowsUpDownIcon className="w-5 h-5" />
                                    }
                                    {sortOrder !== null && (
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
                        {menuView === 'filter' && (
                             <div className="py-1">
                                <button onClick={() => setMenuView('main')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors font-semibold">
                                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                    Filter by Assignee
                                </button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <div className="max-h-60 overflow-y-auto px-2">
                                    {uniqueAssignees.length > 0 ? (
                                        <>
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
                                            {uniqueAssignees.map(assignee => (
                                                <label key={assignee} className="w-full text-left flex items-center px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer rounded-md">
                                                    <input
                                                        type="checkbox"
                                                        checked={activeFilters.includes(assignee)}
                                                        onChange={() => handleIndividualFilterToggle(assignee)}
                                                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 focus:ring-1 focus:ring-offset-0 mr-3"
                                                    />
                                                    <span>{assignee}</span>
                                                </label>
                                            ))}
                                        </>
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
                <span className="text-base md:text-sm font-semibold text-slate-600">Progress</span>
                <span className="text-base md:text-sm font-bold text-slate-600">{completedTasks} / {totalTasks} Completed</span>
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
            {!isMobileCreatorVisible && (
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
            )}
            
            {isMobileCreatorVisible && (
              <div className="md:hidden bg-slate-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="creator-text-mobile" className="text-base font-medium text-slate-600 block mb-1">Task</label>
                    <input
                      id="creator-text-mobile"
                      ref={creatorTextRef}
                      type="text"
                      value={creatorText}
                      onChange={(e) => setCreatorText(e.target.value)}
                      onKeyDown={(e) => handleCreatorKeyDown(e, 'text')}
                      placeholder="What needs to be done?"
                      className="w-full text-base text-slate-700 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="creator-date-mobile" className="text-base font-medium text-slate-600 block mb-1">Date</label>
                      <input
                        id="creator-date-mobile"
                        ref={creatorDateRef}
                        type="date"
                        value={creatorDate}
                        onChange={(e) => setCreatorDate(e.target.value)}
                        onKeyDown={(e) => handleCreatorKeyDown(e, 'date')}
                        className="w-full text-base text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="creator-time-mobile" className="text-base font-medium text-slate-600 block mb-1">Time</label>
                      <input
                        id="creator-time-mobile"
                        ref={creatorTimeRef}
                        type="time"
                        value={creatorTime}
                        onChange={(e) => setCreatorTime(e.target.value)}
                        onKeyDown={(e) => handleCreatorKeyDown(e, 'time')}
                        className="w-full text-base text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="creator-whom-mobile" className="text-base font-medium text-slate-600 block mb-1">Assignee</label>
                    <input
                      id="creator-whom-mobile"
                      ref={creatorWhomRef}
                      type="text"
                      value={creatorWhom}
                      onChange={(e) => setCreatorWhom(e.target.value)}
                      onKeyDown={(e) => handleCreatorKeyDown(e, 'whom')}
                      placeholder="Assign to..."
                      className="w-full text-base text-slate-500 p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button onClick={handleAddTask} className="flex-1 bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors text-base">Add Task</button>
                    <button onClick={() => setIsMobileCreatorVisible(false)} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-base">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {isLoaded && filteredAndSortedTasks.length > 0 ? (
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
                    className={`group bg-slate-50 px-4 py-3 rounded-lg flex items-center transition-all duration-300 hover:shadow-md hover:bg-white ${task.completed ? 'opacity-70' : ''}`}
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
                                  className="w-full text-base md:text-sm text-slate-700 p-0 m-0 border-none bg-transparent focus:ring-0 focus:outline-none"
                              />
                          </div>
                        </div>
                    
                        <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
                           <div className={`flex items-center md:w-28 transition-transform duration-300 ${focusOnField === 'date' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`date-${task.id}`} className="text-base md:hidden text-slate-500 w-20">Date</label>
                              <input
                                  id={`date-${task.id}`}
                                  ref={dateInputRef}
                                  type="date"
                                  value={editingDate}
                                  onChange={(e) => setEditingDate(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                                  className="w-full text-base md:text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none md:text-center hide-picker-indicator"
                              />
                          </div>
                    
                          <div className={`flex items-center mt-2 md:mt-0 md:w-24 transition-transform duration-300 ${focusOnField === 'time' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`time-${task.id}`} className="text-base md:hidden text-slate-500 w-20">Time</label>
                              <input
                                  id={`time-${task.id}`}
                                  ref={timeInputRef}
                                  type="time"
                                  value={editingTime}
                                  onChange={(e) => setEditingTime(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'time')}
                                  className="w-full text-base md:text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none hide-picker-indicator md:text-center"
                              />
                          </div>
                    
                           <div className={`flex items-center mt-2 md:mt-0 md:w-28 transition-transform duration-300 ${focusOnField === 'whom' ? 'scale-115' : ''} md:scale-100`}>
                              <label htmlFor={`whom-${task.id}`} className="text-base md:hidden text-slate-500 w-20">Assignee</label>
                              <input
                                  id={`whom-${task.id}`}
                                  ref={whomInputRef}
                                  type="text"
                                  value={editingWhom}
                                  onChange={(e) => setEditingWhom(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, index, 'whom')}
                                  placeholder="Assign to..."
                                  className="w-full text-base md:text-sm text-slate-500 p-2 rounded-md border border-slate-300 md:border-none md:p-0 md:bg-transparent focus:ring-1 focus:ring-sky-500 md:focus:ring-0 md:focus:outline-none md:text-center placeholder-slate-400"
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
                          <div className="ml-4 flex-1 min-w-0" onClick={() => handleStartEditing(task, 'text')}>
                            <p className={`text-base md:text-sm text-slate-800 truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
                              {task.text}
                            </p>
                            {(task.date || task.time || task.whom) && (
                                <div className="md:hidden text-sm text-slate-500 mt-1 flex items-center flex-wrap">
                                    {task.date && <span>{formatDateForDisplay(task.date)}</span>}
                                    {task.date && task.time && <span className="mx-1.5">&middot;</span>}
                                    {task.time && <span>{formatTimeForDisplay(task.time)}</span>}
                                    {(task.date || task.time) && task.whom && <span className="mx-1.5">&middot;</span>}
                                    {task.whom && <span className="font-medium">{task.whom}</span>}
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center flex-shrink-0 text-center text-sm">
                          <div className="w-28 text-slate-500 cursor-pointer" onClick={() => handleStartEditing(task, 'date')}>
                            {formatDateForDisplay(task.date)}
                          </div>
                          <div className="w-24 text-slate-500 cursor-pointer" onClick={() => handleStartEditing(task, 'time')}>
                            {formatTimeForDisplay(task.time)}
                          </div>
                          <div className="w-28 text-slate-500 truncate cursor-pointer" onClick={() => handleStartEditing(task, 'whom')}>
                            {task.whom}
                          </div>
                          <div className="w-20 flex items-center justify-center">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              aria-label="Delete task"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </React.Fragment>
                );
              })
            ) : (
                <div className="text-center py-12 px-6 bg-slate-50 rounded-lg">
                    <div className="mx-auto w-16 h-16 text-sky-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5m3-15H5.25c-1.12 0-2.06.914-2.06 2.06v11.88c0 1.146.94 2.06 2.06 2.06h11.88c1.12 0 2.06-.914 2.06-2.06V8.81c0-1.146-.94-2.06-2.06-2.06Z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-700">{isLoaded ? "All tasks accounted for!" : "Loading Tasks..."}</h3>
                    <p className="mt-2 text-base text-slate-500">
                        {isLoaded ? "Add a new task above to get started." : "Please wait a moment."}
                    </p>
                </div>
            )}
          </div>
        </div>
        {!isMobileCreatorVisible && (
            <button 
                onClick={() => setIsMobileCreatorVisible(true)}
                className="md:hidden fixed bottom-6 right-6 bg-sky-500 text-white p-4 rounded-full shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors z-10"
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
